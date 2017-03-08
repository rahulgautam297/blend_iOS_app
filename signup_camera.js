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
export default class SignupCamera extends Component {

  constructor(props) {
    super(props);
    this.state = { image:'', twoButtons: false};
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
        </Camera>
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
  renderButtonOrTwoButtons(){
    if(this.state.twoButtons == false){
      return(
        <TouchableHighlight style={styles.uploadHighlight} onPress={(twoButtons) =>{this.takePicture(); }} underlayColor="#ffffff">
          <Image source={require('./camera_button.png')}  style={styles.imageButton} />
        </TouchableHighlight>
      )
    }else{
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
            <TouchableHighlight style={styles.highlightUpload} onPress={() => {
             this.props.navigator.replace({id: 'signup',image: this.state.image});}} underlayColor="#ffffff">
              <Image source={require('./button.png')} style={styles.imageButton3}/>
            </TouchableHighlight>
          </View>
        </View>
      )
    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderImageOrCamera()}
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
  }
});
