import React, { Component } from 'react';

import { BleManager } from 'react-native-ble-plx';

import base64 from 'base-64';

import {
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  Vibration
} from 'react-native';

const TEMP_SERVICE_CHARACTERISTIC_UUID = "72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6";
const vibrationPattern = [0, 500, 200, 500];
class PairButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pairing: false,
      connecting: false,
      connected: {},
      devices: []
    }

    this.manager = new BleManager();

    this.pair = this.pair.bind(this);
    this._renderItem = this._renderItem.bind(this);
    this.pollForData = this.pollForData.bind(this);
    this.scanAndConnect = this.scanAndConnect.bind(this);
    this.connectToDevice = this.connectToDevice.bind(this);
  }

  scanAndConnect() {
    this.setState({
      pairing: true
    });
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            return
        }

        if (device.serviceUUIDs && device.serviceUUIDs.length > 0 && device.serviceUUIDs[0] === TEMP_SERVICE_CHARACTERISTIC_UUID) {
          const isInList = this.state.devices.find(({ id }) => id === device.id);
          if (!isInList) {
            this.setState({
              devices: [...this.state.devices, device],
              pairing: false
            });
          }
        }
    });
  }

  pair() {
    this.scanAndConnect();
  }

  connectToDevice(device) {
    this.setState({
      connecting: true
    }, () => {
      device.isConnected()
      .then((isConnected) => {
        if(isConnected) {
          return new Promise((resolve) => resolve(device))
        } else {
          return device.connect();
        }
      })
      .then(device => device.discoverAllServicesAndCharacteristics())
      .then(() => {
        this.setState({
          connecting: false,
          connected: device
        }, this.pollForData);
      })
      .catch(console.errror);
    });
  }

  pollForData() {
    const device = this.state.connected;
    device.monitorCharacteristicForService(TEMP_SERVICE_CHARACTERISTIC_UUID, TEMP_SERVICE_CHARACTERISTIC_UUID, (error, characteristic) => {
        console.log('@@@', base64.decode(characteristic.value), characteristic)
        this.setState({
          temperature: characteristic.value
        });
    });
  }

  _keyExtractor = (item, index) => item.id;

  _renderItem({ item: device }) {
    return (
      <Button
        title={device.name}
        disabled={this.state.connecting || this.state.connected.id === device.id}
        onPress={() => this.connectToDevice(device)}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        { this.state.devices.length === 0 ?
          <Button
            title="pair"
            onPress={this.pair}
            style={styles.button}
            disabled={this.state.pairing}
          />
          : null
        }
        <Text>TEMP</Text>
        <Text>{this.state.temperature}</Text>
        <Text>{this.state.connecting ? 'Connecting' : (this.state.connected ? 'Connected' : 'Not connected')}</Text>
        <FlatList
          data={this.state.devices}
          keyExtractor={(item) => item.id}
          renderItem={this._renderItem}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  fullWidth: {
    width: 250,
    flexGrow: 2
  },
  button: {
    padding: 20
  }
});

export default PairButton;
