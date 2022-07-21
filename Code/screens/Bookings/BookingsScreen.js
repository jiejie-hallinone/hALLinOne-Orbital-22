import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, onSnapshot } from "firebase/firestore";

// this screen displays all the halls, and is the first page of the bookings tab
// users will choose the hall of the facility they would like to book
// user can only enter his own hall, but this page still exists for admins to regulate (debugging etc)
const BookingsScreen = ({navigation}) => {

  // obtain user information from firestore
  const user = auth.currentUser
  
  // state to store the hall of the user
  const [hall, setHall] = useState('')
  
  // reads the user profile from firestore
  const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    // obtain data stored
    const data = doc.data();
    // if data exists
    if (data) {
      // set hall to the value stored under "hall" in firestore
      setHall(data.hall)
    } else {
      // set hall to empty string
      setHall("");
    }
  });  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button for TH, which will bring users to select which block within hall 1
        onPress={() => {
          // if the user's hall is TH
          if (hall === "TH") {
            // passes the user's hall onto the next screen, which is to select the block
            navigation.navigate("Block", {hall: hall})
          }
          else {
            // else alerts the user that they can only select their own hall
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.TH}
      >
        <Image source={require('../../assets/th.png')} style={{width: 50, height: 50, }}/> 
        <Text style={styles.buttonText}>Temasek Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for EH, which will bring users to select which block within hall 1
        onPress={() => {
          // if the user's hall is EH
          if (hall === "EH") {
            // passes the user's hall onto the next screen, which is to select the block
            navigation.navigate("Block", {hall: hall})
          }
          else {
            // else alerts the user that they can only select their own hall
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.EH}
      >
        <Image source={require('../../assets/eh.png')} style={{width: 50, height: 50, marginRight: 5}}/> 
        <Text style={styles.buttonText}>Eusoff Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for SH, which will bring users to select which block within hall 1
        onPress={() => {
          // if the user's hall is SH
          if (hall === "SH") {
            // passes the user's hall onto the next screen, which is to select the block
            navigation.navigate("Block", {hall: hall})
          }
          else {
            // else alerts the user that they can only select their own hall
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.SH}
      >
        <Image source={require('../../assets/sh.png')} style={{width: 50, height: 50, marginRight: 5}}/> 
        <Text style={styles.buttonText}>Sheares Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for KE, which will bring users to select which block within hall 1
        onPress={() => {
          // if the user's hall is KE
          if (hall === "KE") {
            // passes the user's hall onto the next screen, which is to select the block
            navigation.navigate("Block", {hall: hall})
          }
          else {
            // else alerts the user that they can only select their own hall
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.KE}
      >
        <Image source={require('../../assets/ke.png')} style={{width: 50, height: 50, marginRight: 5}}/> 
        <Text style={styles.krbuttonText}>King Edwards VII Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for PGP, which will bring users to select which block within hall 1
        onPress={() => {
          // if the user's hall is PGP
          if (hall === "LH") {
            // passes the user's hall onto the next screen, which is to select the block
            navigation.navigate("Block", {hall: hall})
          }
          else {
            // else alerts the user that they can only select their own hall
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.LH}
      >
        <Image source={require('../../assets/ph.png')} style={{width: 50, height: 50, marginRight: 5}}/> 
        <Text style={styles.krbuttonText}>Prince George's Park Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for KR, which will bring users to select which block within hall 1
        onPress={() => {
          // if the user's hall is KR
          if (hall === "KR") {
            // passes the user's hall onto the next screen, which is to select the block
            navigation.navigate("Block", {hall: hall})
          }
          else {
            // else alerts the user that they can only select their own hall
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.KR}
      >
        <Image source={require('../../assets/kr.png')} style={{width: 50, height: 50, marginRight: 8}}/> 
        <Text style={styles.krbuttonText}>Kent Ridge Hall </Text>
      </TouchableOpacity>
    </View>
  )
}

export default BookingsScreen

// styles within screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  TH: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'green',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 20,
  },
  EH: {
    backgroundColor: 'gold',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'red',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  SH: {
    backgroundColor: 'orange',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'black',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  KR: {
    backgroundColor: '#001aa7',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
    borderColor: '#fff500',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  krbuttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  LH: {
    backgroundColor: '#2a3086',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
    borderColor: '#dbb526',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  KE: {
    backgroundColor: 'maroon',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'yellow',
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
})