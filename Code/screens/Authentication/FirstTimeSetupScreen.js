import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { updateProfile } from 'firebase/auth';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc } from "firebase/firestore"; 
import {Picker} from '@react-native-picker/picker';



const FirstTimeSetupScreen = () => {
    // stores name
    const [name, setName] = useState('')
    const [hall, setHall] = useState('')
    const [block, setBlock] = useState('')
    const [level, setLevel] = useState('')

    // to navigate between authentication stack
    const navigation = useNavigation();
    return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
        >
          <View style={styles.inputContainer}> 
            <TextInput
              // input field to type user's desired display name, which is stored as name
              placeholder="Name"
              value={name}
              onChangeText={text => setName(text)}
              style={styles.input}
            />
          </View>

          <View style={styles.pickerContainer} >
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

             <Picker
               style={styles.picker}
               placeholder="Select your block"
               selectedValue={block}
               onValueChange={(val, index) => setBlock(val)}
               >
              <Picker.Item label="A / 1" value='A' />
              <Picker.Item label="B / 2" value='B' />
              <Picker.Item label="C / 3" value='C' />
              <Picker.Item label="D / 4" value='D' />
              <Picker.Item label="E / 5" value='E' />
             </Picker>

             <Picker
               style={styles.picker}
               placeholder="Select your level"
               selectedValue={level}
               onValueChange={(val, index) => setLevel(val)}
               >
              <Picker.Item label="1" value='1' />
              <Picker.Item label="2" value='2' />
              <Picker.Item label="3" value='3' />
              <Picker.Item label="4" value='4' />
              <Picker.Item label="5" value='5' />
              <Picker.Item label="6" value='6' />
              <Picker.Item label="7" value='7' />
              <Picker.Item label="8" value='8' />
             </Picker>
          </View>
    
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
        </KeyboardAvoidingView>
      )
    }
    
    export default FirstTimeSetupScreen
    
    // styles of elements in screen
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      inputContainer: {
        width: '80%'
      },
      input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
      },
      buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
      },
      button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
      },
      buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2,
      },
      buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
      },
      buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16,
      },
      pickerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%'
      },
      picker: {
        width: '100%',
        borderRadius: 10,
        marginTop: 5,
        borderWidth: 2,
        borderColor: '#0782F9',
      }
    })