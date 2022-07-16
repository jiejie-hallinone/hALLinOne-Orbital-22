import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
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
          // console.log("retrieved: " + doc.id);
          const start = data.startDateTime.toDate();
          const end = data.endDateTime.toDate();
          // console.log(date.year);
          // console.log(start)
          // console.log(doc.id + " retrieved")
          // adds it to the newBookings array as a tuple - with the data and the doc id
          if (start.getDate() <= date.day && (start.getMonth() + 1) <= date.month && (start.getYear() + 1900) <= date.year 
            && end.getDate() >= date.day && (end.getMonth() + 1) >= date.month && (end.getYear() + 1900) >= date.year) {
                newBookings.push({data: data, id: doc.id});
                // console.log("added: " + doc.id)
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
    const startDate = start.getDate() + "/" + (start.getMonth() + 1) + "/" + (start.getYear() + 1900);
    const startTime = start.getHours() + 'hrs ' + start.getMinutes() + 'min';
    const starting = startDate + " " + startTime;

    // convert end Date and Time to String
    const end = item.data.endDateTime.toDate();
    const endDate = end.getDate() + "/" + (end.getMonth() + 1) + "/" + (end.getYear() + 1900);
    const endTime = end.getHours() + 'hrs ' + end.getMinutes() + 'min';
    const ending = endDate + " " + endTime;

    return (
      <View style={styles.itemContainer}>
        <Text>Booking by: {item.data.name}</Text>
        <Text>From: {starting}</Text>
        <Text>To: {ending}</Text>
      </View>
    )
  }

  // function to render the screen after all bookings retrieved i.e. load finished
  function Loaded(props) {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            style={styles.item}
            data={bookings}
            renderItem={renderList}
            keyExtractor={item => item.id}
          />
          <Text style={styles.text}>No more existing bookings</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              navigation.navigate("Book", {
                hall: hall,
                block: block,
                facility: facility,
                startDate: date,
                endDate: date,
              })
            }}
          >
            <Image source={require('../../assets/plus.png')} style={{width: 30, height: 30, tintColor: '#0782F9'}} />
          </TouchableOpacity>
        </View>

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

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    item: {
        flexDirection: 'column',
        width: '100%',
    },
    itemContainer: {
        alignItems: 'center',
        width: '100%',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        padding: 5
    },
    listContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      },
    button: {
      width: '20%',
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonContainer: {
      width: '100%',
      marginBottom: 5,
      alignItems: 'center',
      padding: 5
    },
    text: {
      marginTop: 5,
      marginBottom: 5,
    }
})