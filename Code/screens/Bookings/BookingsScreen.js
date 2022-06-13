import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth, db } from '../../Firebase/Firebase';
import { doc, onSnapshot } from "firebase/firestore";

// to be exported for bookings to be made later on
var hallname;

// this screen displays all the halls, and is the first page of the bookings tab
// users will choose the hall of the facility they would like to book
// user can only enter his own hall, but this page still exists for admins to regulate (debugging etc)
const BookingsScreen = () => {
  // to navigate within bookings stack
  const navigation = useNavigation();

  // obtain user information from firestore
  const user = auth.currentUser
  const [hall, setHall] = useState('')
  const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
   const data = doc.data();
   setHall(data.hall)
   hallname = hall;
  });  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button for TH, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "TH") {
            navigation.navigate("Block")
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.TH}
      >
        <Text style={styles.buttonText}>Temasek Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for EH, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "EH") {
            navigation.navigate("Block")
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.EH}
      >
        <Text style={styles.buttonText}>Eusoff Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for SH, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "SH") {
            navigation.navigate("Block")
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.SH}
      >
        <Text style={styles.buttonText}>Sheares Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for KR, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "KR") {
            navigation.navigate("Block")
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.KR}
      >
        <Text style={styles.krbuttonText}>Kent Ridge Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for PGP, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "LH") {
            navigation.navigate("Block")
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.LH}
      >
        <Text style={styles.krbuttonText}>Prince George's Park Hall </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for KE, which will bring users to select which block within hall 1
        onPress={() => {
          if (hall === "KE") {
            navigation.navigate("Block")
          }
          else {
            alert("You can only book facilities from your own hall!")
          }
        }}
        style={styles.KE}
      >
        <Text style={styles.krbuttonText}>King Edwards VII Hall </Text>
      </TouchableOpacity>
    </View>
  )
}

export default BookingsScreen

export {hallname}

// styles within screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  TH: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 20,
  },
  EH: {
    backgroundColor: 'yellow',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  SH: {
    backgroundColor: 'orange',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  KR: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  krbuttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  LH: {
    backgroundColor: 'gray',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  KE: {
    backgroundColor: 'red',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
})