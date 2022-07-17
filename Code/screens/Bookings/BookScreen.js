import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, {useState} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, addDoc, collection, onSnapshot, updateDoc } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar';

// this screen is to fill in the details of the booking of the facility selected in previous page - date and time
const BookScreen = ({route, navigation}) => {
  // obtains user info used to make booking
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;
  const name = currentUser.displayName;

  const[calendarId, setCalendarId] = useState('');
  const[BookingId, setBookingId] = useState('');
  const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    const data = doc.data();
    if (data && data.calendarId) {
      setCalendarId(data.calendarId);
    } else {
      setCalendarId('');
    }
  }); 

  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }
  
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

  const {hall, block, facility, startDate, endDate, existingBookings} = route.params;

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

  // updates start date and time when changed
  const onChangeStart = (event, selectedTime) => {
    const begin = new Date();
    begin.setDate(startDate.day);
    begin.setMonth(startDate.month);
    begin.setFullYear(startDate.year);
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
    finish.setDate(endDate.day);
    finish.setMonth(endDate.month);
    finish.setFullYear(endDate.year);
    finish.setTime(selectedTime.getTime());
    setDateEnd(finish);

    // shows selected end date and time for debugging
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
          minimumDate={new Date()}
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
        onPress={async () => {
          if (facility === 'W' || facility === 'D') {
            const docRef = await addDoc(collection(db, "bookings"), {
              uid: uid,
              name: name,
              hall: hall,
              block: block,
              facility: facility,
              startDateTime: date,
              endDateTime: dateEnd,
            })
            await setBookingId(docRef.id);
            console.log("Booking made with ID: " + docRef?.id);
            navigation.popToTop();
            // user notified of successful booking and brought back to main page
            Alert.alert('Booking successfully made', 'Add to Calendar?', [
              {text:'Add to Calendar', onPress: () => {
                (async () => {
                  const { status } = await Calendar.requestCalendarPermissionsAsync();
                  // permission to access calendar granted
                  if (status === 'granted') {
                    // yet to create a new calendar for hall bookings
                      if (calendarId === '') {
                      // creates a calendar in device native calendar, named Hall Bookings. calender represents ID of calendar
                      const calendar = await createCalendar();
                      setCalendarId(calendar)
                      console.log("calender " + calendar);
                      const docRef = updateDoc(doc(db, 'users', uid), {
                        calendarId: calendar
                      })
                      .catch(err => {
                        alert("Unable to update calendar")
                      })
                      // create event for booking
                      const event = await createEvent();
                      console.log("event created with ID: " + event);
                      const docRef2 = await updateDoc(doc(db, 'bookings', BookingId), {
                        eventID: event
                      })
                      .catch(err => {
                        alert("Unable to update calendar")
                      })
                      console.log("Event ID updated");
                    // hall bookings calendar created, just create event
                    } else {
                      const event = await createEvent(calendarId);
                      console.log("event created with ID: " + event);
                      /*
                      const docRef = await updateDoc(doc(db, 'bookings', BookingId), {
                        eventID: event
                      })
                      .catch(err => {
                        alert("Unable to update calendar")
                      })
                      console.log("Event ID updated");
                      */
                    }
                  }
                  else {
                    alert("Unable to access calendar")
                  }
                })();
                navigation.navigate("History", {
                  amended: true
                });
              }},
              {text:'No', onPress: () => {
                navigation.navigate("History", {
                  amended: true
                });
              }}
            ])
          } else {
            var booked = false;
            for (let i = 0; i < existingBookings.length; i++) {
              const existingStart = existingBookings[i].data.startDateTime.seconds;
              const existingEnd = existingBookings[i].data.endDateTime.seconds;
              const selectedStart = date.getTime() / 1000;
              const selectedEnd = dateEnd.getTime() / 1000;
              // overlaps if it doesnt end before selected start timing or doesnt start after selected end timing
              const available = (existingEnd < selectedStart) || (existingStart > selectedEnd);
              booked = booked || !available;
            }
            // console.log(booked);
            if (booked) {
              alert("Selected time period already has a booking! Check previous page for existing bookings!");
            } else {
              const docRef = await addDoc(collection(db, "bookings"), {
                uid: uid,
                name: name,
                hall: hall,
                block: block,
                facility: facility,
                startDateTime: date,
                endDateTime: dateEnd,
              })
              await setBookingId(docRef.id);
              console.log("Booking made with ID: " + docRef?.id);
              navigation.popToTop();
              // user notified of successful booking and brought back to main page
              Alert.alert('Booking successfully made', 'Add to Calendar?', [
                {text:'Add to Calendar', onPress: () => {
                  (async () => {
                    const { status } = await Calendar.requestCalendarPermissionsAsync();
                    // permission to access calendar granted
                    if (status === 'granted') {
                      // yet to create a new calendar for hall bookings
                        if (calendarId === '') {
                        // creates a calendar in device native calendar, named Hall Bookings. calender represents ID of calendar
                        const calendar = await createCalendar();
                        setCalendarId(calendar)
                        console.log("calender " + calendar);
                        const docRef = updateDoc(doc(db, 'users', uid), {
                          calendarId: calendar
                        })
                        .catch(err => {
                          alert("Unable to update calendar")
                        })
                        // create event for booking
                        const event = await createEvent(calendarId);
                        console.log("event created with ID: " + event);
                        const docRef2 = await updateDoc(doc(db, 'bookings', BookingId), {
                          eventID: event
                        })
                        .catch(err => {
                          alert("Unable to update calendar")
                        })
                        console.log("Event ID updated");
                      // hall bookings calendar created, just create event
                      } else {
                        // console.log("creating")
                        const event = await createEvent(calendarId)
                        .catch(async err => {
                          console.log("caught")
                          const calendar = await createCalendar();
                          setCalendarId(calendar)
                          console.log("calender " + calendar);
                          const docRef = updateDoc(doc(db, 'users', uid), {
                            calendarId: calendar
                          })
                          .catch(err => {
                            alert("Unable to update calendar")
                          })
                          await createEvent(calendarId);
                          console.log("event recreated with ID: " + event);
                        });
                        console.log("event created with ID: " + event);
                        /*
                        const docRef = await updateDoc(doc(db, 'bookings', BookingId), {
                          eventID: event
                        })
                        .catch(err => {
                          alert("Unable to update calendar")
                        })
                        console.log("Event ID updated");
                        */
                      }
                    }
                    else {
                      alert("Unable to access calendar")
                    }
                  })();
                  navigation.navigate("History", {
                    amended: true
                  });
                }},
                {text:'No', onPress: () => {
                  navigation.navigate("History", {
                    amended: true
                  });
                }}
              ])
            }
            
          }
          
        }}
          
        style={styles.confirm}
       >
         <Text style={styles.text}>Confirm Booking</Text>
      </TouchableOpacity> 
    </View>
  )
}

export default BookScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
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