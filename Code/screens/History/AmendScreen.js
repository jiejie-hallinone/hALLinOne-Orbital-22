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

// receives the hall, block, facility, date of booking, as well as the document id of the booking to be amended
const {hall, block, facility, bookedDate, amend} = route.params;
// convert type of the date of booking to JavaScript Date
const selectedDate = bookedDate.toDate();

// state used to store existing bookings
const [bookings, setBookings] = useState();
// state used to store if the page is done loading (existing bookings are done being read)
const [loading, setLoading] = useState(true);

// reads calendar ID from profile in firestore
const[calendarId, setCalendarId] = useState('');
const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
  const data = doc.data();
  if (data && data.calendarId) {
    setCalendarId(data.calendarId);
  } else {
    setCalendarId('');
  }
});

// reads event ID from booking document in firestore
const[eventId, setEventId] = useState('');
const unsub2 = onSnapshot(doc(db, "bookings", amend), (doc) => {
  const data = doc.data();
  if (data && data.eventID) {
    setEventId(data.eventID);
  } else {
    setEventId('');
  }
}); 

/**
 * reads existing bookings from Firestore
 */
const getBookings = async () => {
  // to store data
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
    // converts the start date to date format
    const start = data.startDateTime.toDate();
    // console.log(doc.id + " retrieved")
    // adds it to the newBookings array as a tuple - with the data and the doc id if the start date of the booking is the same as that of the booking being amended
    if (start.getDate() === selectedDate.getDate() && start.getMonth() === selectedDate.getMonth() && start.getFullYear() === selectedDate.getFullYear()) {
          newBookings.push({data: data, id: doc.id});
          // console.log("added: " + doc.id)
    }
    
  })

  setLoading(false);

  setBookings(newBookings);
  // console.log(bookings);
}

// refreshes the existing bookings every time the page is visited
useEffect(() => {
  const unsub = navigation.addListener('focus', () => {
    getBookings();
  });
}, [navigation])

/**
 * function for expo calendar to obtain the default (native) calendar ID, from expo API
 * 
 * @returns the source id of the calender
 */
async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

/**
 * function to create a new calendar in device, from expo API
 * 
 * @returns string value of the calendarID created in the device
 */ 
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

/**
 * function to create a new event in a given calendar, with fields based on selection of booking
 * 
 * @param {string} calendarId the id of the calendar in the device to create an event in
 * @returns the string value of the event created
 */ 
async function createEvent(calendarId) {
  const newEventID = await Calendar.createEventAsync(calendarId, {
    // creates an event with title e.g. Booking: Washing Machine
    title: "Booking: " + facName(facility),
    // location of the event eg Temasek Hall Block B Lounge
    location: paramsToLocation(),
    startDate: date,
    endDate: dateEnd,
    calendarId: calendarId,
    notes: "added from hALLinOne application"
  })
  return `${newEventID}`; 
}

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
 * to match abbreviation to letter / number for blocks(since we stored only letters to save space in firestore)
 * 
 * @param letter the char used to store the block the user selected
 * @return full string name of the block
 */
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

/**
 * combines the full string names of the hall, block and facility to input as the location in the event created in the calendar
 * 
 * @returns full string name of hall block and facility e.g. Temasek Hall A Block Dryer or Eusoff Hall Communal Hall
 */
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
const [text, setText] = useState("")
const [textEnd, setTextEnd] = useState("")
// to pass back to history page after confirming amend
const [amended, setAmended] = useState(false);

/**
 * updates start time when changed on the picker
 */ 
const onChangeStart = (event, selectedTime) => {
  // template for start time
  const begin = new Date();
  // set time to the time that was selected on the picker
  begin.setDate(selectedDate.day)
  begin.setDate(selectedDate.day);
  begin.setMonth(selectedDate.month);
  begin.setFullYear(selectedDate.year);
  // set time to the time that was selected on the picker
  begin.setTime(selectedTime.getTime());
  // store in state Date
  setDate(begin);

  let tempDate = new Date(begin);
  // get the time inputed in string
  let fullTime = tempDate.getHours() + ':' + tempDate.getMinutes().toString().padStart(2, "0");
  // store in state Text to be displayed
  setText(fullTime);
}

/**
 * updates end time when changed on the picker
 */ 
const onChangeEnd = (event, selectedTime) => {
  // template for end time
  const finish = new Date();
  // set date to the date selected in previous screen
  finish.setDate(selectedDate.day);
  finish.setMonth(selectedDate.month);
  finish.setFullYear(selectedDate.year);
  // set time to the time that was selected on the picker
  finish.setTime(selectedTime.getTime());
  // store in the state DateEnd
  setDateEnd(finish);

  let tempDate = new Date(finish);
  // get the time inputted in string
  let fullTime = tempDate.getHours() + ':' + tempDate.getMinutes().toString().padStart(2, "0");
    // store in state textEnd to be displayed
    setTextEnd(fullTime);
}

