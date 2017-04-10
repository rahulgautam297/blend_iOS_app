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
  ActivityIndicator,
  CameraScroll,
} from 'react-native';
import Camera from 'react-native-camera';
export default class SignupCamera extends Component {

  constructor(props) {
    super(props);
    this.state = {image:'', twoButtons: false, token:'', showGif:false, error:'', showError:false};
  }
  async getToken() {
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
      if (this.props.token ===null || this.props.token ==='')
          this.getToken().then((result)=> this.setState({token:result}));
  }
  takePicture() {
    this.camera.capture()
      .then((data) => this.setState({image: data.path, twoButtons:true}))
      .catch(err => console.error(err));
  }
  renderImage() {
    return (
        <Image
          source={{ uri: this.state.image }}
          style={styles.preview}
        />
    );
  }
  renderCamera(){
    return(
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
        <TouchableHighlight style={styles.crossButtonTouch} onPress={() =>{this.props.navigator.replace({id: 'initial'}); }}>
          <Image source={require('./cross.png')}  style={styles.crossButton} />
        </TouchableHighlight>
        </Camera>
    )
  }

  async storeStatusandSetSelfieBoolean() {
    try {
      await AsyncStorage.multiSet([['status', '1'],['selfieTime', "0"]]);
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }

  storeImage(){
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + "/display_picture_path.txt";
    RNFS.writeFile(path, JSON.stringify(this.state.image), 'utf8');
    console.log(path);
  }
  renderImageOrCamera(){
    if (this.state.image==='') {
      return this.renderCamera();
    }
    else {
      return this.renderImage();
    }
  }
  sendPhoto(){
    var token =''
    if (this.props.token ===null || this.props.token ===''){
        token=this.state.token;
    }
    else {
      console.log("token from props");
      token=this.props.token;
    }
    let body = new FormData();
    body.append('image', {uri: this.state.image, name: 'photo.jpg', type: 'image/jpg'});
    body.append('token', token);
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/upload_selfie', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: body
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({showGif:false});
        if (responseJson.code===0){
          this.setState({error: responseJson.msg, showError:true, twoButtons:false,image:''});
        }else if(responseJson.code===1){
          this.storeStatusandSetSelfieBoolean().then(() => this.storeImage()).then(() => {this.props.navigator.replace({id: 'contactList',image:this.state.image});})
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }
  renderButtonOrTwoButtons(){
    if(this.state.twoButtons == false && this.state.showGif == false){
      return(
        <TouchableHighlight style={styles.uploadHighlight} onPress={() =>{this.setState({showError: false, error:''}); this.takePicture();}} underlayColor="#ffffff">
          <Image source={require('./camera_button.png')}  style={styles.imageButton} />
        </TouchableHighlight>
      )
    }else if(this.state.twoButtons == true && this.state.showGif == false){
      return (
        <View style={styles.twoButtonsView}>
          <View style={styles.clickAgainView}>
              <TouchableHighlight style={styles.uploadHighlight2} onPress={() => this.setState({ image: '' , twoButtons: false})} underlayColor="#ffffff">
                <Text style={styles.forClickAgainText}>
                  <Image source={require('./camera_button.png')} style={styles.imageButton2}/>
                   Click Again?
                </Text>
              </TouchableHighlight>
          </View>
          <View style={styles.uploadView}>
            <TouchableHighlight style={styles.highlightUpload} onPress={() => {this.setState({showGif: true}); this.sendPhoto();}} underlayColor="#ffffff">
              <Image source={require('./button.png')} style={styles.imageButton3}/>
            </TouchableHighlight>
          </View>
        </View>
      )
    }else if(this.state.twoButtons == true && this.state.showGif == true){
      return(
        <TouchableHighlight style={styles.uploadHighlight}  underlayColor="#ffffff">
          <ActivityIndicator />
        </TouchableHighlight>
      )
    }
  }
  errorInfo(){
    if(this.state.showError == true){
      return(
        <Text> {this.state.error} </Text>
      )
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderImageOrCamera()}
        {this.errorInfo()}
        {this.renderButtonOrTwoButtons()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  preview: {
    flex:0.8125,
    width:Dimensions.get('window').width,
  },
  uploadHighlight: {
    flex:0.1875,
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor: "#ffffff",
  },
  twoButtonsView:{
    flex:0.1875,
    backgroundColor: '#F97240',
    width:Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row',
  },
  uploadHighlight2: {
    borderRadius: 30,
    backgroundColor: "#ffffff",
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent:'center',
    marginLeft:30,
  },
  highlightUpload:{
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 50,
    marginRight:30,
  },
  imageButton3: {
    width:20,
    height:20,
  },
  clickAgainView:{
    flex:0.5,
    alignItems: 'flex-start',
    justifyContent:'center',
  },
  uploadView:{
    flex:0.5,
    alignItems: 'flex-end',
    justifyContent:'center',
  },
  errorText: {
    fontSize:13,
    color: "#d3d3d3"
  },
  imageButton: {
    width:100,
    height:100,
  },
  imageButton2: {
    width:40,
    height:40,
    marginTop:5,
  },
  forClickAgainText:{
    color: '#FF4500',
    fontSize: 13,
    textAlign:'center',
  },
  crossButton: {
    width:25,
    height:25,
    marginTop:30,
    marginLeft:15
  },
  crossButtonTouch:{
    width:50,
    height:50,
    alignSelf:'flex-start'
  },
});
