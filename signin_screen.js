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
export default class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = { mobile: '', mobileError: '', responseMobile: '', otp:'', otpError:'', showGif: false, mobileButton: true};
  }
  sendMobile(){
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
          if (responseJson.hasOwnProperty("msg"))
            this.setState({mobileError: responseJson.msg});
        }else if(responseJson.code===1){
          this.setState({showGif: false, mobileButton: false, responseMobile:this.state.mobile,mobileError: ""});
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
          if (responseJson.hasOwnProperty("msg"))
            this.setState({otpError: responseJson.msg});
        }else if(responseJson.code===1){
          this.storeVariables(responseJson).then(()=> this.props.navigator.replace({id: 'contactList'}))
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }
  async storeVariables(responseJson) {
    try {
      await AsyncStorage.multiSet([['name', responseJson.user.name], ['mobile', responseJson.user.mobile], ['email', responseJson.user.email], ['token', responseJson.token], ['status', '1']]);
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }
  renderGifOrButton(){
    if(this.state.showGif == false && this.state.mobileButton == true){
      return(
        <TouchableHighlight style={styles.uploadHighlight} onPress={(showGif) => {this.setState({showGif:true}); this.sendMobile();}} underlayColor="#ffffff">
            <Image source={require('./button.png')} style={styles.imageButton}/>
        </TouchableHighlight>
      )
    }else if(this.state.showGif == true && this.state.mobileButton == true){
      return (
        <TouchableHighlight style={styles.uploadHighlight} underlayColor="#ffffff">
          <Image source={require('./default.gif')} style={styles.imageButton} />
        </TouchableHighlight>
        )
    }
  }
  renderOtpButton(){
    if(this.state.showGif == false && this.state.mobileButton == false){
      return(
        <TouchableHighlight style={styles.uploadHighlightForOTP} onPress={(showGif) => {this.setState({showGif:true}); this.sendOtp();}} underlayColor="#ffffff">
        <Text style={styles.forSignInText}>
        Sign In &nbsp;
          <Image source={require('./button.png')} style={styles.imageButton2}/>
        </Text>
        </TouchableHighlight>
      )
    }else if(this.state.showGif == true && this.state.mobileButton == false){
      return (
        <TouchableHighlight style={styles.uploadHighlight} underlayColor="#ffffff">
          <Image source={require('./default.gif')} />
        </TouchableHighlight>
        )
    }
  }
  renderOtpForm(){
    if(this.state.mobileButton === false){
      return(
      <View style={styles.underlineInput}>
        <Text style={styles.ForOTPText}>
          Enter OTP
          <Text style = {styles.errorText}>
            {this.state.otpError}
          </Text>
        </Text>
        <TextInput
        style={styles.OTPInputStyle}
        onChangeText={(otp) => this.setState({otp})}
        value={this.state.otp}
        keyboardType= "phone-pad"
        />
      </View>
    )
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.underlineInputTop}>
          <Text style={styles.ForMobileText}>
            Mobile &nbsp;
            <Text style = {styles.errorText}>
              {this.state.mobileError}
            </Text>
          </Text>
          <TextInput
          style={styles.mobileInputStyle}
          onChangeText={(mobile) => this.setState({mobile})}
          value={this.state.mobile}
          keyboardType= "phone-pad"
          onFocus={() => this.setState({mobileError:''})}
          />
        </View>
        {this.renderGifOrButton()}
        {this.renderOtpForm()}
        {this.renderOtpButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F97240',
  },
  mobileInputStyle:{
    height:22,
    color:"#ffffff",
    fontSize:22,
    marginTop:12,
  },
  ForMobileText: {
    color: '#ffffff',
    fontSize: 14
  },
  ForOTPText: {
    marginTop: 15,
    color: '#ffffff',
    fontSize: 14
  },
  OTPInputStyle:{
    height:22,
    color:"#ffffff",
    fontSize:22,
    marginTop:12,
  },
  uploadHighlight: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 50,
    marginTop: 15,
  },
  uploadHighlightForOTP: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 50,
    marginTop: 40,
  },
   underlineInput: {
     borderBottomColor: '#ddd',
     borderBottomWidth: 1,
     width: 265,
  },
  underlineInputTop: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    width: 265,
    marginTop:Dimensions.get('window').width/4,
 },
  errorText: {
    fontSize:13,
    color: "#d3d3d3"
  },
  imageButton: {
    width:30,
    height:30,
  },
  imageButton2: {
    width:25,
    height:25,
    marginTop:9,
  },
  forSignInText:{
    color: '#FF4500',
    fontSize: 25
  }
});
