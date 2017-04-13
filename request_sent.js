import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
export default class RequestSent extends Component {

  constructor(props) {
    super(props);
    this.state = { image:'', msg:'' };
  }

  componentWillMount() {
  }

  receivePhoto(){
    return fetch(this.props.image, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
      .then((responseJson) => {

      })
      .catch((error) => {
        console.error(error);
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require('./sandra.png')} style={styles.imagePreview} />
        </View>
        <Text style={styles.sentText}>Reqeust Sent!</Text>
        <TouchableHighlight style={styles.saveButtonTouch}  onPress={() =>{this.props.navigator.replace({ id: 'contactList'});}} underlayColor="transparent">
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
