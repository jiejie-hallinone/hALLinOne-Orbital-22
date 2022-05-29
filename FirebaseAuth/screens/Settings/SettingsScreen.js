import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { auth } from '../../Firebase/Firebase';

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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.prof}
      >
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  prof: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'red',
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})