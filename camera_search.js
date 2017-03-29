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
} from 'react-native';
import Camera from 'react-native-camera';
export default class CameraSearch extends Component {

  constructor(props) {
    super(props);
    this.state = { showGif: false, token:'',error:'', showError:false, image:''};
  }
  async checkLoggedIn() {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null){
        return value;
      }else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
  componentWillMount() {
      this.checkLoggedIn().then((result)=> this.setState({token:result}));
  }

  takePictureAndUpload() {
   this.camera.capture()
     .then((data) => {this.setState({image: data.path, showGif:true}); this.sendPhoto();})
     .catch(err => console.error(err));
  }

  sendPhoto(){
    token=this.state.token;
    let body = new FormData();
    body.append('image', {uri: this.state.image, name: 'photo.jpg', type: 'image/jpg'});
    body.append('token', token);
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/search_user', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body
    })
    .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
         this.setState({showGif:false});
        if (responseJson.code===0){
          if (responseJson.hasOwnProperty("msg"))
            this.setState({error: responseJson.msg, showError:true, image:''});
        }else if(responseJson.code===1){
            this.props.navigator.replace({id: 'contactList', gotResponse:true});
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }
  renderCamera(){
    return(
        <Camera
        ref={(cam) => {
          this.camera = cam;
        }}
        style={styles.preview}
        captureTarget = {Camera.constants.CaptureTarget.disk}
        captureQuality={Camera.constants.CaptureQuality.high}
        aspect={Camera.constants.Aspect.fill}
        flashMode={Camera.constants.TorchMode.auto}>
        </Camera>
  )
  }
  renderImage() {
    return (
        <Image
          source={{ uri: this.state.image }}
          style={styles.preview}
        />
    );
  }
  renderImageOrCamera(){
    if (this.state.image==='') {
      return this.renderCamera();
    }
    else {
      return this.renderImage();
    }
  }
  errorInfo(){
    if(this.state.showError == true){
      return(
        <Text> {this.state.error} </Text>
      )
    }
  }
  renderButtonOrGif(){
    if(this.state.showGif == false){
      return(
        <View style={styles.buttonView}>
          {this.errorInfo()}
          <TouchableHighlight style={styles.uploadHighlight} onPress={(showGif) =>{this.takePictureAndUpload(); }} underlayColor="#ffffff">
            <Text style={styles.plusButton}>+</Text>
          </TouchableHighlight>
        </View>
      )
    }else{
      return (
        <View style={styles.buttonView}>
          <TouchableHighlight style={styles.uploadHighlight} onPress={(showGif) =>{return null}}  underlayColor="#ffffff">
            <Image source={require('./default.gif')}  style={styles.imageButton} />
          </TouchableHighlight>
        </View>
      )
    }
  }
  async getVariable(item) {
    try {
      const value = await AsyncStorage.getItem(item);
      if (value === null){
        return true;
      }else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderImageOrCamera()}
        {this.renderButtonOrGif()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  preview: {
    flex:0.8125,
    width:Dimensions.get('window').width,
  },
  buttonView:{
    flex:0.1875,
    alignItems: 'center',
    justifyContent:'center',
  },
  uploadHighlight: {
    backgroundColor: '#FF4500',
    borderRadius: 50,
    width:70,
    height:70,
    justifyContent: 'center',
    alignItems: 'center',
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
    width:20,
    height:20,
  },
  plusButton:{
    fontSize: 40,
    fontWeight:'bold',
    color:'#ffffff',
  }
});
