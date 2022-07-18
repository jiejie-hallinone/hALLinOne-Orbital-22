import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, updateDoc, collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar';

// users will be brought here to ammend their selected exising booking from the previous page
const AmendScreen = ({route, navigation}) => {
// obtains user info used to make booking
const currentUser = auth.currentUser;
const uid = currentUser.uid;
const name = currentUser.displayName;

const {hall, block, facility, bookedDate, amend} = route.params;
const selectedDate = bookedDate.toDate();

const [bookings, setBookings] = useState();
const [loading, setLoading] = useState(true);

// get calendar ID from profile in firestore
const[calendarId, setCalendarId] = useState('');
const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
  const data = doc.data();
  if (data && data.calendarId) {
    setCalendarId(data.calendarId);
  } else {
    setCalendarId('');
  }
}); 
// get event ID from booking document in firestore
const[eventId, setEventId] = useState('');
const unsub2 = onSnapshot(doc(db, "bookings", amend), (doc) => {
  const data = doc.data();
  if (data && data.eventID) {
    setEventId(data.eventID);
  } else {
    setEventId('');
  }
}); 

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
    // console.log(date.year);
    // console.log(start)
    // console.log(doc.id + " retrieved")
    // adds it to the newBookings array as a tuple - with the data and the doc id
    if (start.getDate() === selectedDate.getDate() && start.getMonth() === selectedDate.getMonth() && start.getFullYear() === selectedDate.getFullYear()) {
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

// function for expo calendar to obtain the default (native) calendar ID, from expo API
async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

// function to create a new calendar in device, from expo API
async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Hall Bookings' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Hall Bookings',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'hALLinOne',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  // console.log(`${newCalendarID}`);
  return `${newCalendarID}`;
}

