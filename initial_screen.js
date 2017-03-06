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
export default class InitialScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.uploadHighlight} onPress={() =>{this.props.navigator.replace({id: 'signup'});}} underlayColor="#8b0000">
          <Text style={styles.instructions}>
            Sign up
            </Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.uploadHighlight} onPress={() =>{this.props.navigator.replace({id: 'signin'});}} underlayColor="#8b0000">
          <Text style={styles.instructions}>
            Sign in
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  uploadHighlight: {
    backgroundColor: "#D34836",
    padding: 15,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
   underlineInput: {
     borderBottomColor: '#ddd',
     borderBottomWidth: 1,
     alignSelf: 'stretch'
  },
  errorText: {
    fontSize:13,
    color: "#d3d3d3"
  },
  instructions: {
    color: '#333333',
    marginTop: 20,
    fontSize: 15
  },
});
