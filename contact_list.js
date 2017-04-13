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
  ListView,
  RefreshControl,} from 'react-native';
import Drawer from 'react-native-drawer';
import DrawerPanel from './drawer_panel.js';
export default class ContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {token:'', contacts:'', requests:'', name:'', gotData:false, refreshing:false, showContacts:true, sync:'',
     inTransition:false, acceptAI:false, rejectAI:false, reportAI:false, status:"1", inTransition:false,searchText:"",showSearchBar:false, contactsCopy:'', requestsCopy:''};
  }
  async getVariable(item1, item2, item3, item4) {
    try {
      const value = await AsyncStorage.multiGet([item1, item2, item3, item4]);
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
    this.getVariable("token", "sync", "name", "status").then((result)=> this.setState({token:result[0][1], sync:result[1][1], name:result[2][1],
       status:result[3][1]})).then(()=> {
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

  clearEverything(){
    this.clearStorage().then(() =>{
      var RNFS = require('react-native-fs');
      var path = RNFS.DocumentDirectoryPath + '/contacts.txt';
      return RNFS.unlink(path)
      .then(() => {
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/display_picture.jpg';
        return RNFS.unlink(path)
      })
      .catch((err) => {
        console.log(err.message);
      });
    })
    .then(() => {this.props.navigator.replace({id: 'initial'});})
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
        var hash={};
        hash['contactsList'] = responseJson.connections;
        hash['requestsList'] = responseJson.requests;
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/contacts.txt';
        RNFS.writeFile(path, JSON.stringify(hash), 'utf8');
      })
      .catch((error) => {
        console.error(error);
    });
  }

  getUnSyncedContactsRequest(){
    this.setState({refreshing: true});
    var that = this;
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/get_unsynced_contacts', {
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
        let contacts = responseJson.connections.concat(this.state.contacts);
        let requests = responseJson.requests.concat(this.state.requests);
        this.setState({contacts:contacts, requests:requests, refreshing:false})
        var hash={}
        hash['contactsList'] = contacts;
        hash['requestsList'] = requests;
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/contacts.txt';
        RNFS.writeFile(path, JSON.stringify(hash), 'utf8');
      })
      .catch((error) => {
        console.error(error);
    });
  }

  renderContact(rowData){
    return(
        <TouchableHighlight onPress={() => {
          this.props.navigator.
          replace({id: 'card', name:rowData.name, email:rowData.email, mobile:rowData.mobile});}}
           underlayColor="white" style={styles.rowTouchableButton}>
           <View style={styles.rowContentContainer}>
           <View style={styles.testImageContainer}>
              <Image source={require('./sandra.png')}  style={styles.testImage} />
            </View>
            <View style={styles.rowContentTextContainer}>
              <Text style={styles.rowName}>{rowData.name}</Text>
              <Text style={styles.rowDesignation}>Creative Writer</Text>
            </View>
          </View>
        </TouchableHighlight>
    )
  }


  acceptDeclineOrBlock(c_id,select){
    var that = this;
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/fate_of_request', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: that.state.token,
        select: select,
        c_id: c_id
      })
    })
    .then((response) => response.json())
      .then((responseJson) => {
        let requests = this.state.requests.splice(c_id, 1);
        var hash={};
        hash['requestsList'] = requests;
        if(select === 1){
          responseJson.user["c_id"] = c_id;
          let contact=[];
          contact.push(responseJson.user);
          let contacts = contact.concat(this.state.contacts);
          if (requests.length==0){
            this.setState({requests:requests, contacts:contacts, showContacts:true, inTransition:false, acceptAI:false, rejectAI:false, reportAI:false});
          }else{
            this.setState({requests:requests, contacts:contacts, inTransition:false, acceptAI:false, rejectAI:false, reportAI:false});
          }
          hash['contactsList'] = contacts;
          var RNFS = require('react-native-fs');
          var path = RNFS.DocumentDirectoryPath + '/contacts.txt';
          RNFS.writeFile(path, JSON.stringify(hash), 'utf8');
        }else{
          if (requests.length==0){
            this.setState({requests:requests, inTransition:false, acceptAI:false, rejectAI:false, reportAI:false, showContacts:true});
          }else{
            this.setState({requests:requests, inTransition:false, acceptAI:false, rejectAI:false, reportAI:false});
          }
          hash['contactsList'] = this.state.contacts;
          var RNFS = require('react-native-fs');
          var path = RNFS.DocumentDirectoryPath + '/contacts.txt';
          RNFS.writeFile(path, JSON.stringify(hash), 'utf8');
        }
      })
      .catch((error) => {
        console.error(error);
    });
  }

  renderAcceptOrGif(stateName,select,c_id){
    if(stateName==false){
      return(
        <TouchableHighlight style={styles.newReqsButton} disabled={this.state.inTransition}
         onPress={() => {this.setState({inTransition:true,acceptAI:true}); this.acceptDeclineOrBlock(c_id ,select);}} underlayColor="transparent">
          <Image source={require('./accept.png')}  style={styles.imageButton} />
        </TouchableHighlight>
      )
    }else {
      return (<ActivityIndicator />)
    }
  }
  renderRejectOrGif(stateName,select,c_id){
    if(stateName==false){
      return(
        <TouchableHighlight style={styles.newReqsButton} disabled={this.state.inTransition}
         onPress={() => {this.setState({inTransition:true,rejectAI:true}); this.acceptDeclineOrBlock(c_id ,select);}} underlayColor="transparent">
          <Image source={require('./reject.png')}  style={styles.imageButton} />
        </TouchableHighlight>
      )
    }else {
      return (<ActivityIndicator />)
    }
  }

  renderReportOrGif(stateName,c_id){
    if(stateName==false){
      return(
        <TouchableHighlight style={styles.reportButton} disabled={this.state.inTransition}
         onPress={() => {this.setState({inTransition:true,reportAI:true});this.acceptDeclineOrBlock(c_id, 2);}} underlayColor="transparent">
          <Text style={styles.reportText}>REPORT</Text>
        </TouchableHighlight>
      )
    }else {
      return (<ActivityIndicator />)
    }
  }

  renderRequests(){
     const dsa = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     if (this.state.requests.length==0){
       return (
         <ListView
           enableEmptySections={true}
           keyboardShouldPersistTaps={'always'}
           dataSource={dsa.cloneWithRows([{name:"Pull down to sync."}])}
           renderRow = {(rowData) => (
                                       <Text> {rowData.name} </Text>
                                   )}
           refreshControl={
           <RefreshControl
             refreshing={this.state.refreshing}
             onRefresh={this.getUnSyncedContactsRequest.bind(this)}
             />
           }
         />
       );
     }
     else if (this.state.requests.length > 0){
      return (
        <ListView
          enableEmptySections={true}
          keyboardShouldPersistTaps={'always'}
          dataSource={dsa.cloneWithRows(this.state.requests)}
          renderRow = {(rowData) => (
                                    <View style={styles.listRowContainer}>
                                      <Text style={styles.listRow}> {rowData.name} </Text>
                                      <Text style={styles.designation}>Creative Writer</Text>
                                      <View style={styles.buttonRowContainer}>
                                      {this.renderAcceptOrGif(this.state.acceptAI,1,rowData.c_id)}
                                      {this.renderRejectOrGif(this.state.rejectAI,0,rowData.c_id)}
                                      {this.renderReportOrGif(this.state.reportAI,rowData.c_id)}
                                      </View>
                                    </View>
                                  )}
          refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.getUnSyncedContactsRequest.bind(this)}
            />
          }
        />
      );
    }
  }


  renderContacts(){
     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
     if (this.state.contacts.length==0){
       return (
         <ListView
           enableEmptySections={true}
           keyboardShouldPersistTaps={'always'}
           dataSource={ds.cloneWithRows([{name:"Pull down to sync."}])}
           renderRow = {(rowData) => (
                                    <Text> {rowData.name} </Text>
                                   )}
           refreshControl={
           <RefreshControl
             refreshing={this.state.refreshing}
             onRefresh={this.getUnSyncedContactsRequest.bind(this)}
             />
           }
         />
       );
     }else if (this.state.contacts.length > 0){
      return (
        <ListView
          keyboardShouldPersistTaps={'always'}
          enableEmptySections={true}
          dataSource={ds.cloneWithRows(this.state.contacts)}
          renderRow={(rowData) => (this.renderContact(rowData))}
          refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.getUnSyncedContactsRequest.bind(this)}
            />
          }
        />
      );
    }
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

  async changeStatusInStorage(value){
    try {
      await AsyncStorage.setItem('status', value);
    } catch (error) {
      console.log("uh oh no!!!");
    }
  }

  changeSearchStatus(status){
    this.setState({inTransition:true})
    var that = this;
    return fetch('http://production.cp8pxbibac.us-west-2.elasticbeanstalk.com/api/v1/set_search_status', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: that.state.token,
        search_status: status
      })
    })
    .then((response) => response.json())
      .then(() => {
        this.changeStatusInStorage(status);
      })
      .then(() => {
        this.setState({status: status,inTransition:false});
      })
      .catch((error) => {
        console.error(error);
    });
  }

  changeActiveStatus(){
    if (this.state.status==="1"){
      this.changeSearchStatus("0");
    }else if (this.state.status==="0"){
      this.changeSearchStatus("1");
    }
  }

  searchBar(){
    //Can be optimized by checking the text input size. If it's less set state again of copies to originals
    if (this.state.showSearchBar)
    return(
      <View style={styles.searchBoxContainer}>
        <TextInput
        ref="searchInput"
         style={styles.searchBar}
         value={this.state.searchText}
         onChangeText={(searchText) => {this.setState({searchText:searchText},this.searchContacts(searchText));}}
         placeholder="Search"
         returnKeyType={"search"}
         autoFocus={true}
         onFocus={()=>{this.setState({contactsCopy: this.state.contacts, requestsCopy:this.state.requests})}}
         keyboardAppearance={"dark"}/>
         <TouchableHighlight style={styles.cancelButton} onPress={() => {this.refs.searchInput.blur()
         this.setState({showSearchBar:false,searchText:'',contacts: this.state.contactsCopy, requests:this.state.requestsCopy});}} underlayColor="transparent">
             <Text style={styles.cancelText}>Cancel</Text>
         </TouchableHighlight>
       </View>
    )
  }

  searchContacts(text){
    if(this.state.showContacts){
      var array = this.state.contactsCopy;
      var sorted=[]
      for (var i=0; i<array.length; i++) {
          if (array[i].name.toLowerCase().indexOf(text.toLowerCase()) == 0){
            sorted.push(array[i]);
          }
      }
      this.setState({contacts:sorted});
    }else if(!this.state.showContacts){
      var array = this.state.requestsCopy;
      var sorted=[]
      for (var i=0; i<array.length; i++) {
          if (array[i].name.toLowerCase().indexOf(text.toLowerCase())==0){
            sorted.push(array[i]);
          }
      }
      this.setState({requests:sorted});
    }
  }

  render() {
    var drawerStyles = {
       drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3, backgroundColor:'white'},
       main: {paddingLeft: 3},
     }
    return (
      <Drawer
        ref={(ref) => this.drawer = ref}
        type="overlay"
        content={<DrawerPanel name = {this.state.name}  status = {this.state.status} image = {this.props.image} previousScreen={this.props.previousScreen}
        wipe={this.clearEverything.bind(this)} inTransition={this.state.inTransition}
         changeStatus={this.changeActiveStatus.bind(this)} navigate={this.props.navigator}></DrawerPanel>}
        tapToClose={true}
         openDrawerOffset={0.2}
         panCloseMask={0.2}
         closedDrawerOffset={-3}
         styles={drawerStyles}
         tweenHandler={(ratio) => ({
           main: { opacity:(2-ratio)/2 }
         })}
        >
        <View style= {styles.container}>
          <View style={styles.firstSubContainer}>
            <TouchableHighlight style={styles.newReqsButton} onPress={() => {this.drawer.open()}} underlayColor="transparent">
                <Image source={require('./drawer.png')}  style={styles.drawerImage} />
            </TouchableHighlight>
            <Image source={require('./logo.png')}  style={styles.logoImage} />
            <TouchableHighlight style={styles.newReqsButton} onPress={() => {this.setState({showSearchBar: true})}} underlayColor="transparent">
                <Image source={require('./search.png')}  style={styles.searchImage} />
            </TouchableHighlight>
          </View>
          <View style= {styles.buttonContainer}>
            <TouchableHighlight style={styles.contactsButton} onPress={() => {this.setState({showContacts: true});}} underlayColor="transparent">
              <Text style={styles.headingButton}>
                FACES
              </Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.newReqsButton} onPress={() => {this.setState({showContacts: false});}} underlayColor="transparent">
              <Text style={styles.headingButton}>
                REQUESTS
              </Text>
            </TouchableHighlight>
          </View>
          {this.searchBar()}
          {this.showContacts()}
          {this.showRequests()}
          <View style= {styles.addContactButtonContainer}>
            <TouchableHighlight style={styles.addButtonTouch}  onPress={() =>{ this.props.navigator.replace({id: 'cameraSearch'}); }} underlayColor="transparent">
              <Image source={require('./add.png')}  style={styles.addContactImage} />
            </TouchableHighlight>
          </View>
        </View>
      </Drawer>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonContainer:{
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height/20,
    flexDirection:'row',
    justifyContent:"space-around",
    backgroundColor:"white",
    alignItems: 'center'
  },
  reportButton:{
    backgroundColor: "#E74C3C",
    padding:10,
    borderRadius: 50,
  },
  headingButton:{
    color:"#ff7000",
    fontWeight:'bold',
    fontSize: 17
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
  rowName:{
    fontSize: 22,
    fontWeight:'500'
  },
  rowDesignation:{
    fontSize: 15,
  },
  rowContentContainer:{
    flex: 1,
    flexDirection: 'row',
    alignItems:'center'
  },
  rowTouchableButton:{
    width:Dimensions.get('window').width,
    height:70,
  },
  rowContentTextContainer:{
    flex: 1,
    flexDirection: 'column',
    alignItems:'flex-start',
    marginLeft:30
  },
  designation: {
    fontSize: 12,
  },
  reportText: {
    fontSize: 15,
    color:'white',
  },
  imageButton:{
    width:50,
    height:50,
  },
  buttonRowContainer:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstSubContainer:{
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'space-between',
    backgroundColor: '#FF4500',
    alignItems: 'center',
    marginTop:17,
    height:Dimensions.get('window').height/9,
  },
  drawerImage:{
    width:30,
    height:30,
    marginLeft:7
  },
  logoImage:{
    width:165,
    height:60,
  },
  searchImage:{
    width:30,
    height:30,
    marginRight:7
  },
  testImage:{
    width:60,
    height:60,
  },
  testImageContainer:{
    borderRadius: 50,
    marginLeft: 10,
    overflow:'hidden'
  },
  addContactButtonContainer:{
    height:Dimensions.get('window').height/8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonTouch:{
    width:80,
    height:80,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  addContactImage:{
    width:80,
    height:80,
  },
  searchBar: {
  paddingLeft: 30,
  fontSize: 22,
  height: Dimensions.get('window').height/12,
  width:Dimensions.get('window').width*0.8,
  borderWidth: 7,
  borderColor: "#E4E4E4",
  },
  searchBoxContainer:{
    height: Dimensions.get('window').height/12,
    width:Dimensions.get('window').width,
    flexDirection:"row",
  },
  cancelButton:{
    width:Dimensions.get('window').width*0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText:{
    fontWeight:'bold',
    fontSize:17,
  }
});
