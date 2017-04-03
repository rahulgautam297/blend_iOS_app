import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  StyleSheet,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Dimensions,
  ListView,
  Switch} from 'react-native';
export default class DrawerPanel extends Component {

  constructor(props) {
    super(props);
  }

  setSwitchValue(){
    if(this.props.status==="1"){
      return true;
    }else {
      return false;
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.paneRoof}>
        </View>
        <View style={styles.testImageContainer}>
           <Image source={require('./logo.png')}  style={styles.testImage} />
        </View>
        <Text style={styles.userName}>{this.props.name}</Text>
        <View style={styles.editContainer}>
          <Text style={styles.editUser}>Edit Profile</Text>
          <Image source={require('./pencil.png')}  style={styles.pencilImage} />
        </View>
        <View style={styles.statusContainer}>
          <View style={styles.statusTextContainer}>
            <View style={styles.circularStatus}></View>
            <Text style={styles.statusText}>Active</Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch value={this.setSwitchValue()}></Switch>
          </View>
        </View>
        <View style={styles.fiveButtonContainer}>
          <View style={styles.inviteContainer}>
            <Image source={require('./invite.png')}  style={styles.fiveButtonImage} />
            <Text style={styles.fiveButtonText}>Invite</Text>
          </View>
          <View style={styles.feedbackContainer}>
            <Image source={require('./nib.png')}  style={styles.fiveButtonImage} />
            <Text style={styles.fiveButtonText}>Feedback</Text>
          </View>
          <View style={styles.aboutContainer}>
            <Image source={require('./about.png')}  style={styles.fiveButtonImage} />
            <Text style={styles.fiveButtonText}>About Blend</Text>
          </View>
          <View style={styles.termsContainer}>
            <Image source={require('./terms.png')}  style={styles.fiveButtonImage} />
            <Text style={styles.fiveButtonText}>Terms of Use</Text>
          </View>
          <TouchableHighlight onPress={() => {this.props.wipe() }} underlayColor="transparent">
            <View style={styles.signOutContainer}>
              <Image source={require('./sign_out.png')}  style={styles.fiveButtonImage} />
              <Text style={styles.fiveButtonText}>Sign Out</Text>
            </View>
          </TouchableHighlight>
        </View>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width:Dimensions.get('window').width*0.8,
  },
  paneRoof:{
    width:Dimensions.get('window').width*0.8,
    height:25,
    marginTop:17,
    backgroundColor:"#292C37"
  },
  testImage:{
    width:120,
    height:120,
  },
  testImageContainer:{
    borderRadius: 60,
    overflow:'hidden',
    marginTop:40,
  },
  userName:{
    fontSize:20,
    fontWeight:"400",
    marginTop:12,
  },
  editContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:8.5,
  },
  editUser:{
    fontSize:15,
    fontWeight:"300",
  },
  pencilImage:{
    width:17,
    height:17,
    marginLeft:3,
  },
  statusContainer:{
    marginTop:25,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:Dimensions.get('window').width*0.8,
  },
  statusTextContainer:{
    flexDirection:'row',
    alignItems:'center',
  },
  statusText:{
    fontSize:20,
    fontWeight:"700",
    marginLeft:7,
  },
  circularStatus:{
    backgroundColor: '#1ABC9C',
    borderRadius: 50,
    width:20,
    height:20,
    marginLeft:15,
  },
  switchContainer:{
    marginRight:15,
  },
  fiveButtonContainer:{
    marginTop:40,
    width:Dimensions.get('window').width*0.8,
    alignItems:'flex-start'
  },
  inviteContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:15
  },
  aboutContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:15,
    marginTop:17.5,
  },
  termsContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:15,
    marginTop:17.5,
  },
  feedbackContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:15,
    marginTop:17.5,
  },
  signOutContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginLeft:15,
    marginTop:17.5,
  },
  fiveButtonImage:{
    width:22,
    height:22,
  },
  fiveButtonText:{
    fontSize:20,
    fontWeight:"400",
    marginLeft:7,
  }
});
