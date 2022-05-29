import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../../Firebase/Firebase';
import { updateProfile } from 'firebase/auth';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { useNavigation } from '@react-navigation/native';

const FirstTimeSetupScreen = () => {
    // stores name
    const [name, setName] = useState('')

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
              placeholder="Name"
              value={name}
              onChangeText={text => setName(text)}
              style={styles.input}
            />
          </View>
    
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              // button that when pressed, updates user displayed name to what was input in above field
              // button writes "Set up Profile"
              onPress={() => {
                updateProfile(auth.currentUser, {
                    displayName: name
                })
                // if successful, name will be updated and logged on the console
                // user will be brought to bookings tab
                .then(() => {
                    console.log("Name updated to " + name);
                    navigation.navigate("Bookings");})
                }
              }
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Set up profile</Text>
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