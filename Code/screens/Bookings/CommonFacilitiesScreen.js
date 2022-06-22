import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

// this screen displays all the facilities of the block selected from the previous page
// users will choose the facility they would like to book
const CommonFacilitiesScreen = ({route, navigation}) => {
  const {hall, block} = route.params;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button to select Comm Hall, brings user to page to book the lounge when pressed
        onPress={() => {
            navigation.navigate("Book", {
              hall: hall,
              block: block,
              facility: 'C'
            })
          }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Communal Hall</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to check existing bookings for Comm Hall, brings user to page to existing bookings page
        onPress={() => {
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'C'
          })
        }}
        style={styles.ebButton}
      >
        <Text style={styles.ebbuttonText}>Check Existing Bookings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Basketball Court, brings user to page to book the lounge when pressed
        onPress={() => {
            navigation.navigate("Book", {
              hall: hall,
              block: block,
              facility: 'B'
            })
          }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>Basketball Court</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to check existing bookings for BBall Court, brings user to page to existing bookings page
        onPress={() => {
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'C'
          })
        }}
        style={styles.ebButton}
      >
        <Text style={styles.ebbuttonText}>Check Existing Bookings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Squash Court, brings user to page to book the lounge when pressed
        onPress={() => {
            navigation.navigate("Book", {
              hall: hall,
              block: block,
              facility: 'S'
            })
          }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Squash Court</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to check existing bookings for Squash Courts, brings user to page to existing bookings page
        onPress={() => {
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'S'
          })
        }}
        style={styles.ebButton}
      >
        <Text style={styles.ebbuttonText}>Check Existing Bookings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Band Room, brings user to page to book the lounge when pressed
        onPress={() => {
            navigation.navigate("Book", {
              hall: hall,
              block: block,
              facility: 'M'
            })
          }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>Band / Music Room</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to check existing bookings for Band Rm, brings user to page to existing bookings page
        onPress={() => {
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'M'
          })
        }}
        style={styles.ebButton}
      >
        <Text style={styles.ebbuttonText}>Check Existing Bookings</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CommonFacilitiesScreen

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
  ebButton: {
    backgroundColor: 'red',
    width: '60%',
    borderRadius: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    marginTop: 2,
  },
  ebbuttonText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 16,
  },
})