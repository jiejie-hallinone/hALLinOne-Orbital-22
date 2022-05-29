import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

// this screen displays all the halls, and is the first page of the bookings tab
// users will choose the hall of the facility they would like to book
const BookingsScreen = () => {
  // to navigate within bookings stack
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Here we have all the halls</Text>

      <TouchableOpacity
        // button for Hall 1, which will bring users to select which block within hall 1
        onPress={() => navigation.navigate("Block")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Hall 1 </Text>
      </TouchableOpacity>
    </View>
    // other halls yet to be implemented
  )
}

export default BookingsScreen

// styles within screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})