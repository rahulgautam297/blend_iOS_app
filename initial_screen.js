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
        <Image source={require('./initial.jpg')} style={styles.backgroundImage} >
          <TouchableHighlight style={styles.textHighlight} onPress={() =>{this.props.navigator.replace({id: 'signup'});}} underlayColor="#8b0000">
            <Text style={styles.buttons}>
              Sign Up
              </Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.textHighlight2} onPress={() =>{this.props.navigator.replace({id: 'signin'});}} underlayColor="#8b0000">
            <Text style={styles.buttons}>
              Login
            </Text>
          </TouchableHighlight>
          <Text style={styles.agreement}>
            By signing up, you agree to our
          </Text>
          <Text style={styles.agreement2}>
            Terms and Privacy policy
          </Text>
        </Image>
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
  textHighlight2: {
    backgroundColor: "#ffffff",
    paddingTop: 14,
    paddingBottom: 14,
    width:200,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 10,
    opacity:0.85,
  },
  buttons: {
    color: '#FF4500',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Avenir Book',
    alignSelf: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'flex-end'
  },
  agreement:{
    color: '#FFFFFF',
    opacity:0.9,
    textAlign:'center',
    marginTop: 5,
    fontSize: 11,
    fontWeight: '600',

  },
  agreement2:{
    color: '#FFFFFF',
    opacity:0.9,
    textAlign:'center',
    marginTop: 5,
    marginBottom: 70,
    fontSize: 11,
    fontWeight: '600',

  }
});
