import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
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

    /**
     * function that handles the creation of a new user account in firebase auth
     */
    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
        // logs the user email in the console to confirm confirmation (user does not see anything on his end)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log("Registered " + user.email);
        })
        // pushes any error encountered to the user in an alert
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
      <Image source={require('../../assets/hALLinOne.png')} style={{width: 320, height: 320, resizeMode: "contain"}} />
      <View style={styles.inputContainer}>
        <TextInput
          // input field for email
          placeholder="Email"
          value={email}
          // sets any text input as the value email when text changes
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          // input field for password
          placeholder="Password"
          value={password}
          // sets any text input as the value password when text changes
          onChangeText={text => setPassword(text)}
          style={styles.input}
          // ensures that the input is not shown and case sensitive
          secureTextEntry
        />   
        <TextInput
          // input field to retype password
          placeholder="Confirm Password"
          value={confirmpassword}
          // sets any text input as the value confirmpassword when text changes
          onChangeText={text => setConfirmPassword(text)}
          style={styles.input}
          // ensures that the input is not shown and case sensitive
          secureTextEntry
        /> 
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          // register button to create a new account
          onPress={() => {
            // if password and retyped password match, create account
            if (email && password && confirmpassword && password === confirmpassword) {
                handleSignUp();
            } else if (email && password && confirmpassword) {
                // alert users that passwords do not match and users have to retype the password
                alert("Passwords do not match!")
            } else {
              // alert users that not all fields input
              alert("Please input all fields!")
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
    marginTop: 10,
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
    backgroundColor: '#EF7C00',
    marginTop: 5,

  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})