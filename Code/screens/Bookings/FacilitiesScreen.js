import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'

// this screen displays all the facilities of the block selected from the previous page
// users will choose the facility they would like to book
const FacilitiesScreen = ({route, navigation}) => {

  const {hall, block} = route.params;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button to select Lounge, brings user to page to book the lounge when pressed
        onPress={() => {
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'L'
          })
        }}
        style={styles.button}
      >
        <Image source={require('../../assets/facilities/lounge.png')} style={{width: 70, height: 70, marginBottom: 5}} />
        <Text style={styles.buttonText}>Lounge</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Washing Machine, brings user to page to book the lounge when pressed
        onPress={() => {
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'W'
          })
        }}
        style={styles.button2}
      >
        <Image source={require('../../assets/facilities/washingmachine.png')} style={{width: 70, height: 70, marginBottom: 5}} />
        <Text style={styles.buttonText}>Washing Machine</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Dryer, brings user to page to book the lounge when pressed
        onPress={() => {
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'D'
          })
        }}
        style={styles.button}
      >
        <Image source={require('../../assets/facilities/dryer.png')} style={{width: 70, height: 70, marginBottom: 5}} />
        <Text style={styles.buttonText}>Dryer</Text>
      </TouchableOpacity>
    </View>
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
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  button2: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 10,
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