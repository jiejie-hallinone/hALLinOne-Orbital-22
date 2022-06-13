import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

// to be exported for bookings to be made later on
var commonfac;

// this screen displays all the facilities of the block selected from the previous page
// users will choose the facility they would like to book
const CommonFacilitiesScreen = () => {
  // to navigate within bookings stack
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button to select Comm Hall, brings user to page to book the lounge when pressed
        onPress={() => {
            commonfac = 'C'
            navigation.navigate("Book")
          }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Communal Hall</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Basketball Court, brings user to page to book the lounge when pressed
        onPress={() => {
            commonfac = 'B'
            navigation.navigate("Book")
          }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>Basketball Court</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Squash Court, brings user to page to book the lounge when pressed
        onPress={() => {
            commonfac = 'S'
            navigation.navigate("Book")
          }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Squash Court</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Band Room, brings user to page to book the lounge when pressed
        onPress={() => {
            commonfac = 'M'
            navigation.navigate("Book")
          }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>Band / Music Room</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CommonFacilitiesScreen
export {commonfac}

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