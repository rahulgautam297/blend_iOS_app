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
import Camera from 'react-native-camera';
export default class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {name: '', email: '', mobile: '', image:'', nameError: '', mobileError: '', emailError: '', showGif: false};
  }
  takePicture() {
    this.camera.capture()
      .then((data) => this.setState({image: data}))
      .catch(err => console.error(err));
  }

  sendSignUpData(){
    var that = this
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: that.state.name,
        mobile: that.state.mobile,
        email: that.state.email,
        image: that.state.image
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.code===0){
          this.setState({showGif:false});
          if (responseJson.msg.hasOwnProperty("name"))
            this.setState({nameError: responseJson.msg.name[0]});
          if (responseJson.msg.hasOwnProperty("mobile"))
            this.setState({mobileError: responseJson.msg.mobile[0]});
          if (responseJson.msg.hasOwnProperty("email"))
            this.setState({emailError: responseJson.msg.email[0]});
        }else if(responseJson.code===1){
          this.storeVariables()
          this.props.navigator.replace({id: 'otpScreen', mobile: this.state.mobile});
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }
  async storeVariables() {
    try {
      await AsyncStorage.multiSet([['name', this.state.name], ['mobile', this.state.mobile], ['email', this.state.email]]);
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }
  renderGifOrButton(){
    if(this.state.showGif == false){
      return(
        <TouchableHighlight style={styles.uploadHighlight} onPress={(showGif) => {this.setState({showGif:true}); this.sendSignUpData();}} underlayColor="#8b0000">
          <Text style={styles.uploadButton}>
            Sign up
          </Text>
        </TouchableHighlight>
      )
    }else{
      return (
        <TouchableHighlight style={styles.uploadHighlight} underlayColor="#8b0000">
          <Image source={require('./default.gif')} />
        </TouchableHighlight>
        )
    }
  }

  render() {
    return (
      <ScrollView>
        <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        captureTarget = {Camera.constants.CaptureTarget.temp}
        captureQuality={Camera.constants.CaptureQuality.medium}
        type={Camera.constants.Type.front}
        aspect={Camera.constants.Aspect.fill}>
        </Camera>
        <TouchableHighlight style={styles.uploadHighlight} onPress={this.takePicture.bind(this)} underlayColor="#8b0000">
          <Text style={styles.capture}>CAPTURE</Text>
        </TouchableHighlight>
        <View style={styles.underlineInput}>
        <Text style={styles.instructions}>
          Name &nbsp;
          <Text style = {styles.errorText}>
            {this.state.nameError}
          </Text>
        </Text>
          <TextInput
          style={{height: 40}}
          onChangeText={(name) => this.setState({name})}
          value={this.state.name}
          />
        </View>
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
        <View style={styles.underlineInput}>
          <Text style={styles.instructions}>
            Email &nbsp;
            <Text style = {styles.errorText}>
            {this.state.emailError}
            </Text>
          </Text>
          <TextInput
          style={{height: 40}}
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
          autoCapitalize="none"
          />
        </View>
        {this.renderGifOrButton()}
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