/**
 * toggles mode and visibility for start picker (makes end invisible)
 * 
 * @param currentMode the mode of the datetimepicker to show  "date" or "time"
 */
const showModeStart = (currentMode) => {
  setShowEnd(false);
  setShowStart(true);
  setMode(currentMode);
}

/**
 * toggles mode and visibility for end picker (makes start invisible)
 * 
 * @param currentMode the mode of the datetimepicker to show  "date" or "time"
 */
const showModeEnd = (currentMode) => {
  setShowStart(false);
  setShowEnd(true);
  setMode(currentMode);
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
      <View style={styles.topContainer}>
        <Text style={styles.title}>From:</Text>
        <Text style={styles.from}>{text}</Text>
        <Text style={styles.title}>To:</Text>
        <Text style={styles.to}>{textEnd}</Text>

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
    </View>

    {showStart && (
      <DateTimePicker
      // start picker, only shows when start is supposed to be visible (showStart === true)
        // id of picker is Start
        testID='Start'
        // value input will be stored as date
        value={date}
        // original mode is on date mode (as stored in state mode) - based on previous implementation where users will select both date and time on this page. current version is only time
        mode={mode}
        // clock is not 24hr
        is24Hour={false}
        display='default'
        // when value is changed, onChangeStart function is called
        onChange={onChangeStart}
        style={styles.dtpicker}
      />
    )}

    {showEnd && (
      <DateTimePicker
      // end picker, only shows when end is supposed to be visible (showEnd === true)
        // id of picker is End
        testID='End'
        // id of picker is End
        value={dateEnd}
        // original mode is on date mode (as stored in state mode) - based on previous implementation where users will select both date and time on this page. current version is only time
        mode={mode}
        // clock is not 24hr
        is24Hour={false}
        display='default'
        // when value is changed, onChangeEnd function is called
        onChange={onChangeEnd}
        style={styles.dtpicker}
        // minimum date on picker is whatever was selected as the start date - else it is the current date and time
        minimumDate={date}
      />
    )}

    <TouchableOpacity
      // Button to confirm amendment
      // a confirmed amendment updates the existing document in the "bookings" collection in firestore
      // then the user is asked if they want to add the event to calendar or amend of event was already created
      // if the user wishes to, then permission is requested, a calendar and then an event is created.
      onPress={() => {
        // variable to store document ID of booking in firestore after creating
        var booked = false;
        // go through array of existing bookings for that facility on that day (from previous screen) and check any overlaps. if booked remains false, booking can be made
        for (let i = 0; i < bookings.length; i++) {
          const id = bookings[i].id;
          // read the document if the document is not the booking being amended
          if (id != amend) {
            // access the start and end date and time stored in the existing bookings - stored as seconds (Firestore timestamp format)
            const existingStart = bookings[i].data.startDateTime.seconds;
            const existingEnd = bookings[i].data.endDateTime.seconds;
            // get the start and end time that was selected  -stored as milliseconds (JavaScript Date format) hence need to divide by 1000
            const selectedStart = date.getTime() / 1000;
            const selectedEnd = dateEnd.getTime() / 1000;
            // overlaps if it doesnt end before selected start timing or doesnt start after selected end timing
            const available = (existingEnd < selectedStart) || (existingStart > selectedEnd);
            // accumulates through the existing bookings if the facility is booked
            booked = booked || !available;
            // console.log(booked);
          }
        }
        // if facility is not washing machine or dryer and already has existing booking
        if (booked && !(facility === 'W' || facility === 'D')) {
          // alert user that the time period is already booked
          alert("Selected time period already has a booking!");
        } else {
          // update the document of the booking to the new selected start and end time
          const docRef = updateDoc(doc(db, "bookings", amend), {
            startDateTime: date,
            endDateTime: dateEnd,
          })
          // catch any errors
          .catch(err => {
            // alert the user that update failed
            alert("Booking does not exist / Unable to update")
            // bring user back to the main history page without triggering refresh of the page
            navigation.navigate("Bookings", {amended: amended})
          })
          // once updated
          .then(() => {
            // to trigger refresh of history page when going back later
            setAmended(true);
            // log on console that the booking was successful
            console.log("Booking updated");
            // if an event and calendar has been created before, user asked if want to amend booking on calendar, or want to add new event on calendar
            if (calendarId && eventId) {
              Alert.alert("Booking successfully updated", "Amend event on calendar?", [
                {text: 'Amend existing event', onPress: async () => {
                  // request permission to access device calendar
                  const { status } = await Calendar.requestCalendarPermissionsAsync();
                  // permission to access calendar granted
                  if (status === 'granted') {
                    // update the start and end time on the previously created event in the calendar
                    await Calendar.updateEventAsync(eventId, {
                      startDate: date,
                      endDate: dateEnd
                    })
                    // catch any errors, usually that the event does not exist on the device
                    .catch(err => {
                      // alert user that update failed, request user to either create a new event or skip
                      alert("Event unable to be updated, add new event or skip!")
                    })
                    .then(() => {
                      // log that the update was successful
                      console.log("event updated");
                      // bring user back to main history page and trigger reload
                      navigation.navigate("Bookings", {amended: amended});
                    })
                  // access to calendar was denied
                  } else {
                    // alert the user that unable to access
                    alert("access denied");
                    // bring user back to main history page and trigger reload
                    navigation.navigate("Bookings", {amended: amended})
                  }
                }},

                {text: 'Add new event', onPress: async () => {
                  // request permission to access device calendar
                  const { status } = await Calendar.requestCalendarPermissionsAsync();
                  // permission to access calendar granted
                  if (status === 'granted') {
                    // create event in calendar whose ID was stored in the user profile
                    const event = await createEvent(calendarId)
                    // if any errors eg change device, need to create new calendar (ID stored does not exist etc)
                    .catch(async err => {
                      // logs on console that an error was caught - for tracing flow and debugging
                      console.log("caught")
                      // creates a calendar in device native calendar, named Hall Bookings. calender represents ID of calendar
                      const calendar = await createCalendar();
                      // store id
                      await setCalendarId(calendar)
                      console.log("calender " + calendar);
                      // add calendar ID of device into profile
                      await updateDoc(doc(db, 'users', uid), {
                        calendarId: calendar
                      })
                      .catch(err => {
                        // alert user that update failed
                        alert("Unable to update calendar")
                        // bring user back to main history page and trigger reload
                        navigation.navigate("Bookings", {amended: amended})
                      })
                      // create new event for booking in the calendar that was just amended
                      const event2 = await createEvent(calendar);
                      console.log("event recreated with ID: " + event2);
                       await updateDoc(doc(db, 'bookings', amend), {
                         eventID: event2
                       })
                       .catch(err => {
                         alert("Unable to update calendar")
                       });
                       console.log("Event ID updated");
                       navigation.navigate("Bookings", {amended: amended})
                      });
                        
                      // if event was successfully created, carry on with process
                      if (event) {
                        // log successful update
                        console.log("event created with ID: " + event);
                        // store new event ID in booking document on firestore
                        await updateDoc(doc(db, 'bookings', amend), {
                          eventID: event
                        })
                        .catch(err => {
                          // alert user on error
                          alert("Unable to update event ID in firestore")
                        });
                        // log successful creation
                        console.log("Event ID updated");
                        // bring user back to main history page and trigger reload
                        navigation.navigate("Bookings", {amended: amended})
                      }
                  // permission to access calendar denied
                  } else {
                    // alert user that unable to access calendar
                    alert("access denied")
                    // bring user back to main history page and trigger reload
                    navigation.navigate("Bookings", {amended: amended})
                  }
                }},

                {text: 'Skip', onPress: () => {
                  navigation.navigate("Bookings", {amended: amended})
                }}
              ])
            // add to calendar (event not created and maybe calendar not created) 
            // refer to above for annotations 
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
                          await setCalendarId(calendar)
                          console.log("calender " + calendar);
                          const docRef = await updateDoc(doc(db, 'users', uid), {
                            calendarId: calendar
                          })
                          .catch(err => {
                            alert("Unable to update calendar")
                          })
                          const event2 = await createEvent(calendar);
                          console.log("event recreated with ID: " + event2);
                          await updateDoc(doc(db, 'bookings', amend), {
                            eventID: event2
                          })
                          .catch(err => {
                            alert("Unable to update calendar")
                          });
                          console.log("Event ID updated");
                          navigation.navigate("Bookings", {amended: amended})
                        });
                        // if event was successfully created, carry on with process
                        if (event) {
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

// if all existing bookings yet to be retrieved, a loading wheel will be shown, else the input fields and the confirm button will be shown
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
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 5, 
  marginRight: 30,
  padding: 5,
  textAlign: 'center',
},
dtpicker: {
  width: '80%',
  backgroundColor: '#F5F5F5',
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
},
topContainer: {
  width: '96%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderBottomWidth: 1,
  borderBottomColor: 'gray',
  paddingBottom: '3%',
  paddingLeft: '3%',
  paddingRight: '3%',
  marginTop: '2%'
},
title: {
  fontSize: 12,
},
from: {
  fontSize: 18,
  fontWeight: '600',
},
to: {
  fontSize: 18,
  fontWeight: '600',
}

})