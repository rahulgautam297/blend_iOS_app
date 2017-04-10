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
  AsyncStorage,
  Dimensions,
  ActivityIndicator} from 'react-native';

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
        otp:    that.state.otp
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({showGif:false});
        if (responseJson.code===0){
          if (responseJson.hasOwnProperty("msg"))
            this.setState({otpError: responseJson.msg});
        }else if(responseJson.code===1){
          if (responseJson.hasOwnProperty("token")){
            this.storeVariables(responseJson.token).then(() => this.props.navigator.replace({id: 'signupCamera', token:responseJson.token }))
          }
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }
  async storeVariables(token) {
    try {
      await AsyncStorage.multiSet([['name', this.props.name], ['mobile', this.props.mobile], ['email', this.props.email], ['token', token], ['selfieTime', "1"]]);
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
        <TouchableHighlight onPress={(showGif) => {this.setState({showGif:true}); this.sendActivationRequest();}} underlayColor="transparent">
          <View style={styles.uploadHighlight}>
            <Text style={styles.forSignUpText}>
              Sign Up
            </Text>
            <Image source={require('./button.png')} style={styles.imageButton}/>
          </View>
        </TouchableHighlight>
      )
    }else if(this.state.showGif == true){
      return (
        <TouchableHighlight style={styles.uploadHighlight} underlayColor="#ffffff">
          <ActivityIndicator />
        </TouchableHighlight>
        )
    }
  }

  render() {
    return (
      <View style= {styles.container}>
        <Text style={styles.forOTPText}>
          Enter OTP.
          <Text style = {styles.errorText}>
            {this.state.otpError}
          </Text>
        </Text>
        <View style={styles.underlineInput}>
          <TextInput
          style={styles.otpInputStyle}
          onChangeText={(otp) => this.setState({otp})}
          value={this.state.otp}
          autoFocus={true}
          maxLength={4}
          />
        </View>
        {this.renderGifOrButton()}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F97240',
  },
  otpInputStyle:{
    height:22,
    color:"#ffffff",
    fontSize:22,
    marginTop:12,
  },
  forOTPText: {
    marginTop:Dimensions.get('window').width/4,
    color: '#ffffff',
    fontSize: 14
  },
  uploadHighlight: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 50,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
   underlineInput: {
     borderBottomColor: '#ddd',
     borderBottomWidth: 1,
     alignSelf: 'center',
     width: 55,
  },
  errorText: {
    fontSize:12,
    color: "#d3d3d3"
  },
  imageButton: {
    width:30,
    height:30,
  },
  forSignUpText:{
    color: '#FF4500',
    fontSize: 25
  }
});
