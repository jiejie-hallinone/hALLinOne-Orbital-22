import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { updateProfile } from 'firebase/auth';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from "firebase/firestore"; 



const FirstTimeSetupScreen = () => {

    // to navigate between authentication stack
    const navigation = useNavigation();
    return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              // button that when pressed, updates user displayed name to what was input in above field
              // button writes "Next"
              onPress={() => {
                updateProfile(auth.currentUser, {
                    displayName: name
                })
                // if successful, name and email will be created on Firestore
                .then(() => {
                  try{
                    if (name === '') {
                      alert("Please fill in your name!")
                    } else {
                      // creates document with name and email in Firestore collection users, using key id as document name
                      const docRef = setDoc(doc(db, "users", auth.currentUser.uid), {
                        name: name,
                        email: auth.currentUser.email,
                      });
                      console.log("Document written with email: ", auth.currentUser.email);
                      // bring to next page to select hall
                      navigation.navigate("FirstTimeSetupHallScreen");
                    }
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }  
                })
              }
            }
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Next</Text>
            </TouchableOpacity> 
          </View>
        </KeyboardAvoidingView>
      )
    }
    
    export default FirstTimeSetupScreen
    
    // styles of elements in screen
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      inputContainer: {
        width: '80%'
      },
      input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
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
    })