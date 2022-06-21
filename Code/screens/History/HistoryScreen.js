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
    const q = await query(collection(db, "bookings"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    await querySnapshot.forEach(doc => {
      let data = doc.data()
      console.log(doc.id + " retrieved")
      newBookings.push({data: data, id: doc.id});
    })

    return {newBookings};
  }
  
  /*
  useEffect(() => {
    setBookings(getBookings());
  }, [])
  */
  // const [bookings, setBookings] = useState(getBookings());
  // console.log(bookings)

  return (
    <View
      style={styles.container}
    >
      <FlatList
        style={styles.item}
        data={getBookings()}
        renderItem={({item}) => (
          <Text style={styles.text}>test</Text>
        )}
        keyExtractor={item => item.id}
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
  }
})