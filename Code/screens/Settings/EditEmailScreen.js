import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from "firebase/firestore"; 



const EditEmailScreen = () => {
    // stores name
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
              // input field to type user's desired display name, which is stored as name
              placeholder="New Email"
              value={email}
              onChangeText={text => setEmail(text)}
              style={styles.input}
            />
            <TextInput
              // input field to type user's desired display name, which is stored as name
              placeholder="Current Password"
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
    
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              // button that when pressed, updates user displayed name to what was input in above field
              // button writes "Next"
              onPress={() => {
                if (email === '') {
                    alert("Please fill in your name!")
                } else {
                    const cred = EmailAuthProvider.credential(auth.currentUser.email, password);
                    reauthenticateWithCredential(auth.currentUser, cred)
                    .then(() => {
                        updateEmail(auth.currentUser, email)
                        .then(async () => {
                            const docRef = await updateDoc(doc(db, "users", auth.currentUser.uid), {
                                email: email
                            });
                            console.log("email updated with: " + email)
                            alert("Email updated!")
                            navigation.navigate("Profile");
                        })
                        .catch(err => alert("Error updating email: " + err))
                    })
                }
              }
            }
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Change Email</Text>
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