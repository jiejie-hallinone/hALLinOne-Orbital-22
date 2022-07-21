import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'

// this screen displays all the facilities of the block selected from the previous page
// users will choose the facility they would like to book
const FacilitiesScreen = ({route, navigation}) => {

  const {hall, block} = route.params;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button to select Lounge, brings user to select date when pressed
        onPress={() => {
          // brings user to select date, with the hall, block and facility selected
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'L'
          })
        }}
        style={styles.button}
      >
        <Image source={require('../../assets/facilities/lounge.png')} style={{width: 70, height: 70, marginRight: 10}} />
        <Text style={styles.buttonText}>Lounge</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Washing Machine, brings user to select date when pressed
        onPress={() => {
          // brings user to select date, with the hall, block and facility selected
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'W'
          })
        }}
        style={styles.button2}
      >
        <Image source={require('../../assets/facilities/washingmachine.png')} style={{width: 70, height: 70}} />
        <Text style={styles.buttonText}>Washing Machine</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to select Dryer, brings user to select date when pressed
        onPress={() => {
          // brings user to select date, with the hall, block and facility selected
          navigation.navigate("Date", {
            hall: hall,
            block: block,
            facility: 'D'
          })
        }}
        style={styles.button}
      >
        <Image source={require('../../assets/facilities/dryer.png')} style={{width: 70, height: 70,}} />
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
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button2: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 20,
  },
})