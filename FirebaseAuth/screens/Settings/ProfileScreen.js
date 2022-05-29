import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { auth } from '../../Firebase/Firebase';

// users will be brought here if profile is selected from settings 
// users can view and edit their profile information
const ProfileScreen = () => {
  // obtain user information from firebase
  const user = auth.currentUser
  const email = user?.email;
  const name = user?.displayName;
  
  return (
    // user email and name displayed. edit function and other profile fields yet to be implemented
    <View style={styles.container}>
      <Text>Email: {email}</Text>
      <Text>Name: {name}</Text>
    </View>
  )
}

export default ProfileScreen

// styles used within screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})