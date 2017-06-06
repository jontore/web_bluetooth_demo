import React, { Component } from 'react';

import { Buffer } from 'buffer';

import {
  Text,
  View,
  StyleSheet,
  Vibration
} from 'react-native';

class TemperatureDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      temperature: "Na"
    };

    this.pollForData = this.pollForData.bind(this);
  }

  componentDidMount() {
    this.pollForData();
  }

  pollForData() {
    const device = this.state.connected;
    this.props.device.monitorCharacteristicForService(this.props.serviceId, this.props.serviceId, (error, characteristic) => {
        this.setState({
          temperature: TemperatureDisplay.readFloat(characteristic.value)
        });
    });
  }

  static readFloat(b64EncodedValue) {
    return new Buffer(b64EncodedValue, "base64").readFloatLE(0).toFixed(2);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>{this.state.temperature}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  info: {
    fontSize: 30,
    padding: 40,
    color: 'white'
  }
});

export default TemperatureDisplay;
