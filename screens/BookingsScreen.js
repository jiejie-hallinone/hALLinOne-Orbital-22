import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const BookingsScreen = () => {
  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
    >
      <Text>Bookings Screen</Text>
    </KeyboardAvoidingView>
  )
}

export default BookingsScreen

const styles = StyleSheet.create({})