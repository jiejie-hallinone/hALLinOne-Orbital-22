import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

// this screen displays all the blocks of the hall selected from the previous page
// users will choose the block of the facility they would like to book
const BlocksScreen = ({route, navigation}) => {
  // receives the value hall from the previous screen (the hall the user selected)
  const {hall} = route.params

  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button for A block, brings the user to the next page to pick which facility
        onPress={() => {
          // passes which hall and which block was selected onto the next screen, which is to choose the facility
          navigation.navigate("Block Facilities", {hall: hall, block: 'A'})
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>A Block</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for B block, brings the user to the next page to pick which facility
        onPress={() => {
          // passes which hall and which block was selected onto the next screen, which is to choose the facility
          navigation.navigate("Block Facilities", {hall: hall, block: 'B'})
        }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>B Block</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for C block, brings the user to the next page to pick which facility
        onPress={() => {
          // passes which hall and which block was selected onto the next screen, which is to choose the facility
          navigation.navigate("Block Facilities", {hall: hall, block: 'C'})
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>C Block</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for D block, brings the user to the next page to pick which facility
        onPress={() => {
          // passes which hall and which block was selected onto the next screen, which is to choose the facility
          navigation.navigate("Block Facilities", {hall: hall, block: 'D'})
        }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>D Block</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for E block, brings the user to the next page to pick which facility
        onPress={() => {
          navigation.navigate("Block Facilities", {hall: hall, block: 'E'})
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>E Block</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button for common facilities, brings the user to the next page to pick which common facility
        onPress={() => {
          // passes which hall and which block was selected onto the next screen, which is to choose the facility
          navigation.navigate("Common Facilities", {hall: hall, block: 'F'})
        }}
        style={styles.button2}
      >
        <Text style={styles.buttonText}>Common Facilities</Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  button2: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 20,
  },
})