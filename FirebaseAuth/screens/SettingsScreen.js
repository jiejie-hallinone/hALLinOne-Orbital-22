import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { auth } from '../Firebase/Firebase';

const SettingsScreen = () => {

  const navigation = useNavigation();
  const handleSignOut = () => {
    signOut(auth)
    .then(() => {
      console.log("Signed out");
      navigation.navigate("Login");
    })
    .catch(error => alert(error.message))
  }

  const user = auth.currentUser
  const email = user?.email;

  return (
    <View style={styles.container}>
      <Text>Email: {email}</Text>

      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out </Text>
      </TouchableOpacity>
    </View>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})