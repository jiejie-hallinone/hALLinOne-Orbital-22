import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { auth } from '../../Firebase/Firebase';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
  // stores email and password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // function that signs in the user to the app (and firebase)
  // if successful, console will display logged in and the email
  // else, an alert will be pushed to the user
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      console.log("Logged in " + user.email);
    })
    .catch(error => alert(error.message))
    
  }

  // to navigate within Authentication stack
  const navigation = useNavigation()
  // if log in successful, bring to the bookings tab. Only done once per log in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        navigation.replace("AfterLogin");
      }
    })

    return unsub
  }, [])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <Image source={require('../../assets/hALLinOne.png')} style={{width: 320, height: 320, }} />
      <View style={styles.inputContainer}>
        <TextInput
          // input field for email to log in
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          // input field for password to log in
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity 
          style={styles.pw}
          onPress={() => {
            if (email) {
              sendPasswordResetEmail(auth, email)
              .then(() => alert("Password reset email sent!"))
              .catch(err => alert("Error sending reset email: " + err))
            } else {
              alert("Fill in email!")
            }
          }}
        >
          <Text style={styles.pwText}>Forgot Password</Text>
        </TouchableOpacity>   
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          // login button that logs the user into app and firebase when pressed
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>  

        <TouchableOpacity
          // button that brings the user to the page to register a new user
          onPress={() => navigation.navigate("Register")}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity> 
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

// styles used within screen
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    borderColor: '#d3d3d3',
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
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
  pw: {
    marginTop: 5,
    alignItems: 'center',
    width: '40%',
  },
  pwText: {
    color: '#a9a9a9'
  }
})