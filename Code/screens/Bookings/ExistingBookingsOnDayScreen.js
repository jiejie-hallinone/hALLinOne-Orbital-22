import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import { db } from '../../Firebase/Firebase';
import { getDocs, collection, query, where } from "firebase/firestore";

// users are brought here after selecting a date
// this page shows the existing bookings made by users for that specific facility 
// users can also navigate to the book screen from here
const ExistingBookingsOnDayScreen = ({route, navigation}) => {
    // receives hall, block, facility and date selected from previous screen
    // reload triggers the page to show the loading screen
    const {hall, block, facility, date, reload} = route.params;

    // state to store existing bookings
    const [bookings, setBookings] = useState();
    // state to store if the page is loading - whether the loading wheel is shown
    const [loading, setLoading] = useState(reload);

    // checks the current date
    const currentDate = new Date();
    // checks if the selected date has passed the current date
    const upcoming = date.day >= currentDate.getDate() && date.month >= (currentDate.getMonth() + 1) && date.year >= currentDate.getFullYear();

    /**
     * to read the bookings for the specific facility on the selected date from firestore
     */
    const getBookings = async () => {
        // to store existing bookings
        const newBookings = new Array();
        // queries under bookings those bookings in firestore made by users for the specific facility
        const q = query(collection(db, "bookings"), 
            where("hall", "==", hall), 
            where("block", "==", block), 
            where("facility", "==", facility));
        // retrieves the documents
        const querySnapshot = await getDocs(q);
        // for each document
        await querySnapshot.forEach(doc => {
          // retrieves document data (name, hall, time etc)
          let data = doc.data()
          // console.log("retrieved: " + doc.id);
          // captures the start date and time
          const start = data.startDateTime.toDate();
          // captures the end date and time
          const end = data.endDateTime.toDate();
          // console.log(date.year);
          // console.log(start)
          // console.log(doc.id + " retrieved")
          // adds it to the newBookings array as a tuple - with the data and the doc id if the start and end date is the same as the selected date
          if (start.getDate() <= date.day && (start.getMonth() + 1) <= date.month && (start.getYear() + 1900) <= date.year 
            && end.getDate() >= date.day && (end.getMonth() + 1) >= date.month && (end.getYear() + 1900) >= date.year) {
                newBookings.push({data: data, id: doc.id});
                // console.log("added: " + doc.id)
          }
          
        })

        // finished loading, can render the list of bookings
        setLoading(false);
        // sort the existing bookings by start time
        newBookings.sort((booking1, booking2) => booking1.data.startDateTime.seconds - booking2.data.startDateTime.seconds);
        // store the existing bookings in the state bookings
        setBookings(newBookings);
        // console.log(bookings);
      }

      // gets the existing bookings every time the page is visited (refreshes the page on every visit)
      useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
          getBookings();
        });
      }, [navigation])

    /**
     * to render the interface for the flatlist of existing bookings
     * @param {Firestore Document} item  the document for the booking on firestore
     * @returns the interface for each booking - with name of user that made the booking, start date and time and end date and time
     */
    function renderList({item}) {
    // convert start Date and Time to String
    const start = item.data.startDateTime.toDate();
    const startDate = start.getDate() + "/" + (start.getMonth() + 1) + "/" + (start.getYear() + 1900);
    const startTime = start.getHours() + ':' + start.getMinutes().toString().padStart(2, "0");
    const starting = startDate + " " + startTime;

    // convert end Date and Time to String
    const end = item.data.endDateTime.toDate();
    const endDate = end.getDate() + "/" + (end.getMonth() + 1) + "/" + (end.getYear() + 1900);
    const endTime = end.getHours() + ':' + end.getMinutes().toString().padStart(2, "0");
    const ending = endDate + " " + endTime;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.topContainer}>
          <View>
            <Text style={styles.title}>Date:</Text>
            <Text style={styles.text2}>{startDate}</Text>
          </View>
          <View>
            <Text style={styles.title}>Time</Text>
            <Text style={styles.text2}>{startTime + " - " + endTime}</Text>
          </View>
        </View>
        <View style={styles.midContainer}>
            <Text style={styles.title}>Booking by</Text>
            <Text style={styles.text2}>{item.data.name}</Text>
        </View>
      </View>
    )
  }

  /**
   *  function to render the screen after all bookings retrieved i.e. load finished
   * 
   * @param props react native props
   * @returns the interface with the list of bookings as well as the book button (if date has not passed)
   */ 
  function Loaded(props) {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            style={styles.item}
            // array of bookings is captured in state booking
            data={bookings}
            renderItem={renderList}
            keyExtractor={item => item.id}
            // to be shown at the end of the list of bookings
            ListFooterComponent={<Text>No more existing bookings</Text>}
            ListFooterComponentStyle={styles.text}
          />
        </View>
        
        {upcoming 
          ? 
            <View style={styles.buttonContainer}>
            <TouchableOpacity 
            // button for user to make a new booking, only shown if the selected date has not passed
              style={styles.button}
              onPress={() => {
                // bring users to the book screen, passing the hall, block, facility and date selected, as well as the whole array of existing bookings
                navigation.navigate("Book", {
                  hall: hall,
                  block: block,
                  facility: facility,
                  startDate: date,
                  endDate: date,
                  existingBookings: bookings
                })
              }}
            >
              <Image source={require('../../assets/plus.png')} style={{width: 30, height: 30, tintColor: '#0782F9'}} />
            </TouchableOpacity>
          </View>
        :
          <Text></Text>
        }
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
      width: '90%',
      alignSelf: 'center',
      backgroundColor: '#E0E0E0',
      borderWidth: 0.7,
      borderColor: 'black',
      borderRadius: '20%',
      padding: '1%',
      marginTop: 10
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
      marginTop: 2,
      marginBottom: 5,
      alignItems: 'center'
    },
    topContainer: {
      width: '96%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
      paddingBottom: '3%',
      paddingLeft: '3%',
      paddingRight: '3%',
      marginTop: '2%'
    },
    midContainer: {
      flexDirection: 'column',
      justifyContent: 'start',
      width: '96%',
      paddingLeft: '3%',
      marginTop: '2%',
      marginBottom: '1%'
    },
    title: {
      fontSize: 12
    },
    text2: {
      fontSize: 18,
      fontWeight: '600'
    }
})