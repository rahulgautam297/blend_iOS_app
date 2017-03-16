import React, { Component } from 'react';
import {
  View,
  Text,
  Navigator,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  TouchableHighlight,
  Image,
  AsyncStorage,
  Dimensions,
  ActivityIndicator,
  ListView,} from 'react-native';
import Camera from 'react-native-camera';
export default class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {token:'', allContacts:'', allNewRequests:'', gotContacts:false, showContacts:true};
  }
  // addContact(){
  //   var array = JSON.parse(this.state.allContacts).concat({name:this.props.name, mobile:this.props.mobile, email:this.props.email})
  //   this.setState({allContacts: JSON.stringify(array)});
  // }
  async getVariable(item) {
    try {
      const value = await AsyncStorage.getItem(item);
      if (value !== null){
        return value;
      }else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
  componentWillMount() {
    //this.getVariable(firstLaunch).then((result) => this.setState({firstLaunch: result}));
    // if(this.props.gotResponse !==null && this.props.gotResponse ===true)
    //   this.getVariable('allContacts').then((result)=> this.setState({allContacts:result})).then(()=>this.addContact()).then(()=>this.storeVariable(this.state.allContacts));
    this.getVariable("token").then((result)=> this.setState({token:result})).then(()=> this.getAllContactsRequest());
  }

  async storeVariable(allContacts) {
    try {
      await AsyncStorage.setItem('allContacts', allContacts );
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }

  async clearStorage(){
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }

  getAllContactsRequest(){
    var that = this;
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/get_all_contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: that.state.token,
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({allContacts:responseJson.connections, gotContacts:true})
      })
      .catch((error) => {
        console.error(error);
    });
  }

  renderAllContacts(){
     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <ListView
        dataSource={ds.cloneWithRows(this.state.allContacts)}
        renderRow={(rowData) => <Text>{rowData.name}</Text>}
      />
    );
  }

  showAllContacts(){
    if (!this.state.gotContacts){
      return (<ActivityIndicator />)
    }else if(this.state.gotContacts){
       return(this.renderAllContacts())
     }
  }

  getAllPendingContactsRequest(){
    var that = this;
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/get_pending_received_requests', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: that.state.token,
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
      this.setState({gotContacts: true, allNewRequests: JSON.stringify(responseJson.connections)})
      })
      .catch((error) => {
        console.error(error);
    });
  }

  showAllPendingContacts(){
    if (!this.state.gotContacts) {
      return (<ActivityIndicator />)
    }else if(this.state.gotContacts){
       return(<Text>{this.state.allNewRequests}</Text>)
     }
  }

  render() {
    return (
      <View style= {styles.container}>
        <View style= {styles.buttonContainer}>
          <TouchableHighlight style={styles.contactsButton} onPress={() => {this.setState({gotContacts: false,showContacts: true}); this.showAllContacts();}} underlayColor="#8b0000">
            <Text style={styles.headingButton}>
              Contacts
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.newReqsButton} onPress={() => {this.setState({gotContacts: false,showContacts: false}); this.showAllPendingContacts(); }} underlayColor="#8b0000">
            <Text style={styles.headingButton}>
              New Requests
            </Text>
          </TouchableHighlight>
        </View>
        <View>
        {this.showAllContacts()}
        </View>
        <View style= {styles.buttonContainer1}>
          <TouchableHighlight style={styles.wipeButton} onPress={() => {this.clearStorage(); this.props.navigator.replace({id: 'initial'});}} underlayColor="#8b0000">
            <Text style={styles.uploadButton}>
              wipe memory!
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.connectButton} onPress={() => { this.props.navigator.replace({id: 'cameraSearch'});}} underlayColor="#8b0000">
            <Text style={styles.uploadButton}>
              connect!
            </Text>
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
    backgroundColor: '#F5FCFF',
    justifyContent: 'space-between'
  },
  buttonContainer:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height/30,
    flexDirection:'row',
    justifyContent:"space-around",
    marginTop: 30,
    backgroundColor:"silver"
  },
  buttonContainer1:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height/22,
    flexDirection:'row',
    justifyContent:"space-around",
    backgroundColor:"green",
  },
  contactsButton:{
  },
  newReqsButton:{
  },
  headingButton:{
    color:"black"
  },
  wipeButton:{

  },
  connectButton:{

  },
  paneContainer:{
    alignSelf: 'center',
    marginTop:Dimensions.get('window').width/2,
  },
  uploadHighlight: {
    backgroundColor: "#F97240",
    padding: 20,
    borderRadius: 50,
    marginTop: 10,
  },
  uploadHighlight1: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 50,
    marginTop: 10,
  },
  uploadButton: {
    color: "#ffffff",
    fontWeight: "600"
  },
});
