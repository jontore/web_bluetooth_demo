/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import PairButton from './src/containers/pairButton';
import TemperatureDisplay from './src/containers/temperatureDisplay';

const TEMP_SERVICE_CHARACTERISTIC_UUID = "72664d13-e5bd-4dfd-b184-6fa5b5f9c2e6";
export default class reactNativeThermo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: null
    };

    this.onDeviceConnected = this.onDeviceConnected.bind(this);
  }

  onDeviceConnected(device) {
    console.log('---- devic', device);
    this.setState({
      device
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          TEMPERATURE!
        </Text>
        {!this.state.device ?
            <PairButton serviceId={TEMP_SERVICE_CHARACTERISTIC_UUID} onConnection={this.onDeviceConnected}/>
          :<TemperatureDisplay serviceId={TEMP_SERVICE_CHARACTERISTIC_UUID} device={this.state.device}/> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6E6E6E'
  },
  title: {
    fontSize: 31,
    textAlign: 'center',
    color: "#6576BF",
    margin: 10
  }
});

AppRegistry.registerComponent('reactNativeThermo', () => reactNativeThermo);