// function to create a new event in a given calendar, with fields based on selection of booking
async function createEvent(calendarId) {
  const newEventID = await Calendar.createEventAsync(calendarId, {
    title: "Booking",
    location: paramsToLocation(),
    startDate: date,
    endDate: dateEnd,
    calendarId: calendarId,
    notes: "added from hALLinOne application"
  })
  return `${newEventID}`; 
}

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
  return "A Block";
}
else if (letter === "B") {
  return "B Block";
}
else if (letter === "C") {
  return "C Block";
}
else if (letter === "D") {
  return "D Block";
}
else if (letter === 'E') {
  return "E Block";
} else {
  return "";
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

const paramsToLocation = () => {
  return hallName(hall) + " " + blockName(block) + " " + facName(facility);
}

// states used to capture information for booking
// start date and time
const [date, setDate] = useState(new Date());
// end date and time
const [dateEnd, setDateEnd] = useState(new Date());
// show date or time picker
const [mode, setMode] = useState('date')
// toggle visibility of picker for start time and date
const [showStart, setShowStart] = useState(false)
// toggle visibility of picker for end time and date
const [showEnd, setShowEnd] = useState(false)
// text for checking selected date and time
const [text, setText] = useState("Start time:")
const [textEnd, setTextEnd] = useState("End time:")
// to pass back to history page after confirming amend
const [amended, setAmended] = useState(false);

// updates start date and time when changed
const onChangeStart = (event, selectedTime) => {
  const begin = new Date();
  begin.setDate(selectedDate.day)
  begin.setDate(selectedDate.day);
  begin.setMonth(selectedDate.month);
  begin.setFullYear(selectedDate.year);
  begin.setTime(selectedTime.getTime());
  setDate(begin);

  // shows selected start date and time for debugging
  let tempDate = new Date(begin);
  let fullTime = tempDate.getHours() + 'hrs ' + tempDate.getMinutes() + 'min';
  setText("Start Time: " + fullTime);
}

// updates end date and time when changed
const onChangeEnd = (event, selectedTime) => {
  const finish = new Date();
  finish.setDate(selectedDate.day)
  finish.setDate(selectedDate.day);
  finish.setMonth(selectedDate.month);
  finish.setFullYear(selectedDate.year);
  finish.setTime(selectedTime.getTime());
  setDateEnd(finish);

  // shows selected start date and time for debugging
  let tempDate = new Date(finish);
  let fullTime = tempDate.getHours() + 'hrs ' + tempDate.getMinutes() + 'min';
  setTextEnd("End Time: " + fullTime);
}

// toggles mode and visibility for start picker (makes end invisible)
const showModeStart = (currentMode) => {
  setShowEnd(false);
  setShowStart(true);
  setMode(currentMode);
}

// toggles mode and visibility for end picker (makes start invisible)
const showModeEnd = (currentMode) => {
  setShowStart(false);
  setShowEnd(true);
  setMode(currentMode);
}

function Loaded(props) {
  return (
    <View style={styles.container}>
    <Text>{text}</Text>
    
    <Text>{textEnd}</Text>

    <TouchableOpacity
    // for selecting start time - shows start picker on time mode
      onPress={() => showModeStart('time')}
      style={styles.button}
    > 
      <Text>Select Start Time </Text>
    </TouchableOpacity>

    <TouchableOpacity
      // for selecting end time - shows end picker on time mode
      onPress={() => showModeEnd('time')}
      style={styles.button}
    > 
      <Text>Select End Time </Text>
    </TouchableOpacity>

    {showStart && (
      <DateTimePicker
      // start picker, only shows when start is supposed to be visible (showStart === true)
        testID='Start'
        value={date}
        mode={mode}
        is24Hour={false}
        display='default'
        onChange={onChangeStart}
        style={styles.dtpicker}
      />
    )}

    {showEnd && (
      <DateTimePicker
      // end picker, only shows when end is supposed to be visible (showEnd === true)
        testID='End'
        value={dateEnd}
        mode={mode}
        is24Hour={false}
        display='default'
        onChange={onChangeEnd}
        style={styles.dtpicker}
        minimumDate={date}
      />
    )}

    <TouchableOpacity
    // makes booking by saving into firestore bookings collection
      onPress={() => {
        var booked = false;
        for (let i = 0; i < bookings.length; i++) {
          const id = bookings[i].id;
          if (id != amend) {
            const existingStart = bookings[i].data.startDateTime.seconds;
            const existingEnd = bookings[i].data.endDateTime.seconds;
            const selectedStart = date.getTime() / 1000;
            const selectedEnd = dateEnd.getTime() / 1000;
            // overlaps if it doesnt end before selected start timing or doesnt start after selected end timing
            const available = (existingEnd < selectedStart) || (existingStart > selectedEnd);
            booked = booked || !available;
            // console.log(booked);
          }
        }
        // if facility is not washing machine or dryer and already has existing booking
        if (booked && !(facility === 'W' || facility === 'D')) {
          alert("Selected time period already has a booking!");
        } else {
          const docRef = updateDoc(doc(db, "bookings", amend), {
            startDateTime: date,
            endDateTime: dateEnd,
          })
          .catch(err => {
            alert("Booking does not exist / Unable to update")
          })
          .then(() => {
            setAmended(true);
            console.log("Booking updated");
            // user asked if want to amend booking on calendar, or want to add new event on calendar
            if (calendarId && eventId) {
              Alert.alert("Booking successfully updated", "Amend event on calendar?", [
                {text: 'Amend existing event', onPress: async () => {
                  await Calendar.updateEventAsync(eventId, {
                    startDate: date,
                    endDate: dateEnd
                  })
                  console.log("event updated");
                }},

                {text: 'Add new event', onPress: async () => {
                  // create event in calendar whose ID was stored in the user profile
                  const event = await createEvent(calendarId)
                  // if any errors eg change device, need to create new calendar (ID stored does not exist etc)
                  .catch(async err => {
                    console.log("caught")
                    // create new calendar and event, same process as above
                    const calendar = await createCalendar();
                    setCalendarId(calendar)
                    console.log("calender " + calendar);
                    const docRef = await updateDoc(doc(db, 'users', uid), {
                      calendarId: calendar
                    })
                    .catch(err => {
                      alert("Unable to update calendar")
                    })
                    await createEvent(calendarId);
                    console.log("event recreated with ID: " + event);
                  });
                  console.log("event created with ID: " + event);
                  // store event ID
                  await updateDoc(doc(db, 'bookings', amend), {
                    eventID: event
                  })
                  .catch(err => {
                    alert("Unable to update calendar")
                  });
                  console.log("Event ID updated");
                  navigation.navigate("Bookings", {amended: amended})
                }},

                {text: 'Skip', onPress: () => {
                  navigation.navigate("Bookings", {amended: amended})
                }}
              ])
            // add to calendar (event not created and maybe calendar not created)  
            } else {
              Alert.alert("Booking successfully updated", "Add to calendar?", [
                {text: 'Add to calendar', onPress: async () => {
                  // request permission to access device calendar
                  const { status } = await Calendar.requestCalendarPermissionsAsync();
                  if (status === 'granted') {
                    // yet to create a new calendar for hall bookings
                    if (calendarId === '') {
                      // creates a calendar in device native calendar, named Hall Bookings. calender represents ID of calendar
                      const calendar = await createCalendar();
                      // store ID
                      await setCalendarId(calendar)
                      console.log("calender " + calendar);
                      // add calendar ID of device into profile
                      const docRef = await updateDoc(doc(db, 'users', uid), {
                        calendarId: calendar
                      })
                      .catch(err => {
                        alert("Unable to update calendar")
                      })
                      // create event for booking in the calendar that was just created
                      const event = await createEvent(calendar);
                      console.log("event created with ID: " + event);
                      // update event ID into the booking document for edits in the future
                      await updateDoc(doc(db, 'bookings', amend), {
                        eventID: event
                      })
                      .catch(err => {
                        alert("Unable to update calendar")
                      })
                      console.log("Event ID updated");
                      navigation.navigate("Bookings", {amended: amended})
                    // hall bookings calendar created, just create event
                    } else {
                      // create event in calendar whose ID was stored in the user profile
                      const event = await createEvent(calendarId)
                      // if any errors eg change device, need to create new calendar (ID stored does not exist etc)
                        .catch(async err => {
                          console.log("caught")
                          // create new calendar and event, same process as above
                          const calendar = await createCalendar();
                          setCalendarId(calendar)
                          console.log("calender " + calendar);
                          const docRef = await updateDoc(doc(db, 'users', uid), {
                            calendarId: calendar
                          })
                          .catch(err => {
                            alert("Unable to update calendar")
                          })
                          await createEvent(calendarId);
                          console.log("event recreated with ID: " + event);
                        });
                        console.log("event created with ID: " + event);
                        // store event ID
                        await updateDoc(doc(db, 'bookings', amend), {
                          eventID: event
                        })
                        .catch(err => {
                          alert("Unable to update calendar")
                        });
                        console.log("Event ID updated");
                        navigation.navigate("Bookings", {amended: amended})
                    }
                  // access denied
                  } else {
                    alert("Unable to access calendar");
                    navigation.navigate("Bookings", {amended: amended})
                  }
                }},

                {text: "No", onPress: () => {
                  navigation.navigate("Bookings", {amended: amended})
                }}
              ])
            } 
          })
        }
      }}
        
      style={styles.confirm}
     >
       <Text style={styles.text}>Amend Booking</Text>
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

export default AmendScreen;

const styles = StyleSheet.create({
container: {
  width: '100%',
  alignItems: 'center',
},
button: {
  backgroundColor: 'white',
  width: '100%',
  padding: 15,
  alignItems: 'center',
  marginTop: 10,
},
dtpicker: {
  width: '80%',
  backgroundColor: 'white',
  marginTop: 20,
},
confirm: {
  width: '50%',
  backgroundColor:'#0782F9',
  alignItems: 'center',
  padding: 15,
  marginTop: 20,
  borderRadius: 10,
},
text: {
  color: 'white',
  fontWeight: '700',
  fontSize: 16
}
})