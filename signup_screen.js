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
  KeyboardAvoidingView
} from 'react-native';
import Camera from 'react-native-camera';
export default class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {name: '', email: '', mobile: '', image:'', imageError:'', nameError: '', mobileError: '', emailError: '', showGif: false, click:false };
  }
  takePicture() {
    this.camera.capture()
      .then((data) => this.setState({image: data.path, click: true,imageError: ''}))
      .catch(err => console.error(err));
  }

  sendSignUpData(){
    if (this.state.click ===false) {
      this.setState({imageError: 'Click picture idiot!!',showGif:false});
      return;
    }
    let body = new FormData();
    body.append('image', {uri: this.state.image, name: 'photo.jpg',type: 'image/jpg'});
    body.append('name', this.state.name);
    body.append('mobile', this.state.mobile);
    body.append('email', this.state.email);
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body
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
          this.props.navigator.replace({id: 'otpScreen', mobile: this.state.mobile, name: this.state.name, email: this.state.email});
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
  renderImage() {
    return (
      <View>
        <Image
          source={{ uri: this.state.image }}
          style={styles.preview}
        />
        <TouchableHighlight style={styles.uploadHighlight} onPress={() => this.setState({ image: '' })} underlayColor="#8b0000">
          <Text style={styles.capture}>Take another picture?</Text>
        </TouchableHighlight>
      </View>
    );
  }
  renderCamera(){
    return(
      <View>
        <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        captureTarget = {Camera.constants.CaptureTarget.disk}
        captureQuality={Camera.constants.CaptureQuality.medium}
        type={Camera.constants.Type.front}
        aspect={Camera.constants.Aspect.fill}
        mirrorImage={true}>
        </Camera>
        <TouchableHighlight style={styles.uploadHighlight} onPress={this.takePicture.bind(this)} underlayColor="#8b0000">
          <Text style={styles.capture}>Click picture</Text>
        </TouchableHighlight>
      </View>
  )
  }
  renderImageOrCamera(){

    if (this.state.image==='') {
      return this.renderCamera();
    }
    else {
      return this.renderImage();
    }
  }
  render() {
    return (
      <ScrollView>
      <KeyboardAvoidingView behavior='position'>
        {this.renderImageOrCamera()}
        <Text style = {styles.errorText}>
          {this.state.imageError}
        </Text>
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
        </KeyboardAvoidingView>
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
    height: 250
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
