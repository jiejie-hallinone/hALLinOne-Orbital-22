import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView'
import { Picker } from '@react-native-picker/picker'
import { auth, db } from '../../Firebase/Firebase';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from "firebase/firestore"; 

// users can edit their block on their profile here
const EditBlockScreen = () => {
    // to store their block
    const [block, setBlock] = useState('')

    // to navigate between authentication stack
    const navigation = useNavigation();

    return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
      >
        <View style={styles.inputContainer}> 
            <Text style={styles.text}>Select your block </Text>
              <Picker
              // picker to select block
              // appears as dropdown for android, scrolling wheel for ios
               style={styles.picker}
               placeholder="Select your block"
               // store value in state block
               selectedValue={block}
               onValueChange={(val, index) => setBlock(val)}
               >
              <Picker.Item label="A / 1" value='A' />
              <Picker.Item label="B / 2" value='B' />
              <Picker.Item label="C / 3" value='C' />
              <Picker.Item label="D / 4" value='D' />
              <Picker.Item label="E / 5" value='E' />
             </Picker>

  
               <View style={styles.buttonContainer}>
              <TouchableOpacity
                // button that when pressed, updates block into profile
                // button writes "Confirm"
                onPress={() => {
                    try{
                      // if user yet to select block
                      if (block === '') {
                        // alert user to make selection
                        alert("Please select your block!")
                      } else {
                        // updates block to corresponding document using current user's id in firestore
                        const docRef = updateDoc(doc(db, "users", auth.currentUser.uid), {
                          block: block,
                        });
                        // log successful update
                        console.log("Document updated with block: ", block);
                        // alert user on update
                        alert("Block updated")
                        // bring user back to profile page
                        navigation.navigate("Profile");
                      }
                    } catch (e) {
                      // push errors to user
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

export default EditBlockScreen

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