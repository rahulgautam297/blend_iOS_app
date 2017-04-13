import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
export default class Card extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./card_background.png')}  style={styles.backgroundImage}>
          <TouchableHighlight style={styles.crossButtonTouch} onPress={() =>{this.props.navigator.replace({id: 'contactList'});}} underlayColor="transparent">
            <Image source={require('./cross.png')}  style={styles.crossButton} />
          </TouchableHighlight>
          <View style={styles.testImageContainer}>
             <Image source={require('./sandra.png')}  style={styles.testImage} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>
              {this.props.name}
            </Text>
            <Text style={styles.professionText}>
              Creative Writer
            </Text>
            <TouchableHighlight  underlayColor="transparent" onPress={() => Linking.openURL('tel:'+ this.props.mobile)}>
              <Text style={styles.mobileText}>
                {this.props.mobile}
              </Text>
            </TouchableHighlight>
            <TouchableHighlight  underlayColor="transparent" onPress={() => Linking.openURL('mailto:'+ this.props.email)}>
              <Text style={styles.emailText}>
                {this.props.email}
              </Text>
            </TouchableHighlight>
          </View>
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop:16,

  },
  textHighlight: {
    backgroundColor: "#ffffff",
    paddingTop: 14,
    paddingBottom: 14,
    width:200,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 10,
    opacity:0.85,
  },
  backgroundImage:{
      width:Dimensions.get('window').width,
      height:675,
  },
  crossButton: {
    width:25,
    height:25,
    marginTop:20,
    marginLeft:15
  },
  crossButtonTouch:{
    width:50,
    height:50,
  },
  testImageContainer:{
    borderRadius: 100,
    overflow:'hidden',
    marginTop:50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"black",
    width:200,
    height:200,
    alignSelf:'center'
  },
  testImage:{
    width:200,
    height:200,
  },
  infoContainer:{
    marginTop:50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText:{
    fontSize:35,
    fontWeight:"500",
  },
  professionText:{
    fontSize:28,
    fontWeight:"400",
    marginTop:4,
    color:"#613E90",
  },
  mobileText:{
    fontSize:20,
    fontWeight:"300",
    marginTop:7,
  },
  emailText:{
    fontSize:20,
    fontWeight:"300",
    marginTop:10,
  }
});
