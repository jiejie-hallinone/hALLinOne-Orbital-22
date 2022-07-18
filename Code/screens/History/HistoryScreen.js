import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, getDocs, collection, query, where, deleteDoc } from "firebase/firestore";

// to match abbreviation to full hall name (since we stored abbrev to save space in firestore)
const hallName = hallAbbreviation => {
  if (hallAbbreviation === "TH") {
    return "Temasek Hall";
  }
  else if (hallAbbreviation === "EH") {
    return "Eusoff Hall";
  }
  else if (hallAbbreviation === "SH") {
    return "Sheares Hall";
  }
  else if (hallAbbreviation === "KR") {
    return "Kent Ridge Hall";
  }
  else if (hallAbbreviation === "LH") {
    return "Prince George's Park Hall";
  }
  else {
    return "King Edwards VII Hall"
  }
}

// to match abbreviation to letter / number for blocks(since we stored only letters to save space in firestore)
const blockName = letter => {
  if (letter === "A") {
    return "A / 1";
  }
  else if (letter === "B") {
    return "B / 2";
  }
  else if (letter === "C") {
    return "C / 3";
  }
  else if (letter === "D") {
    return "D / 4";
  }
  else if (letter === 'E') {
    return "E / 5";
  } else {
    return "Common Facility";
  }
}

// to match abbreviation to full facility name (since we stored abbrev to save space in firestore)
const facName = facAbbreviation => {
  if (facAbbreviation === 'L') {
    return "Lounge";
  }
  else if (facAbbreviation === 'W') {
    return "Washing Machine";
  }
  else if (facAbbreviation === 'D') {
    return "Dryer";
  }
  else if (facAbbreviation === 'B') {
    return "Basketball Court";
  }
  else if (facAbbreviation === 'S') {
    return "Squash Court";
  }
  else if (facAbbreviation === 'M') {
    return "Band / Music Room";
  }
  else {
    return "Communal Hall"
  }
}

// here the existing bookings made by the user will be shown
const HistoryScreen = ({route, navigation}) => {
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;

  // boolean for if a booking was amended, from amend screen
  const {amended} = route.params || true;

  // if still retrieving information
  const [loading, setLoading] = useState(amended);
  
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

    newBookings.sort((booking1, booking2) => booking1.data.startDateTime.seconds - booking2.data.startDateTime.seconds);
    setBookings(newBookings);
  }
  
  
  // to get the bookings and set to the state bookings, every time page is visited
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      getBookings();
    });
  }, [navigation])


  // to get which booking id to amend
  const [amend, setAmend] = useState();
  // to get which booking id to delete
  const [del, setDel] = useState();

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
        <Text>Hall: {hallName(item.data.hall)}</Text>
        <Text>Block: {blockName(item.data.block)}</Text>
        <Text>Facility: {facName(item.data.facility)}</Text>
        <Text>From: {starting}</Text>
        <Text>To: {ending}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
          // button to amend booking, passes the booking id to the amend screen
            onPress={() => {
              try {
                const amendingid = item.id;
                setAmend(amendingid);
                console.log("amending: " + amendingid)
                navigation.navigate("Amend", {
                  hall: item.data.hall,
                  block: item.data.block,
                  facility: item.data.facility,
                  bookedDate: item.data.startDateTime,
                  amend: amendingid
                });
              } catch (err) {
                alert("Error! Please try again")
              }
              
            }}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Amend</Text>
          </TouchableOpacity>

          <TouchableOpacity
            // button to cancel booking
              onPress={() => {
                // user has to confirm cancellation
                try {
                  Alert.alert('Cancel Booking', 'Are you sure?', [
                  {text: 'Cancel Booking', onPress: () => {
                    const delid = item.id;
                    setDel(delid);
                    deleteDoc(doc(db, "bookings", delid));
                    console.log("deleted: " + delid);
                    setLoading(true);
                    getBookings();
                  }},
                  {text: 'Go back', onPress: () => {
                    navigation.navigate("Bookings");
                  }}
                ])
                } catch (err) {
                  alert("Error! Please try again.")
                }
                
              }}
              style={[styles.cancelButton, styles.cancelButtonOutline]}
            >
              <Text style={styles.cancelButtonOutlineText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        
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
          ListFooterComponent={<Text>No more upcoming bookings</Text>}
          ListFooterComponentStyle={styles.footer}
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

export default HistoryScreen

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
    width: '25%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5, 
    marginRight: 30,
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
    width: '100%', 
  },
  cancelButton: {
    backgroundColor: '#0782F9',
    width: '25%',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 30
  },
  cancelButtonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: 'red',
    borderWidth: 2,
  },
  cancelButtonOutlineText: {
    color: 'red',
    fontSize: 16,
  },
  itemContainer: {
    alignItems: 'center',
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    marginBottom: 5,
  },
  footer: {
    marginTop: 2,
    marginBottom: 5,
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
})