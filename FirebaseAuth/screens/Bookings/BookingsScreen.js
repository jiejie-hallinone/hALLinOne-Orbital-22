import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const BookingsScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Here we have all the halls</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("Block")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Hall 1 </Text>
      </TouchableOpacity>
    </View>
  )
}

export default BookingsScreen

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