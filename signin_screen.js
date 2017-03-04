import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  TouchableHighlight,
  Image,
  AsyncStorage
} from 'react-native';
export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { mobile: '', mobileError: '', responseMobile: '', otp:'', otpError:'', showGif: false, mobileButton: true};
  }
  sendSignUpData(){
    var that = this
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/send_otp_to_mobile', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: that.state.mobile
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.code===0){
          this.setState({showGif:false});
          if (responseJson.msg.hasOwnProperty("msg"))
            this.setState({mobileError: responseJson.msg});
        }else if(responseJson.code===1){
          this.setState({showGif: false, mobileButton: false, responseMobile:this.state.mobile});
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }
  sendOtp(){
    var that = this
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: that.state.responseMobile,
        otp: that.state.otp
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.code===0){
          this.setState({showGif:false});
          if (responseJson.msg.hasOwnProperty("msg"))
            this.setState({mobileError: responseJson.msg});
        }else if(responseJson.code===1){
          this.storeVariables(responseJson)
          this.props.navigator.replace({id: 'contactList'});
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }
  async storeVariables(responseJson) {
    try {
      await AsyncStorage.multiSet([['name', responseJson.user.name], ['mobile', responseJson.user.mobile], ['email', responseJson.user.email], ['token', responseJson.token]]);
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }
  renderGifOrButton(){
    if(this.state.showGif == false && this.state.mobileButton == true){
      return(
        <TouchableHighlight style={styles.uploadHighlight} onPress={(showGif) => {this.setState({showGif:true}); this.sendMobile();}} underlayColor="#8b0000">
          <Text style={styles.uploadButton}>
            Sign in
          </Text>
        </TouchableHighlight>
      )
    }else if(this.state.showGif == true && this.state.mobileButton == true){
      return (
        <TouchableHighlight style={styles.uploadHighlight} underlayColor="#8b0000">
          <Image source={require('./default.gif')} />
        </TouchableHighlight>
        )
    }
  }
  renderOtpButton(){
    if(this.state.showGif == false && this.state.mobileButton == false){
      return(
        <TouchableHighlight style={styles.uploadHighlight} onPress={(showGif) => {this.setState({showGif:true}); this.sendOtp();}} underlayColor="#8b0000">
          <Text style={styles.uploadButton}>
            Sign in
          </Text>
        </TouchableHighlight>
      )
    }else if(this.state.showGif == true && this.state.mobileButton == false){
      return (
        <TouchableHighlight style={styles.uploadHighlight} underlayColor="#8b0000">
          <Image source={require('./default.gif')} />
        </TouchableHighlight>
        )
    }
  }
  renderOtpForm(){
    if(this.state.mobileButton == false){
      <View style={styles.underlineInput}>
        <Text style={styles.instructions}>
          Enter 1 Digit code
        </Text>
        <Text style = {styles.errorText}>
          {this.state.otpError}
        </Text>
        <TextInput
        style={{height: 40}}
        onChangeText={(otp) => this.setState({otp})}
        value={this.state.otp}
        keyboardType= "phone-pad"
        />
      </View>
    }
  }
  render() {
    return (
      <ScrollView>
        <Text style={styles.instructions}>
          Sign in
        </Text>
        <View style={styles.underlineInput}>
          <Text style={styles.instructions}>
            Mobile &nbsp;
            <Text style = {styles.errorText}>
              {this.state.mobileError}
            </Text>
          </Text>
          <TextInput
          style={{height: 40}}
          onChangeText={(mobile) => this.setState({mobile})}
          value={this.state.mobile}
          keyboardType= "phone-pad"
          />
        </View>
        {this.renderGifOrButton()}
        {this.renderOtp()}
        {this.renderOtpButton()}
      </ScrollView>
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
