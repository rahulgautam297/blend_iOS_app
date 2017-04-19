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
  Switch,
  ActivityIndicator} from 'react-native';
  import RNFetchBlob from 'react-native-fetch-blob'
export default class DrawerPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {image:''};
  }
  componentWillMount() {
    if (this.props.image == '' || this.props.image == null) {
      this.getImage()
    } else if (this.props.image != ''){
      if (this.props.previousScreen==="signIn")
        this.receiveImage()
      else{
        this.setState({image: this.props.image});
      }
    }
  }

  setSwitchValue(){
    if(this.props.status==="1"){
      return true;
    }else if(this.props.status==="0"){
      return false;
    }
  }

  showRelevantText(){
    if(this.props.status==="1"){
      return(
        <View style={styles.statusTextContainer}>
          <View style={styles.circularStatus}></View>
          <Text style={styles.statusText}>Active</Text>
        </View>
      )
    }else if(this.props.status==="0"){
      return(
        <View style={styles.statusTextContainer}>
          <View style={styles.circularInactiveStatus}></View>
          <Text style={styles.statusText}>Inactive</Text>
        </View>
      )
    }
  }
  showSwitchOrGif(){
    if (this.props.inTransition == false){
      return(
        <View style={styles.switchContainer}>
          <Switch value={this.setSwitchValue()}
          onValueChange={() => this.props.changeStatus()}>
          </Switch>
        </View>
      )
    }else if(this.props.inTransition == true){
      return(
        <View style={styles.switchContainer}>
          <ActivityIndicator />
        </View>
      )
    }
  }

  receiveImage(){
    console.log(dirs);
    let dirs = RNFetchBlob.fs.dirs
    RNFetchBlob
    .config({
      path : dirs.DocumentDir + '/display_picture.jpg'
    })
    .fetch('GET', this.props.image, {
    })
    .then((res) => {
      this.setState({image: res.path()});
    })
  }

  getImage(){
    let path = RNFetchBlob.fs.dirs.DocumentDir + '/display_picture.jpg'
    this.setState({image: path});
  }

  renderImage(){
    if (this.state.image == '' || this.state.image == null){
      return null;
    }else{
      return(
        <View style={styles.testImageContainer}>
           <Image source = {{uri: this.state.image}}  style={styles.testImage} />
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.paneRoof}>
        </View>
        { this.renderImage() }
        <Text style={styles.userName}>{this.props.name}</Text>
        <TouchableHighlight onPress={() => {this.props.navigate.replace({id: 'editProfile', image:this.state.image});}} underlayColor="transparent">
          <View style={styles.editContainer}>
            <Text style={styles.editUser}>Edit Profile</Text>
            <Image source={require('./pencil.png')}  style={styles.pencilImage} />
          </View>
        </TouchableHighlight>
        <View style={styles.statusContainer}>
          {this.showRelevantText()}
          {this.showSwitchOrGif()}
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
    height:10,
    alignItems:"center",
    justifyContent:"center",
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
  },
  circularInactiveStatus:{
    backgroundColor: '#B4B7B6',
    borderRadius: 50,
    width:20,
    height:20,
    marginLeft:15,
  }
});
