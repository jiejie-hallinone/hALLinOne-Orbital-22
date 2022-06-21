import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, onSnapshot } from "firebase/firestore";

// users will be brought here if profile is selected from settings 
// users can view and edit their profile information
const ProfileScreen = () => {
  // obtain user information from firestore
  const user = auth.currentUser
  const [email, setEmail] = useState('') 
  const [name, setName] = useState('')
  const [hall, setHall] = useState('')
  const [block, setBlock] = useState('')
  const [level, setLevel] = useState('')
  const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
     const data = doc.data();
     setEmail(data.email)
     setName(data.name)
     setHall(data.hall)
     setBlock(data.block)
     setLevel(data.level)
  });
  
  // to match abbreviation to full hall name (since we stored abbrev to save space in firestore)
  const hallName = hallAbbreviation => {
    if (hallAbbreviation === "TH") {
      return "Temasek Hall";
    }
    else if (hallAbbreviation === "EH") {
      return "Eusoff Hall";
    }
    else if (hallAbbreviation === "SH") {
      return "Sheares Hall";
    }
    else if (hallAbbreviation === "KR") {
      return "Kent Ridge Hall";
    }
    else if (hallAbbreviation === "LH") {
      return "Prince George's Park Hall";
    }
    else {
      return "King Edwards VII Hall"
    }
  }

  // to match abbreviation to letter / number for blocks(since we stored only letters to save space in firestore)
  const blockName = letter => {
    if (letter === "A") {
      return "A / 1";
    }
    else if (letter === "B") {
      return "B / 2";
    }
    else if (letter === "C") {
      return "C / 3";
    }
    else if (letter === "D") {
      return "D / 4";
    }
    else {
      return "E / 5";
    }
  }

  return (
    // display profile fields, yet to implement edit
    <View style={styles.container}>
      <Text>Email: {email}</Text>
      <Text>Name: {name}</Text>
      <Text>Hall: {hallName(hall)}</Text>
      <Text>Block: {blockName(block)}</Text>
      <Text>Level: {level} </Text>
    </View>
  )
}

export default ProfileScreen

// styles used within screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})