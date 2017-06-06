import React, { Component } from 'react';

import {
  StyleSheet
} from 'react-native';

import Button from 'react-native-button';

const myButton = (props) => (
  <Button
    style={styles.button}
    containerStyle={styles.buttonContainer}
    styleDisabled={styles.buttonDisabled}
    {...props}>
      {props.title}
  </Button>
)

const styles = StyleSheet.create({
  button: {
    padding: 20,
    fontSize: 20,
    color: 'white'
  },
  buttonContainer: {
    borderRadius: 0,
    backgroundColor: "#6576BF",
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: "#CDB05D",
  },
  buttonDisabled: {
    backgroundColor: "#CCCC",
  }
});

export default myButton;
