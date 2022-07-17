import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { auth } from '../../Firebase/Firebase';

// this screen displays a menu of the settings the users can select to customise their application
const SettingsScreen = () => {
  // to navigate within settings stack
  const navigation = useNavigation();

  // to sign user out of app and firebase
  // if successful, console will display signed out and user will be brought back to the login page
  // else, the user will be notified of the error
  const handleSignOut = () => {
    signOut(auth)
    .then(() => {
      console.log("Signed out");
      navigation.navigate("Login");
    })
    .catch(error => alert(error.message))
  } 

  return (
    <View style={styles.container}>
      <TouchableOpacity
        // button to bring the user to view and edit their profile
        onPress={() => navigation.navigate("Profile")}
        style={styles.prof}
      >
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        // button to sign the user out of app and firebase
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.SObuttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SettingsScreen

// styles used within screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  prof: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#ff6961',
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
  },
  SObuttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})