import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react'
import { db } from '../../Firebase/Firebase';
import { getDocs, collection, query, where } from "firebase/firestore";

const ExistingBookingsOnDayScreen = ({route, navigation}) => {
    const {hall, block, facility, date, reload} = route.params;
    const [bookings, setBookings] = useState();
    const [loading, setLoading] = useState(reload);

    const getBookings = async () => {
        // to store data
        const newBookings = new Array();
        // queries under bookings those bookings in firestore made by the user that has not expired yet
        const q = query(collection(db, "bookings"), 
            where("hall", "==", hall), 
            where("block", "==", block), 
            where("facility", "==", facility));
            // where("startDateTime", "<=", date));
            // where("endDateTime", ">=", date));
        // retrieves the documents
        const querySnapshot = await getDocs(q);
        // for each document
        await querySnapshot.forEach(doc => {
          // retrieves document data (name, hall, time etc)
          let data = doc.data()
          console.log("retrieved: " + doc.id);
          const start = data.startDateTime.toDate();
          const end = data.endDateTime.toDate();
          // console.log(date.year);
          // console.log(doc.id + " retrieved")
          // adds it to the newBookings array as a tuple - with the data and the doc id
          if (start.getDate() <= date.day && (start.getMonth() + 1) <= date.month && (start.getYear() + 1900) <= date.year 
            && end.getDate() >= date.day && (end.getMonth() + 1) >= date.month && (end.getYear() + 1900) >= date.year) {
                newBookings.push({data: data, id: doc.id});
                console.log("added: " + doc.id)
          }
          
        })

        setLoading(false);
    
        setBookings(newBookings);
        // console.log(bookings);
      }

      useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
          getBookings();
        });
      }, [navigation])

    // function to render each item in flatList (each booking)
    function renderList({item}) {
    // convert start Date and Time to String
    const start = item.data.startDateTime.toDate();
    const startDate = start.getDate() + "/" + (start.getMonth() + 1) + "/" + start.getYear();
    const startTime = start.getHours() + 'hrs ' + start.getMinutes() + 'min';
    const starting = startDate + " " + startTime;

    // convert end Date and Time to String
    const end = item.data.endDateTime.toDate();
    const endDate = end.getDate() + "/" + (end.getMonth() + 1) + "/" + end.getYear();
    const endTime = end.getHours() + 'hrs ' + end.getMinutes() + 'min';
    const ending = endDate + " " + endTime;

    return (
      <View>
        <Text>Booking by: {item.data.name}</Text>
        <Text>From: {starting}</Text>
        <Text>To: {ending}</Text>
      </View>
    )
  }

  // function to render the screen after all bookings retrieved i.e. load finished
  function Loaded(props) {
    return (
      <View style={styles.listContainer}>
        
        <FlatList
          style={styles.item}
          data={bookings}
          renderItem={renderList}
          keyExtractor={item => item.id}
        />
  
      </View>
    )
  }

  // if all bookings yet to retrieve, a loading wheel will be shown
  // else, the list of bookings will be rendered
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

export default ExistingBookingsOnDayScreen

const styles = StyleSheet.create({})