import React, { Component } from 'react';

import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Vibration
} from 'react-native';

import Button from './button';

const vibrationPattern = [0, 500, 200, 500];
class PairButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connecting: false,
      connected: null,
      devices: []
    }

    this.manager = new BleManager();

    this._renderItem = this._renderItem.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.scanAndConnect = this.scanAndConnect.bind(this);
    this.connectToDevice = this.connectToDevice.bind(this);
  }

  componentWillMount() {
    const subscription = this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
            this.scanAndConnect();
            subscription.remove();
        }
    }, true);
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
            // Handle error (scanning will be stopped automatically)
            return
        }
        if (device.serviceUUIDs && device.serviceUUIDs.length > 0 && device.serviceUUIDs[0] === this.props.serviceId) {
          const isInList = this.state.devices.find(({ id }) => id === device.id);
          if (!isInList) {
            this.setState({
              devices: [...this.state.devices, device]
            });
          }
        }
    });
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
        }, () => this.props.onConnection(device));
      })
      .catch((error) => {
        this.setState({
          connecting: true,
          error: 'Could not connect'
        });
        console.error(error);
      });
    });
  }

  _keyExtractor = (item, index) => item.id;

  _renderItem({ item: device }) {
    return (
      <Button
        title={device.name}
        disabled={this.state.connecting}
        onPress={() => this.connectToDevice(device)}
      />
    );
  }

  getMessage() {
    if (this.state.error) {
      return this.state.error;
    }

    if (this.state.devices.length === 0 ) {
      return 'No Temperature device found';
    }

    if (this.state.connecting) {
      return 'Connecting';
    }

    if (this.state.connected) {
      return 'Connected'
    }

    return 'Not connected';
  }

  render() {
    function listHeader() {
      return (<Text>Devices:</Text>);
    };
    return (
      <View style={styles.container}>
        <Text style={styles.instruction}>{this.getMessage()}</Text>
        {this.state.devices.length > 0 ?
          <FlatList
            style={styles.list}
            ListHeaderComponent={listHeader}
            data={this.state.devices}
            keyExtractor={(item) => item.id}
            renderItem={this._renderItem}
          />
          : <Button title="Refresh" onPress={this.scanAndConnect}/>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6E6E6E'
  },
  list: {
    backgroundColor: '#6E6E6E'
  },
  instruction: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});

export default PairButton;
