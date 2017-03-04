/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 import React, { Component } from 'react';
 import { AppRegistry, Navigator } from 'react-native';

 import Signup from './signup_screen.js';
 import Signin from './signin_screen.js'; 
 import OtpScreen from './otp_screen.js';
 import ContactList from './contact_list.js';
 import InitialScreen from './initial_Screen.js';

 class Lucido extends Component {
   async checkLoggedIn() {
     try {
       const value = await AsyncStorage.getItem('token');
       if (value !== null)
         return true;
     } catch (error) {
       console.log(":/");
     }
   }
   render() {
     return (
      var loggedIn = this.checkLoggedIn();
       <Navigator
        {if(loggedIn== true){
          return (
            initialRoute = {{ id: "signup", mobile:"" }}
          )
        }else if(loggedIn == false){
          return (
            initialRoute = {{ id: "initialScreen", mobile:"" }}
          )
        }
       }
         renderScene={(route, navigator) =>
           this.renderScene(route,navigator)
         }
       />
     )
   }
   renderScene( route, navigator ) {
     var routeId = route.id;
     if (routeId === 'signup') {
       return (
         <Signup navigator={navigator}/>
       );
     }else if (routeId === 'otpScreen') {
       return (
         <OtpScreen
         navigator={navigator} mobile={route.mobile}/>
       );
    }else if (routeId === 'contactList') {
      return (
        <ContactList
        navigator={navigator}/>
      );
    }else if (routeId === 'initialScreen') {
      return (
        <initialScreen
        navigator={navigator}/>
      );
    }else if (routeId === 'signin') {
      return (
        <Signin
        navigator={navigator}/>
      );
    }
  }
}

 AppRegistry.registerComponent('Lucido', () => Lucido);

 // onForward={() => {
 //   const nextIndex = route.index + 1;
 //   navigator.push({
 //     index: nextIndex,
 //   });
 // }}
 //
 // // Function to call to go back to the previous scene
 // onBack={() => {
 //   if (route.index > 0) {
 //     navigator.pop();
 //   }
 // }}
