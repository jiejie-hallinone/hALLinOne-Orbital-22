import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

// to be exported for bookings to be made later on
var block;

// this screen displays all the blocks of the hall selected from the previous page
// users will choose the block of the facility they would like to book
const BlocksScreen = () => {
  // to navigate within bookings stack
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button for A block, brings the user to the next page to pick which facility
        onPress={() => {
          block = 'A'
          navigation.navigate("Block Facilities")
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>A Block / Block 1</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for B block, brings the user to the next page to pick which facility
        onPress={() => {
          block = 'B'
          navigation.navigate("Block Facilities")
        }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>B Block / Block 2</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for C block, brings the user to the next page to pick which facility
        onPress={() => {
          block = 'C'
          navigation.navigate("Block Facilities")
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>C Block / Block 3</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for D block, brings the user to the next page to pick which facility
        onPress={() => {
          block = 'D'
          navigation.navigate("Block Facilities")
        }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>D Block / Block 4</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for E block, brings the user to the next page to pick which facility
        onPress={() => {
          block = 'E'
          navigation.navigate("Block Facilities")
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>E Block / Block 5</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for common facilities, brings the user to the next page to pick which common facility
        onPress={() => {
          block = 'F'
          navigation.navigate("Common Facilities")
        }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>Common Facilities</Text>
      </TouchableOpacity>
    </View>
  )
}

export default BlocksScreen
export {block}

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