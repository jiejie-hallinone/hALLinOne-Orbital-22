import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

// this screen displays all the blocks of the hall selected from the previous page
// users will choose the block of the facility they would like to book
const BlocksScreen = () => {
  // to navigate within bookings stack
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Here we have all the blocks of hall selected</Text>

      <TouchableOpacity
        // button for A block, brings the user to the next page to pick which facility
        onPress={() => navigation.navigate("Facilities")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>A Block </Text>
      </TouchableOpacity>
    </View>
    // yet to implement other blocks
  )
}

export default BlocksScreen

// styles used within screen
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