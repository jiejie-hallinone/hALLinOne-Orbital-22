/*

OBSELETE: KEPT FOR REFERENCE
google calendar no longer part of application

import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../Firebase/Firebase';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView';
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc } from "firebase/firestore"; 
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const GoogleSetupScreen = () => {

    // to navigate between authentication stack
    const navigation = useNavigation();

    var accessToken;

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: "6235167999-bcra9l8kthnbj93dmvs8d63s7erjmc0i.apps.googleusercontent.com",
        iosClientId: "6235167999-pu3nqegtoohkb1fnuihc88fa6cartfct.apps.googleusercontent.com",
        expoClientId: "6235167999-stieei8kqdl62ltt6km6rtilf4pvr7ev.apps.googleusercontent.com",
        scopes: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/calendar.events'],
        useProxy: true
    })

    const insertEvent = async () => {
      let calendar = await fetch('https://www.googleapis.com/calendar/v3/users/me', {
        headers: { Authorization: `Bearer ${accessToken}`},
      }); 
      calendar?.events.insert({
        calendarId: 'primary',
        resource: {
          'summary': 'test',
          'location': 'test',
          'description': 'test',
          'start': Date(),
          'end': Date()
        }
      })
      console.log("inserted event")
    }

    useEffect(() => {
        if (response?.type === 'success') {
            // console.log("success")
            accessToken = response.authentication.accessToken;
            // console.log(accessToken)
            // updates document by adding linked into profile
            const docRef = updateDoc(doc(db, "users", auth.currentUser.uid), {
              accessToken: accessToken ? accessToken : "",
            });
            console.log("updated: " + accessToken);
            insertEvent();
            console.log("inserted")
            navigation.navigate("AfterLogin");
        }
    }, [response]);

    return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
        >
           <View style={styles.buttonContainer}>
          <TouchableOpacity
            // button that when pressed, brings user to sign in to gmail for Google Calendar
            onPress={() => {
              try{
                  promptAsync({
                    showInRecents: true,
                  })
              } catch (e) {
                console.error("Error adding document: ", e);
              }  
            }
          }
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Link to Google Calendar</Text>
          </TouchableOpacity> 

          <TouchableOpacity
            // button that when pressed, finishes setup without linking
            onPress={() => {
              try{
                  // updates document by adding unlinked into profile
                  const docRef = updateDoc(doc(db, "users", auth.currentUser.uid), {
                      accessToken: ""
                  });
                  // finish set up
                  navigation.navigate("AfterLogin");
              } catch (e) {
                console.error("Error adding document: ", e);
              }  
            }
          }
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Skip</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      )
    }
    
    export default GoogleSetupScreen
    
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
    })
*/