import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView'
import { Picker } from '@react-native-picker/picker'
import { auth, db } from '../../Firebase/Firebase';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from "firebase/firestore"; 

const FirstTimeSetupHallScreen = () => {
  // select hall to save in profile
  
    const [hall, setHall] = useState('')

    // to navigate between authentication stack
    const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
    >
        <View style={styles.inputContainer}> 
            <Text style={styles.text}>Select your hall </Text>
            <Picker
              // picker to select hall
              // appears as dropdown for android, scrolling wheel for ios
              // halls are listed as their abbreviations to save space
               style={styles.picker}
               placeholder="Select your hall"
               selectedValue={hall}
               onValueChange={(val, index) => setHall(val)}
               >
              <Picker.Item label="Temasek Hall" value="TH" />
              <Picker.Item label="Eusoff Hall" value="EH" />
              <Picker.Item label="Sheares Hall" value="SH" />
              <Picker.Item label="Kent Ridge Hall" value="KR" />
              <Picker.Item label="Prince George's Park / Lighthouse" value="LH" />
              <Picker.Item label="King Edwards XII Hall" value="KE" />
             </Picker>
    
        </View>
             
        <View style={styles.buttonContainer}>
            <TouchableOpacity
              // button that when pressed, updates user block to selected value
              // button writes "Next"
              onPress={() => {
                  try{
                    // updates document by adding hall into profile
                    const docRef = updateDoc(doc(db, "users", auth.currentUser.uid), {
                      hall: hall,
                    });
                    console.log("Document updated with hall: ", hall);
                    // next screen is to select block
                    navigation.navigate("FirstTimeSetupBlockScreen");
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }  
                }}
            
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Next</Text>
            </TouchableOpacity> 
        </View>
    </KeyboardAvoidingView>
  )
}

export default FirstTimeSetupHallScreen

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