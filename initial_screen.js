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
import Camera from 'react-native-camera';
export default class Signup extends Component {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <View>
        <View style={styles.underlineInput}>
          <TouchableHighlight style={styles.uploadHighlight} onPress={this.props.navigator.replace({id: 'signup'})} underlayColor="#8b0000">
            <Text style={styles.instructions}>
              Sign up
              </Text>
          </TouchableHighlight>
        </View>
        <View style={styles.underlineInput}>
          <TouchableHighlight style={styles.uploadHighlight} onPress={this.props.navigator.replace({id: 'signin'})} underlayColor="#8b0000">
            <Text style={styles.instructions}>
              Sign in
            </Text>
          </TouchableHighlight>
        </View>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    color: '#333333',
    marginTop: 20,
    fontSize: 15
  },
  capture: {
    alignSelf: 'center',
    textAlign: 'center',
    color: '#ffffff',
  },
  preview: {
    width: 400,
    height: 300
  },
  uploadHighlight: {
    backgroundColor: "#D34836",
    padding: 15,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  uploadButton: {
    color: "#ffffff",
    fontWeight: "600"
  },
   underlineInput: {
     borderBottomColor: '#ddd',
     borderBottomWidth: 1,
     alignSelf: 'stretch'
  },
  errorText: {
    fontSize:13,
    color: "#d3d3d3"
  }
});
