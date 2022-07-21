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
  // read user profile on firestore and store details
  const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
     const data = doc.data();
     setEmail(data.email)
     setName(data.name)
     setHall(data.hall)
     setBlock(data.block)
     setLevel(data.level)
  });

  const navigation = useNavigation();
  
  /**
   * to match abbreviation to full hall name (since we stored abbrev to save space in firestore)
   * 
   * @param hallAbbreviation the 2 character string used in to store the the hall of the user
   * @return full string name of the hall
   */
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

  /**
   * to match abbreviation to letter / number for blocks(since we stored only letters to save space in firestore)
   * 
   * @param letter the char used to store the block the user selected
   * @return full string name of the block
   */
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
    // display profile fields
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.details} >Email: {email}</Text>
      
        <TouchableOpacity 
          // button to edit user email, brings them to page to edit email
          onPress={() => navigation.navigate("Edit Email")}
          style={styles.editButton}
        >
        <Image source={require('../../assets/edit.png')} style={{width: 20, height: 20, tintColor: '#0782F9'}}/> 
        </TouchableOpacity>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.details} >Name: {name}</Text>
        
        <TouchableOpacity 
        // button to edit user name, brings them to page to edit name
          onPress={() => navigation.navigate("Edit Name")}
          style={styles.editButton}
        >
          <Image source={require('../../assets/edit.png')} style={{width: 20, height: 20, tintColor: '#0782F9'}}/> 
        </TouchableOpacity>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.details} >Hall: {hallName(hall)}</Text>
      
        <TouchableOpacity 
        // button to edit user hall, brings them to page to edit hall
          onPress={() => navigation.navigate("Edit Hall")}
          style={styles.editButton}
        >
          <Image source={require('../../assets/edit.png')} style={{width: 20, height: 20, tintColor: '#0782F9'}}/> 
        </TouchableOpacity>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.details} >Block: {blockName(block)}</Text>

        <TouchableOpacity 
        // button to edit user block, brings them to page to edit block
          onPress={() => navigation.navigate("Edit Block")}
          style={styles.editButton}
        >
          <Image source={require('../../assets/edit.png')} style={{width: 20, height: 20, tintColor: '#0782F9'}}/> 
        </TouchableOpacity>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.details} >Level: {level} </Text>

        <TouchableOpacity 
        // button to edit user level, brings them to page to edit level
          onPress={() => navigation.navigate("Edit Level")}
          style={styles.editButton}
        >
          <Image source={require('../../assets/edit.png')} style={{width: 20, height: 20, tintColor: '#0782F9'}}/> 
        </TouchableOpacity>
      </View>
      

      <TouchableOpacity 
      // button to edit user password, brings them to page to edit password
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
  },
  editButton: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    fontWeight: '700',
  },
  detailsContainer: {
    width: '80%',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})