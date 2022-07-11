import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth, db } from '../../Firebase/Firebase';
import { doc, onSnapshot } from "firebase/firestore";

// this screen displays all the halls, and is the first page of the bookings tab
// users will choose the hall of the facility they would like to book
// user can only enter his own hall, but this page still exists for admins to regulate (debugging etc)
const BookingsScreen = ({navigation}) => {

  // obtain user information from firestore
  const user = auth.currentUser
  const [hall, setHall] = useState('')
  const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    const data = doc.data();
    if (data) {
      setHall(data.hall)
    } else {
      setHall("");
    }
  });  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button for TH, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "TH") {
            navigation.navigate("Block", {hall: hall})
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.TH}
      >
        <Image source={require('../../assets/th.png')} style={{width: 70, height: 70, }}/> 
        <Text style={styles.buttonText}>Temasek Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for EH, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "EH") {
            navigation.navigate("Block", {hall: hall})
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.EH}
      >
        <Image source={require('../../assets/eh.png')} style={{width: 70, height: 70, }}/> 
        <Text style={styles.buttonText}>Eusoff Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for SH, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "SH") {
            navigation.navigate("Block", {hall: hall})
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.SH}
      >
        <Image source={require('../../assets/sh.png')} style={{width: 70, height: 70, }}/> 
        <Text style={styles.buttonText}>Sheares Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for KR, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "KR") {
            navigation.navigate("Block", {hall: hall})
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.KR}
      >
        <Image source={require('../../assets/kr.png')} style={{width: 70, height: 70, }}/> 
        <Text style={styles.krbuttonText}>Kent Ridge Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for PGP, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "LH") {
            navigation.navigate("Block", {hall: hall})
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.LH}
      >
        <Image source={require('../../assets/ph.png')} style={{width: 70, height: 70, }}/> 
        <Text style={styles.krbuttonText}>Prince George's Park Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for KE, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "KE") {
            navigation.navigate("Block", {hall: hall})
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.KE}
      >
        <Image source={require('../../assets/ke.png')} style={{width: 70, height: 70, }}/> 
        <Text style={styles.krbuttonText}>King Edwards VII Hall </Text>
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
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'green',
    borderWidth: 2,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 20,
  },
  EH: {
    backgroundColor: 'yellow',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'red',
    borderWidth: 2,
  },
  SH: {
    backgroundColor: 'orange',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'black',
    borderWidth: 2,
  },
  KR: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'black',
    borderWidth: 2,
  },
  krbuttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  LH: {
    backgroundColor: 'gray',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    borderColor: 'yellow',
    borderWidth: 2,
  },
  KE: {
    backgroundColor: 'red',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
    borderColor: 'yellow',
    borderWidth: 2,
  },
})