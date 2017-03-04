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
import Camera from 'react-native-camera';
export default class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {image: '', details: '', name: '', email: '', mobile: '', showGif: false};
  }
  takePicture() {
    this.camera.capture()
      .then((data) => this.setState({image: data}))
      .catch(err => console.error(err));
  }
  async storeVariables() {
    try {
      await AsyncStorage.multiSet([['name', this.state.name], ['mobile', this.state.mobile], ['email', this.state.email]]);
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }

  sendPhoto(){
    var that = this;
    var token = this.getVariables();
    console.log(token);
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/search_user', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: that.state.image,
        token: token
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({showGif:false});
        if (responseJson.code===0){
          if (responseJson.hasOwnProperty("msg"))
            this.setState({name: responseJson.msg});
        }else if(responseJson.code===1){
          if (responseJson.hasOwnProperty("user")){
            this.setState({details: "Details-"});
            this.setState({name: "Name: " +responseJson.user.name});
            this.setState({email: "Email: " +responseJson.user.email});
            this.setState({mobile:  "Mobile: " +responseJson.user.mobile});
          }
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }

  async getVariables() {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null)
        return value;
    } catch (error) {
      console.log(":/");
    }
  }

  renderGifOrButton(){
    if(this.state.showGif == false){
      return(
        <TouchableHighlight style={styles.uploadHighlight} onPress={(showGif) => {this.setState({showGif:true}); this.takePicture(); this.sendActivationRequest();}} underlayColor="#8b0000">
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
        )
    }
  }

  render() {
    return (
      <View style= {styles.container}>
      <Camera
      ref={(cam) => {
        this.camera = cam;
      }}
      style={styles.preview}
      captureTarget = {Camera.constants.CaptureTarget.temp}
      captureQuality={Camera.constants.CaptureQuality.medium}
      aspect={Camera.constants.Aspect.fill}>
      </Camera>
        {this.renderGifOrButton()}
        <Text style={styles.instructions}>
          <Text style = {styles.instructions}>
            {this.state.details}
          </Text>
          <Text style = {styles.instructions}>
            {this.state.name}
          </Text>
          <Text style = {styles.instructions}>
            {this.state.email}
          </Text>
          <Text style = {styles.instructions}>
            {this.state.mobile}
          </Text>
        </Text>
      </View>
    )
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
});
