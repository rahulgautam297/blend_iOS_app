import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  TouchableHighlight,
  Image,
  AsyncStorage } from 'react-native';

export default class OtpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {otp: '', otpError: '', showGif: false};
  }

  sendActivationRequest(){
    var that = this
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/activate_account', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: that.props.mobile,
        otp: that.state.otp
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({showGif:false});
        if (responseJson.code===0){
          if (responseJson.hasOwnProperty("msg"))
            this.setState({otpError: responseJson.msg});
        }else if(responseJson.code===1){
          if (responseJson.hasOwnProperty("token"))
            this.storeVariables(responseJson.token)
          this.props.navigator.replace({id: 'contactList'});
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }

  async storeVariables(token) {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }

  async getVariables() {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null)
        console.log(value);
    } catch (error) {
      console.log(":/");
    }
  }

  renderGifOrButton(){
    if(this.state.showGif == false){
      return(
        <TouchableHighlight style={styles.uploadHighlight} onPress={(showGif) => {this.setState({showGif:true}); this.sendActivationRequest();}} underlayColor="#8b0000">
          <Text style={styles.uploadButton}>
            Send
          </Text>
        </TouchableHighlight>
      )
    }else{
      return (
        <TouchableHighlight style={styles.uploadHighlight} underlayColor="#8b0000">
          <Image source={require('./default.gif')} />
        </TouchableHighlight>
      );
    }
  }

  render() {
    return (
      <View style= {styles.container}>
        <Text style={styles.instructions}>
          Enter your 1 digit code. Hardcoded to one.
          <Text style = {styles.errorText}>
          {this.state.otpError}
          </Text>
        </Text>
        <View style={styles.underlineInput}>
          <TextInput
          style={{height: 40}}
          onChangeText={(otp) => this.setState({otp})}
          value={this.state.otp}
          />
        </View>
        {this.renderGifOrButton()}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    marginTop: 100
  },
  instructions: {
    color: '#333333',
    marginTop: 20,
    fontSize: 15,
    textAlign:"center"
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
    fontSize:12,
    color: "#d3d3d3"
  }
});
