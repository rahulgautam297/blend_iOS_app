import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Image
} from 'react-native';
export default class Card extends Component {
  render() {
    return (
      <View style={styles.container}>
          <Text>
            {this.props.name}
          </Text>
          <Text>
            {this.props.mobile}
          </Text>
          <Text>
            {this.props.email}
          </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHighlight: {
    backgroundColor: "#ffffff",
    paddingTop: 14,
    paddingBottom: 14,
    width:200,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 10,
    opacity:0.85,
  },

});
