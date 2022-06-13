import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

// to be exported for bookings to be made later on
var fac

// this screen displays all the facilities of the block selected from the previous page
// users will choose the facility they would like to book
const FacilitiesScreen = () => {
  // to navigate within bookings stack
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button to select Lounge, brings user to page to book the lounge when pressed
        onPress={() => {
          fac = 'L'
          navigation.navigate("Book")
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Lounge</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Washing Machine, brings user to page to book the lounge when pressed
        onPress={() => {
          fac = 'W'
          navigation.navigate("Book")
        }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>Washing Machine</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Dryer, brings user to page to book the lounge when pressed
        onPress={() => {
          fac = 'D'
          navigation.navigate("Book")
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Dryer</Text>
      </TouchableOpacity>
    </View>
  )
}

export default FacilitiesScreen

export {fac}

// styles used within screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  button2: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
})