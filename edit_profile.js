import React, { Component } from 'react';
import {
  AppRegistry,
  View,
  Text,
  Navigator,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Image,
  Dimensions,
  ScrollView,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  AsyncStorage,
  ImagePickerIOS
  } from 'react-native';
export default class EditProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {token:'', name:'', email:'', mobile:'', nameError:'', emailError:'', designation:'', designationError:'', uploadInactive:true, image:'', showGif:false};
  }

  pickImage() {
    ImagePickerIOS.openSelectDialog({}, imageUri => {
      this.setState({image: imageUri});
      this.uploadImage();
    }, error => console.log(error));
  }

  uploadImage(){
    let body = new FormData();
    body.append('token', this.state.token);
    body.append('image', {uri: this.state.image, name: 'photo.jpg',type: 'image/jpg'});
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/set_display_picture', {
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
        if (responseJson.code===0){
        }else if(responseJson.code===1){
          console.log("Hell yeah bitch!!");
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }

    updateRequest(){
      this.setState({showGif: true});
      let body = new FormData();
      body.append('token', this.state.token);
      body.append('name', this.state.name);
      body.append('designation', this.state.designation);
      body.append('email', this.state.email);
      return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/update_account', {
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
            if (responseJson.msg.hasOwnProperty("designation"))
              this.setState({designationError: responseJson.msg.designation[0]});
            if (responseJson.msg.hasOwnProperty("email"))
              this.setState({emailError: responseJson.msg.email[0]});
          }else if(responseJson.code===1){
            this.storeVariables().then(() => { this.props.navigator.replace({id: 'contactList'}); });
          }
        })
        .catch((error) => {
          console.error(error);
      });
    }
    renderGifOrButton(){
      if(this.state.showGif == false){
        return(
          <TouchableHighlight style={styles.saveButtonTouch} disabled={this.state.uploadInactive}  onPress={() =>{this.updateRequest();}} underlayColor="transparent">
            <Image source={require('./accept.png')} style={styles.saveImage} />
          </TouchableHighlight>
        )
      }else if(this.state.showGif == true){
        return (
          <TouchableHighlight style={styles.saveButtonTouchGif} underlayColor="transparent">
            <ActivityIndicator />
          </TouchableHighlight>
          )
      }
    }

  componentWillMount() {
    this.getVariable("token", "name", "email", "mobile", "designation").then((result)=> this.setState(
      {token:result[0][1], name:result[1][1], email:result[2][1], mobile:result[3][1], designation:result[4][1], image: this.props.image}))
  }
  async getVariable(item1, item2, item3, item4, item5) {
    try {
      const value = await AsyncStorage.multiGet([item1, item2, item3, item4, item5]);
      if (value[0][1] !== null){
        return value;
      }else {
        return false;
      }
    } catch (error) {
        console.log(error);
    }
  }

  async storeVariables(token) {
    try {
      await AsyncStorage.multiSet([['name', this.state.name], ['mobile', this.state.mobile], ['email', this.state.email],
       ['designation', this.state.designation]]);
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }
  renderImage(){
    if (this.state.image == '' || this.state.image == null){
      return null
    }else {
      return(
        <View style={styles.testImageContainer}>
           <Image source={{uri: this.state.image}}  style={styles.testImage} />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.paneRoof1}>
        </View>
        <View style={styles.paneRoof2}>
        </View>
        <TouchableHighlight style={styles.crossButtonTouch} onPress={() =>{this.props.navigator.replace({id: 'contactList'}); }}underlayColor="transparent">
          <Image source={require('./cross.png')}  style={styles.crossButton} />
        </TouchableHighlight>
        <KeyboardAvoidingView behavior = "position">
            {this.renderImage()}
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              Full name &nbsp;
              <Text style = {styles.errorText}>
                {this.state.nameError}
              </Text>
            </Text>
            <TextInput
             style={styles.nameInput}
             value={this.state.name}
             onChangeText={(name) => {this.setState({name:name, uploadInactive:false});}}
             keyboardAppearance={"dark"}/>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              Email &nbsp;
              <Text style = {styles.errorText}>
                {this.state.emailError}
              </Text>
            </Text>
             <TextInput
              style={styles.nameInput}
              value={this.state.email}
              onChangeText={(email) => {this.setState({email:email,uploadInactive:false});}}
              keyboardAppearance={"dark"}
              autoCapitalize="none"/>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              mobile &nbsp;
              <Text style = {styles.errorText}>
                disabled
              </Text>
            </Text>
             <TextInput
              style={styles.nameInput}
              value={this.state.mobile}
              disabled={true}
              keyboardAppearance={"dark"}
              />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              Designation &nbsp;
              <Text style = {styles.errorText}>
                {this.state.designationError}
              </Text>
            </Text>
             <TextInput
              style={styles.nameInput}
              value={this.state.designation}
              keyboardAppearance={"dark"}
              onChangeText={(designation) => {this.setState({designation:designation, uploadInactive:false});}}
              />
          </View>
          </KeyboardAvoidingView>
          {this.renderGifOrButton()}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width:Dimensions.get('window').width,
  },
  paneRoof1:{
    width:Dimensions.get('window').width,
    height:17,
    zIndex:100,
    backgroundColor:"white",
  },
  paneRoof2:{
    width:Dimensions.get('window').width,
    height:25,
    backgroundColor:"#292C37",
    zIndex:100
  },
  testImage:{
    width:150,
    height:150,
  },
  testImageContainer:{
    borderRadius: 75,
    overflow:'hidden',
    alignSelf:"center",
  },
  nameContainer:{
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    width: Dimensions.get('window').width*0.8,
  },
  errorText: {
    fontSize:13,
    color: "#d3d3d3"
  },
  nameInput:{
    height:22,
    color:"black",
    fontSize:18,
    marginTop:12,
  },
  nameText: {
    marginTop: 15,
    color: 'black',
    fontSize: 14
  },
  crossButton: {
    width:25,
    height:25,
  },
  crossButtonTouch:{
    backgroundColor:"black",
    alignSelf:'flex-start',
    marginTop:5,
    marginLeft:5,
  },
  saveImage: {
    width:75,
    height:75,
  },
  saveButtonTouch:{
    alignSelf:'center',
    marginTop: 10,
  },
  saveButtonTouchGif:{
    width:60,
    height:60,
    justifyContent:'center',
    alignItems:'center',
    marginTop: 15,
    backgroundColor: "#1ABC9C",
    borderRadius: 50,
  },
});
