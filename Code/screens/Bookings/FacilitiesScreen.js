import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

// this screen displays all the facilities of the block selected from the previous page
// users will choose the facility they would like to book
const FacilitiesScreen = () => {
  // to navigate within bookings stack
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Here we have all the Facilities of the selected block in selected hall</Text>

      <TouchableOpacity
        // button to select Lounge, brings user to page to book the lounge when pressed
        onPress={() => navigation.navigate("Book")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Lounge</Text>
      </TouchableOpacity>
    </View>
    // other facilities yet to be implemented
  )
}

export default FacilitiesScreen

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