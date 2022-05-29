import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { auth } from '../../Firebase/Firebase';

const ProfileScreen = () => {
  const user = auth.currentUser
  const email = user?.email;
  const name = user?.displayName;
  return (
    <View style={styles.container}>
      <Text>Email: {email}</Text>
      <Text>Name: {name}</Text>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
})