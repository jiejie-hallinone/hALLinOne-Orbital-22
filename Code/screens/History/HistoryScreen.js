import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth, db } from '../../Firebase/Firebase';
import { doc, getDocs, collection, query, where } from "firebase/firestore";

// amend to be set to id of chosen booking to amend, and exported for amend screen, currently set to a fixed doc
var amend = "MAS63OBynxCpskjhOVHn";

// here the existing bookings made by the user will be shown
const HistoryScreen = () => {
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;

  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  
  // gets the bookings from firestore made by current user, with end date and time after the current date and time
  const getBookings = async () => {
    // to store data
    const newBookings = new Array();
    // queries under bookings those bookings in firestore made by the user that has not expired yet
    const q = query(collection(db, "bookings"), where("uid", "==", uid), where("endDateTime", ">=", new Date()));
    // retrieves the documents
    const querySnapshot = await getDocs(q);
    // for each document
    await querySnapshot.forEach(doc => {
      // retrieves document data (name, hall, time etc)
      let data = doc.data()
      console.log(doc.id + " retrieved")
      // adds it to the newBookings array as a tuple - with the data and the doc id
      newBookings.push({data: data, id: doc.id});
    })
    setLoading(false);

    return {newBookings};
  }
  
  
  // to get the bookings and set to the state bookings but only occurs after rendering
  const [bookings, setBookings] = useState(getBookings());
  /*
  useEffect(() => {
    setBookings(getBookings());
  }, [])
  */  
  
  // for error checking
  // initially, will log an empty promise (ie data not retrieved)
  // only after refreshing app then the booking data will be shown - but not rendered
  console.log(bookings)

  return (
    <View
      style={styles.container}
    >
      <FlatList
        style={styles.item}
        data={bookings}
        renderItem={({item}) => (
          <Text style={styles.text}>test</Text>
        )}
        keyExtractor={item => item.id}
      />

      <TouchableOpacity
      // button to amend booking
          onPress={() => {
            navigation.navigate("Amend")
          }}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Amend</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HistoryScreen

export {amend};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    bordercolor: 'red',
    borderWidth: 2
  },
  item: {
    width: '100%',
    backgroundColor: 'pink',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: 700,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '30%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
})