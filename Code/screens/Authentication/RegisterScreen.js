import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { auth } from '../../Firebase/Firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const RegisterScreen = () => {
    // stores email, password, and confirmed password (a retype of password)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')

    // function that creates an account for the app and firebase
    // if successful, console will show registered, with the user email
    // else, an alert will be pushed to the user
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log("Registered " + user.email);
        })
        .catch(error => alert(error.message))
    } 

    // to navigate within authentication stack
    const navigation = useNavigation()
    
    // to bring users to screen to fill in further details to set up profile after signing up
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                navigation.navigate("FirstTimeSetupScreen");
            }
        })

        return unsub
    }, [])

    return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <TextInput
          // input field for email
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          // input field for password
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />   
        <TextInput
          // input field to retype password
          placeholder="Confirm Password"
          value={confirmpassword}
          onChangeText={text => setConfirmPassword(text)}
          style={styles.input}
          secureTextEntry
        /> 
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          // register button to create a new account
          onPress={() => {
            // if password and retyped password match, create account
            if (password === confirmpassword) {
                handleSignUp();
            } else {
                // alert users that passwords do not match and users have to retype the password
                alert("Passwords do not match!")
            }
          }}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity> 
      </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

// styles used within screen
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
    alignItems: 'center'
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