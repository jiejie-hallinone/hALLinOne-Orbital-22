import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView'
import { Picker } from '@react-native-picker/picker'
import { auth, db } from '../../Firebase/Firebase';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from "firebase/firestore"; 

const EditLevelScreen = () => {
  // to select level
    const [level, setLevel] = useState('')

    // to navigate between authentication stack
    const navigation = useNavigation();

    return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
      >
        <View style={styles.inputContainer}> 
            <Text style={styles.text}>Select your level </Text>
              
              <Picker
              // picker to select level
              // appears as dropdown for android, scrolling wheel for ios
               style={styles.picker}
               placeholder="Select your level"
               selectedValue={level}
               onValueChange={(val, index) => setLevel(val)}
               >
              <Picker.Item label="1" value='1' />
              <Picker.Item label="2" value='2' />
              <Picker.Item label="3" value='3' />
              <Picker.Item label="4" value='4' />
              <Picker.Item label="5" value='5' />
              <Picker.Item label="6" value='6' />
              <Picker.Item label="7" value='7' />
              <Picker.Item label="8" value='8' />
             </Picker>

               <View style={styles.buttonContainer}>
              <TouchableOpacity
                // button that when pressed, updates user level into firestore profile (in users, document under uid)
                onPress={() => {
                    try{
                      if (level === '') {
                        alert("Please select your level!")
                      } else {
                        // updates user's level into profile on firestore
                        const docRef = updateDoc(doc(db, "users", auth.currentUser.uid), {
                          level: level,
                        });
                        console.log("Document updated with level: ", level);
                        alert("Level updated!")
                        navigation.navigate("Profile");
                      }
                    } catch (e) {
                      console.error("Error adding document: ", e);
                    }  
                  }}
              
                style={[styles.button, styles.buttonOutline]}
              >
                <Text style={styles.buttonOutlineText}>Confirm</Text>
              </TouchableOpacity> 
              </View>
  
       </View>
      </KeyboardAvoidingView>
    )
}

export default EditLevelScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      inputContainer: {
        width: '80%',
        alignItems: 'center',
      },
      text:{
        fontWeight: '700',
        fontSize: 20,
      },
      buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
      },
      button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
      },
      buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
      },
      buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
      },
      buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
      },
      picker: {
        width: '100%',
        borderRadius: 10,
        marginTop: 5,
        borderWidth: 2,
        borderColor: '#0782F9',
      }
})