import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView'
import { Picker } from '@react-native-picker/picker'

const FirstTimeSetupHallScreen = () => {
  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
    >
      <View style={styles.inputContainer}> 
            <Text>Select your hall </Text>
            <Picker
               style={styles.picker}
               placeholder="Select your hall"
               selectedValue={hall}
               onValueChange={(val, index) => setHall(val)}
               >
              <Picker.Item label="Temasek Hall" value="TH" />
              <Picker.Item label="Eusoff Hall" value="EH" />
              <Picker.Item label="Sheares Hall" value="SH" />
              <Picker.Item label="Kent Ridge Hall" value="KR" />
              <Picker.Item label="Prince George's Park / Lighthouse" value="LH" />
              <Picker.Item label="King Edwards XII Hall" value="KE" />
             </Picker>

             <View style={styles.buttonContainer}>
            <TouchableOpacity
              // button that when pressed, updates user displayed name to what was input in above field
              // button writes "Set up Profile"
              onPress={() => {
                updateProfile(auth.currentUser, {
                    displayName: name
                })
                // if successful, name will be updated and logged on the console
                // user will be brought to bookings tab
                .then(() => {
                  try{
                    const docRef = setDoc(doc(db, "users", auth.currentUser.uid), {
                      name: name,
                      email: auth.currentUser.email,
                      hall: hall,
                      block: block,
                      level: level
                    });
                    console.log("Document written with email: ", auth.currentUser.email);
                    navigation.navigate("Bookings");
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }  
                })
              }
            }
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Set up profile</Text>
            </TouchableOpacity> 
            </View>
            
     </View>
    </KeyboardAvoidingView>
  )
}

export default FirstTimeSetupHallScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
})