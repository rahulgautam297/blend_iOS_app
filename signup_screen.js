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
import Camera from 'react-native-camera';
export default class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {name: '', email: '', mobile: '', nameError: '', mobileError: '', emailError: '', showGif: false };
  }

  sendSignUpData(){
    let body = new FormData();
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
  renderGifOrButton(){
    if(this.state.showGif == false){
      return(
        <TouchableHighlight style={styles.uploadHighlight} onPress={(showGif) => {this.setState({showGif:true}); this.sendSignUpData();}} underlayColor="#ffffff">
          <Image source={require('./button.png')} style={styles.imageButton}/>
        </TouchableHighlight>
      )
    }else{
      return (
        <TouchableHighlight style={styles.uploadHighlight} underlayColor="#ffffff">
          <ActivityIndicator />
        </TouchableHighlight>
        )
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={styles.crossButtonTouch} onPress={() =>{this.props.navigator.replace({id: 'initial'}); }}>
          <Image source={require('./cross.png')}  style={styles.crossButton} />
        </TouchableHighlight>
          <View style={styles.underlineInputTop}>
            <Text style={styles.textForName}>
              Full Name &nbsp;
              <Text style = {styles.errorText}>
                {this.state.nameError}
              </Text>
            </Text>
            <TextInput
            style={styles.inputForName}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            autoFocus={true}
            />
          </View>
          <View style={styles.underlineInput}>
            <Text style={styles.textForEmail}>
              Email &nbsp;
              <Text style = {styles.errorText}>
              {this.state.emailError}
              </Text>
            </Text>
              <TextInput
              style={styles.inputForEmail}
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
              autoCapitalize="none"
              />
          </View>
          <View style={styles.underlineInput}>
            <Text style={styles.textForMobile}>
              Mobile &nbsp;
              <Text style = {styles.errorText}>
              {this.state.mobileError}
              </Text>
            </Text>
              <TextInput
              style={styles.inputForMobile}
              onChangeText={(mobile) => this.setState({mobile})}
              value={this.state.mobile}
              keyboardType= "phone-pad"
              maxLength={10}
              />
          </View>
        {this.renderGifOrButton()}
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
  uploadHighlight: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 50,
    marginTop: 15,
  },
  uploadButton: {
    color: "#ffffff",
    fontWeight: "600"
  },
  underlineInput: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    width: Dimensions.get('window').width*0.8,
 },
 underlineInputTop: {
   borderBottomColor: '#ddd',
   borderBottomWidth: 1,
   marginTop:40,
   width: Dimensions.get('window').width*0.8,
 },
  errorText: {
    fontSize:13,
    color: "#d3d3d3"
  },
  inputForMobile:{
    height:27,
    color:"#ffffff",
    fontSize:22,
    marginTop:12,
  },
  textForMobile: {
    marginTop: 15,
    color: '#ffffff',
    fontSize: 14
  },
  inputForName:{
    height:27,
    color:"#ffffff",
    fontSize:22,
    marginTop:12,
  },
  textForName: {
    color: '#ffffff',
    fontSize: 14
  },
  inputForEmail:{
    height:27,
    color:"#ffffff",
    fontSize:22,
    marginTop:12,
  },
  textForEmail: {
    marginTop: 15,
    color: '#ffffff',
    fontSize: 14
  },
  imageButton: {
    width:30,
    height:30,
  },
  crossButton: {
    width:25,
    height:25,
    marginTop:30,
    marginLeft:15,
  },
  crossButtonTouch:{
    width:50,
    height:50,
    alignSelf:'flex-start',
  },
});
