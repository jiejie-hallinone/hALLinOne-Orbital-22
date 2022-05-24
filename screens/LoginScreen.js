import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LoginScreen = () => {
  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
    >
      <View style ={styles.inputContainer}>
        <TextInput 
          placeholders="Email"
          // value={ }
          // onChangeText={text => }
          style={styles.input}
          secureTextEntry
        />

      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})