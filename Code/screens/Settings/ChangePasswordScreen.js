import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { auth } from '../../Firebase/Firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

// page for user to change their password
const ChangePasswordScreen = () => {
    // stores email, password, and confirmed password (a retype of password)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmpassword, setConfirmPassword] = useState('')

    // to navigate within settings stack
    const navigation = useNavigation()

    return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <TextInput
          // input field for current password
          // shows "Current Password" when empty
          placeholder="Current Password"
          // stores value in state currentPassword
          value={currentPassword}
          onChangeText={text => setCurrentPassword(text)}
          style={styles.input}
          // makes text invisible and case sensitive
          secureTextEntry
        />
        <TextInput
          // input field for new password
          // shows "New Password" when empty
          placeholder="New Password"
          // stores value in state newPassword
          value={newPassword}
          onChangeText={text => setNewPassword(text)}
          style={styles.input}
          // makes text invisible and case sensitive
          secureTextEntry
        />   
        <TextInput
          // input field to retype new password
          // shows "Confirm New Password" when empty
          placeholder="Confirm New Password"
          // stores value in state confirmpassword
          value={confirmpassword}
          onChangeText={text => setConfirmPassword(text)}
          style={styles.input}
          // makes text invisible and case sensitive
          secureTextEntry
        /> 
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          // register button to create a new account
          onPress={() => {
            // if password and retyped password match
            if (newPassword === confirmpassword) {
                // reauthenticate the current user with firebase
                const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
                reauthenticateWithCredential(auth.currentUser, cred)
                .then(() => {
                    // change the user password to the new password in firebase
                    updatePassword(auth.currentUser, newPassword);
                    // alert the user on successful change
                    alert("Password changed!")
                    // bring the user back to the profile page
                    navigation.navigate("Profile")
                })
                // push errors to the user
                .catch(err => alert("Error updating password: " + err))
            } else {
                // alert users that passwords do not match and users have to retype the password
                alert("Passwords do not match!")
            }
          }}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Update Password</Text>
        </TouchableOpacity> 
      </View>
    </KeyboardAvoidingView>
  )
}

export default ChangePasswordScreen

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
    width: '70%',
    padding: 5,
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