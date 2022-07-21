import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from "firebase/firestore"; 


// here users can edit their email on their profile
const EditEmailScreen = () => {
    // stores email and password
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // to navigate between authentication stack
    const navigation = useNavigation();
    
    return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
        >
          <View style={styles.inputContainer}> 
            <TextInput
              // input field to type user's desired new email
              placeholder="New Email"
              // stores input as state email
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              // input field to type user's password, which is stored as password
              placeholder="Current Password"
              // stores input as state password
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              // makes input invisible and case sensitive
              secureTextEntry
            />
          </View>
    
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              // button that when pressed, updates user email to what was input in above field
              // button writes "Confirm"
              onPress={() => {
                // if email not input
                if (email === '') {
                    // user alerted to input
                    alert("Please fill in your email!")
                } else {
                    // reauthenticate user with firebase
                    const cred = EmailAuthProvider.credential(auth.currentUser.email, password);
                    reauthenticateWithCredential(auth.currentUser, cred)
                    .then(() => {
                        // update the user's email in firebase
                        updateEmail(auth.currentUser, email)
                        .then(async () => {
                            // update the user's email in firestore
                            const docRef = await updateDoc(doc(db, "users", auth.currentUser.uid), {
                                email: email
                            });
                            // log successful update
                            console.log("email updated with: " + email)
                            // alert user on successful update
                            alert("Email updated!")
                            // bring user back to profile
                            navigation.navigate("Profile");
                        })
                        // push any errors to the user
                        .catch(err => alert("Error updating email: " + err))
                    })
                }
              }
            }
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Confirm</Text>
            </TouchableOpacity> 
          </View>
        </KeyboardAvoidingView>
      )
    }
    
    export default EditEmailScreen
    
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