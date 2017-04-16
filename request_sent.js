import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableHighlight,
  Image,
  ActivityIndicator,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'
export default class RequestSent extends Component {

  constructor(props) {
    super(props);
    this.state = { image:''};
  }

  componentWillMount() {
    RNFetchBlob.fs.unlink(this.props.delete_image).then(() => {this.receivePhoto();})
  }

  receivePhoto(){
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob
    .config({
      fileCache : true,
      appendExt : 'jpg'
    })
    .fetch('GET', this.props.image, {
    })
    .then((res) => {
      this.setState({image: res.path()});
      // remove file
    })
  }

  setImage(){
    if (this.state.image === ''){
      return(
        <View style={styles.activityContainer}>
          <ActivityIndicator />
        </View>
      )
    }else{
      return(
        <View style={styles.imageContainer}>
          <Image source= {{uri: this.state.image}} style={styles.imagePreview} />
        </View>
      )
    }
  }

  removeImageThenLeave(){
    RNFetchBlob.fs.unlink(this.state.image).then(() => {
      this.props.navigator.replace({ id: 'contactList'});
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.setImage()}
        <Text style={styles.sentText}>Request Sent!</Text>
        <TouchableHighlight style={styles.saveButtonTouch}  onPress={() =>{this.removeImageThenLeave();}} underlayColor="transparent">
          <Image source={require('./accept.png')} style={styles.saveImage} />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems:"center"
  },
  imageContainer: {
    marginTop: 50,
    borderRadius:150,
    overflow:'hidden',
  },
  activityContainer:{
    height: 300,
    width: 300,
    alignItems:"center",
    justifyContent:"center",
  },
  imagePreview:{
    height: 300,
    width:300,
  },
  sentText:{
    fontSize:30,
    fontWeight: "400",
    marginTop: 25,
  },
  saveButtonTouch:{
    marginTop: 10,
  },
  saveImage: {
    width:80,
    height:80,
  },
});
