import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
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
      // console.log(doc.id + " retrieved")
      // adds it to the newBookings array as a tuple - with the data and the doc id
      newBookings.push({data: data, id: doc.id});
    })
    setLoading(false);

    setBookings(newBookings);
  }
  
  
  // to get the bookings and set to the state bookings but only occurs after rendering
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    getBookings();
  }, [])

  function Loaded(props) {
    return (
      <View style={styles.listContainer}>
        
        <FlatList
          style={styles.item}
          data={bookings}
          renderItem={({item}) => (
            <Text style={styles.text}>{item.data.hall}</Text>
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

  return (
    <View
      style={styles.container}
    >
   {loading 
    ? <ActivityIndicator 
        size="large"
        color="black"
      />
    : <Loaded />
    }     

    </View>
  )
}

export default HistoryScreen

export {amend};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  item: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
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
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
})