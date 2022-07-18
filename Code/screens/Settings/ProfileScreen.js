import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';

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

  const navigation = useNavigation();
  
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
      return "A";
    }
    else if (letter === "B") {
      return "B";
    }
    else if (letter === "C") {
      return "C";
    }
    else if (letter === "D") {
      return "D";
    }
    else {
      return "E";
    }
  }

  return (
    // display profile fields, yet to implement edit
    <View style={styles.container}>
      <Text>Email: {email}</Text>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate("Email")}
        style={styles.button}
      >
        <Text style={styles.text} >Edit Email</Text>
      </TouchableOpacity>
      
      <Text>Name: {name}</Text>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate("Name")}
        style={styles.button}
      >
        <Text style={styles.text} >Edit Name</Text>
      </TouchableOpacity>
      
      <Text>Hall: {hallName(hall)}</Text>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate("Edit Hall")}
        style={styles.button}
      >
        <Text style={styles.text} >Edit Hall</Text>
      </TouchableOpacity>

      <Text>Block: {blockName(block)}</Text>

      <TouchableOpacity 
        onPress={() => navigation.navigate("Edit Block")}
        style={styles.button}
      >
        <Text style={styles.text} >Edit Block</Text>
      </TouchableOpacity>
      
      <Text>Level: {level} </Text>

      <TouchableOpacity 
        onPress={() => navigation.navigate("Edit Level")}
        style={styles.button}
      >
        <Text style={styles.text} >Edit Level</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("Change Password")}
        style={styles.button}
      >
        <Text style={styles.text} >Change Password</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: 'white',
    width: '40%',
    padding: 2,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0782F9',
    marginTop: 10
  },
  text: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  }
})