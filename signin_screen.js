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
  AsyncStorage,
  ActivityIndicator
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
          console.log(this.state.disabled);
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
          if (responseJson.user.search_status ==='Active')
            this.storeVariables(responseJson,'1').then(() => this.props.navigator.replace({id: 'contactList', image:responseJson.image, previousScreen:"signIn"}))
          else if (responseJson.user.search_status ==='Inactive'){
            this.storeVariables(responseJson,'0').then(() => this.props.navigator.replace({id: 'contactList', image:responseJson.image, previousScreen:"signIn"}))
          }
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }
  async storeVariables(responseJson, search_status) {
    try {
      await AsyncStorage.multiSet([['name', responseJson.user.name],
      ['mobile', responseJson.user.mobile], ['email', responseJson.user.email], ['designation', responseJson.user.designation],
      ['token', responseJson.token], ['status', search_status], ['selfieTime', "0"]]);
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
          <ActivityIndicator />
        </TouchableHighlight>
      )
    }
  }
  renderOtpButton(){
    if(this.state.showGif == false && this.state.mobileButton == false){
      return(
        <TouchableHighlight onPress={(showGif) => {this.setState({showGif:true}); this.sendOtp();}} underlayColor="transparent">
        <View style={styles.uploadHighlightForOTP}>
          <Text style={styles.forSignInText}>
          Sign In &nbsp;
          </Text>
          <Image source={require('./button.png')} style={styles.imageButton2}/>
        </View>
        </TouchableHighlight>
      )
    }else if(this.state.showGif == true && this.state.mobileButton == false){
      return (
        <TouchableHighlight style={styles.uploadHighlight} underlayColor="#ffffff">
          <ActivityIndicator />
        </TouchableHighlight>
        )
    }
  }
  renderOtpForm(){
    if(this.state.mobileButton === false){
      return(
      <View style={styles.underlineInput}>
        <Text style={styles.ForOTPText}>
          Enter OTP &nbsp;
          <Text style = {styles.errorText}>
            {this.state.otpError}
          </Text>
        </Text>
        <TextInput
        style={styles.OTPInputStyle}
        onChangeText={(otp) => this.setState({otp})}
        value={this.state.otp}
        keyboardType= "phone-pad"
        autoFocus={true}
        maxLength={4}
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
          autoFocus={true}
          maxLength={10}
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
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
  },
  forSignInText:{
    color: '#FF4500',
    fontSize: 25
  }
});
