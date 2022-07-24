import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, {useEffect, useState} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, getDocs, collection, query, where, deleteDoc } from "firebase/firestore";

/**
 * to match abbreviation to full hall name (since we stored abbrev to save space in firestore)
 * 
 * @param hallAbbreviation the 2 character string used in to store the the hall of the user
 * @return full string name of the hall
 */
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

/**
 * to match abbreviation to letter / number for blocks (since we stored only letters to save space in firestore)
 * 
 * @param letter the char used to store the block the user selected
 * @return full string name of the block
 */
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

/**
 * to match abbreviation to full facility name (since we stored abbrev to save space in firestore)
 * 
 * @param facAbbreviation the char used to store the facility the user selected
 * @return full string name of the facility
 */
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
  // obtain current user's uid
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;

  // boolean for if a booking was amended, from amend screen
  const {amended} = route.params || true;

  // if still retrieving information
  const [loading, setLoading] = useState(amended);
  
  /**
   * gets the bookings from firestore made by current user, with end date and time after the current date and time
   */
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

    // finishes loading
    setLoading(false);

    // sort bookings by start time
    newBookings.sort((booking1, booking2) => booking1.data.startDateTime.seconds - booking2.data.startDateTime.seconds);
    // store in state bookings
    setBookings(newBookings);
  }
  
  
  // to get the bookings and set to the state bookings, every time page is visited
  const [bookings, setBookings] = useState([]);
  
  // refreshes the bookings every time the page is visited
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
    const startTime = start.getHours() + ':' + start.getMinutes().toString().padStart(2, "0");
    const starting = startDate + " " + startTime;

    // convert end Date and Time to String
    const end = item.data.endDateTime.toDate();
    const endDate = end.getDate() + "/" + (end.getMonth() + 1) + "/" + (end.getYear() + 1900);
    const endTime = end.getHours() + ':' + end.getMinutes().toString().padStart(2, "0");
    const ending = endDate + " " + endTime;

    return (
      // shows details of bookings - hall, block, facility, start and end date and time
      <View style={styles.itemContainer}>
        <View style={styles.topContainer}>
          <View>
            <Text style={styles.title}>Date</Text>
            <Text style={styles.text}>{startDate}</Text>
          </View>
          <View>
            <Text style={styles.title}>Time</Text>
            <Text style={styles.text}>{startTime + " - " + endTime}</Text>
          </View>
        </View>
        <View style={styles.midContainer}>
            <Text style={styles.title}>{blockName(item.data.block)}</Text>
            <Text style={styles.text}>{facName(item.data.facility)}</Text>
        </View>
        <View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
            // button to amend booking, passes the booking id to the amend screen
              onPress={() => {
                try {
                  // get the document id of the booking to be amended
                  const amendingid = item.id;
                  // store id
                  setAmend(amendingid);
                  console.log("amending: " + amendingid)
                  // bring user to the amend page with the hall, block, facility, date and id of the booking to be amended
                  navigation.navigate("Amend", {
                    hall: item.data.hall,
                    block: item.data.block,
                    facility: item.data.facility,
                    bookedDate: item.data.startDateTime,
                    amend: amendingid
                  });
                } catch (err) {
                  // alerts user that there was an error, and to try again
                  alert("Error! Please try again! " + err)
                }
                
              }}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Amend</Text>
            </TouchableOpacity>

            <TouchableOpacity
              // button to cancel booking
                onPress={() => {
                  // user has to confirm cancellation on the alert
                  try {
                    Alert.alert('Cancel Booking', 'Are you sure?', [
                    {text: 'Cancel Booking', onPress: () => {
                      // if user confirms cancelling
                      // get document id of the booking to be delted
                      const delid = item.id;
                      // store
                      setDel(delid);
                      // delete the document of the booking from firestore
                      deleteDoc(doc(db, "bookings", delid));
                      console.log("deleted: " + delid);
                      // refresh the page to update the existing bookings
                      setLoading(true);
                      getBookings();
                    }},
                    {text: 'Go back', onPress: () => {
                      // user does not want to cancel, wants to return
                      // bring user back to current page
                      navigation.navigate("Bookings");
                    }}
                  ])
                  } catch (err) {
                    // alert user on error
                    alert("Error! Please try again. " + err) 
                  }
                  
                }}
                style={[styles.cancelButton, styles.cancelButtonOutline]}
              >
                <Text style={styles.cancelButtonOutlineText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
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
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5, 
    marginRight: 30,
    padding: 5,
    textAlign: 'center'
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
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 30,
    padding: 5,
    textAlign: 'center'
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
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
    borderWidth: 0.7,
    borderColor: 'black',
    borderRadius: '20%',
    padding: '1%',
    marginBottom: 5
  },
  footer: {
    marginTop: 2,
    marginBottom: 5,
    alignItems: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  text: {
    fontSize: 18,
    fontWeight: '600'
  }
})