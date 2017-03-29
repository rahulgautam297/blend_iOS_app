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
    this.state = {token:'', contacts:'', requests:'', gotData:false, showContacts:true, sync:''};
  }
  async getVariable(item1,item2) {
    try {
      const value = await AsyncStorage.multiGet([item1, item2]);
      if (value[0][1] !== null){
        return value;
      }else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
  componentWillMount() {
    this.getVariable("token", "sync").then((result)=> this.setState({token:result[0][1], sync:result[1][1]})).then(()=> {
      if(this.state.sync==null){
        this.getContactsRequest().then(() => this.syncDone())
      }else if(this.state.sync === "1"){
        this.loadFromStorage();
      }
    });
  }

  loadFromStorage(){
    var RNFS = require('react-native-fs');
    RNFS.readDir(RNFS.DocumentDirectoryPath)
    .then((result) => {
        var contacts = null;
        for (var i = 0; i < result.length; i++) {
          if (result[i].name==='contacts.txt'){
            contacts = result[i];
            break;
          }
        }
        return contacts;
      })
      .then((contacts) => {
        contactsList = RNFS.readFile(contacts.path, 'utf8');
        return contactsList;
      })
      .then((contactsList) => {
        hash = JSON.parse(contactsList);
        this.setState({contacts: hash['contactsList'], requests: hash['requestsList'], gotData:true});
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }
  async syncDone() {
    try {
      await AsyncStorage.setItem('sync', "1");
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

  getContactsRequest(){
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
        this.setState({contacts:responseJson.connections, requests:responseJson.requests, gotData:true})
        var hash={}
        hash['contactsList'] = responseJson.connections;
        hash['requestsList'] = responseJson.requests;
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/contacts.txt';
        RNFS.writeFile(path, JSON.stringify(hash), 'utf8')
        return responseJson
      })
      .catch((error) => {
        console.error(error);
    });
  }

  renderContacts(){
     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <ListView
        enableEmptySections={true}
        dataSource={ds.cloneWithRows(this.state.contacts)}
        renderRow={(rowData) => (<View style={styles.listRowContainer}><Text style={styles.listRow}>{rowData.name}</Text></View>)}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      />
    );
  }
  renderRequests(){
     const dsa = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <ListView
        enableEmptySections={true}
        dataSource={dsa.cloneWithRows(this.state.requests)}
        renderRow={(rowData) => (<View style={styles.listRowContainer}><Text style={styles.listRow}>{rowData.name}</Text></View>)}
        renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
      />
    );
  }

  showContacts(){
    if (!this.state.gotData && this.state.showContacts){
      return (<ActivityIndicator />)
    }else if(this.state.gotData && this.state.showContacts){
       return(this.renderContacts())
    }
  }
  showRequests(){
    if (!this.state.gotData && !this.state.showContacts) {
      return (<ActivityIndicator />)
    }else if(this.state.gotData && !this.state.showContacts){
       return(this.renderRequests())
     }
  }

  render() {
    return (
      <View style= {styles.container}>
        <View style= {styles.buttonContainer}>
          <TouchableHighlight style={styles.contactsButton} onPress={() => {this.setState({showContacts: true});}} underlayColor="white">
            <Text style={styles.headingButton}>
              Contacts
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.newReqsButton} onPress={() => {this.setState({showContacts: false});}} underlayColor="white">
            <Text style={styles.headingButton}>
              New Requests
            </Text>
          </TouchableHighlight>
        </View>
        {this.showContacts()}
        {this.showRequests()}
        <View style= {styles.buttonContainer1}>
          <TouchableHighlight style={styles.wipeButton} onPress={() => {this.clearStorage(); this.props.navigator.replace({id: 'initial'});}} underlayColor="white">
            <Text style={styles.uploadButton}>
              wipe memory!
            </Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.connectButton} onPress={() => { this.props.navigator.replace({id: 'cameraSearch'});}} underlayColor="white">
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
  listRow:{
    fontSize: 16,
  },
  listRowContainer:{
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'#EAEAEA',
    width:Dimensions.get('window').width,
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
});
