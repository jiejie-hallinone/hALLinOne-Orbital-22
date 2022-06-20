import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { auth, db } from '../../Firebase/Firebase';
import { doc, getDocs, collection, query, where } from "firebase/firestore";


// here the existing bookings made by the user will be shown
const HistoryScreen = () => {
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;
  // gets the bookings from firestore made by current user, with end date and time after the current date and time
  const getBookings = async () => {
    const newBookings = new Array();
    const q = query(collection(db, "bookings"), where("uid", "==", uid), where("endDateTime", ">=", new Date()));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      let data = doc.data()
      console.log(doc.id + " retrieved")
      newBookings.push(data);
    })

    return {newBookings};
  }

  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    setBookings(getBookings());
  }, []);

  // to render the list of bookings into individual buttons
  const renderList = (data) => {
    return (
      <View style={styles.list}>
        
          <Text>{data.hall}</Text>
        
      </View>
    );
  };

  return (
    <View>
      <FlatList
      style={styles.list}
      data={bookings}
      renderItem={renderList}
      keyExtractor={(item, index) => index}
    />
    </View>
  )
}

export default HistoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    bordercolor: 'red',
    
  },
  list: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 10,
    marginBottom: 20,
    borderColor: 'red',
  }, 
  bookingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    borderColor: 'red'
  }
})