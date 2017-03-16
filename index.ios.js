/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 import React, { Component } from 'react';
 import { AppRegistry,
    Navigator,
    ActivityIndicator,
    AsyncStorage } from 'react-native';

 import Signup from './signup_screen.js';
 import Signin from './signin_screen.js';
 import OtpScreen from './otp_screen.js';
 import ContactList from './contact_list.js';
 import InitialScreen from './initial_screen.js';
 import SignupCamera from './signup_camera.js';
 import CameraSearch from './camera_search.js';
 class Lucido extends Component {
   constructor(props) {
     super(props);
     this.state = {hasToken: false, isLoaded:false, token:''};
   }
   async checkLoggedIn() {
     try {
       const value = await AsyncStorage.getItem('token');
       if (value !== null){
         this.setState({token:value});
         return true;
       }else {
         return false;
       }
     } catch (error) {
       console.log(error);
     }
   }
   componentWillMount() {
     this.checkLoggedIn().then((result)=> {
       if(result===true){
        this.setState({ hasToken: true, isLoaded: true })
      }else if (result === false) {
          this.setState({  isLoaded: true })
        }
     });
  }

   takeMeTo(){
     var token = this.state.hasToken;
     if(token === true){
       return(
         <Navigator
         initialRoute = {{ id: 'contactList', mobile: "", name:"", email:"", image:"", gotResponse:false}}
         renderScene={(route, navigator) =>
          this.renderScene(route, navigator)
           }
         />
       )
    }else if(token === false){
       return(
         <Navigator
         initialRoute = {{ id: 'initial', mobile: "", name:"", email:"", image:"", gotResponse:false}}
         renderScene={(route, navigator) =>
          this.renderScene(route, navigator)
           }
         />
       )
     }
   }
   loadingInfo(){
     if (!this.state.isLoaded) {
       return (<ActivityIndicator />)
     }else{
        return(this.takeMeTo())
      }
   }
   render() {
     return (
       this.loadingInfo()
     )
   }
   renderScene( route, navigator ) {
     var routeId = route.id;
     if (routeId === 'signup') {
       return (
         <Signup navigator={navigator} image={route.image}/>
       );
     }else if (routeId === 'otpScreen') {
       return (
         <OtpScreen
         navigator={navigator} mobile={route.mobile} email={route.email} name={route.name}/>
       );
    }else if (routeId === 'contactList') {
      return (
        <ContactList
        navigator={navigator} gotResponse={route.gotResponse} mobile={route.mobile} email={route.email} name={route.name}/>
      );
    }else if (routeId === 'initial') {
      return (
        <InitialScreen
        navigator={navigator}/>
      );
    }else if (routeId === 'signin') {
      return (
        <Signin
        navigator={navigator}/>
      );
    }else if (routeId === 'signupCamera') {
      return (
        <SignupCamera
        navigator={navigator}/>
      );
    }else if (routeId === 'cameraSearch') {
      return (
        <CameraSearch
        navigator={navigator} token={this.state.token}/>
      );
    }
  }
}

 AppRegistry.registerComponent('Lucido', () => Lucido);
