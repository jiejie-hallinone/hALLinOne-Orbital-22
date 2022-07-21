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
  const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
    const data = doc.data();
    if (data && data.calendarId) {
      setCalendarId(data.calendarId);
    } else {
      setCalendarId('');
    }
  }); 

  /**
   * function for expo calendar to obtain the default (native) calendar ID, from expo API
   * 
   * @return source of default calendar
   */
  async function getDefaultCalendarSource() {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }
  
  /**
   * function to create a new calendar in device, from expo API
   *  
   * @return string value of the id of the calendar
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
   * @param calendarId the string id of the calendar to create the event in
   * @return string value of the event of the booking on the calendar
   */ 
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
  const [text, setText] = useState("Start time:")
  const [textEnd, setTextEnd] = useState("End time:")

  /**
   * updates start time when changed on the picker
   */ 
  const onChangeStart = (event, selectedTime) => {
    // template for start time
    const begin = new Date();
    // set date to the date selected in previous screen
    begin.setDate(startDate.day);
    begin.setMonth(startDate.month);
    begin.setFullYear(startDate.year);
    // set time to the time that was selected on the picker
    begin.setTime(selectedTime.getTime());
    // store in state Date
    setDate(begin);

    let tempDate = new Date(begin);
    // get the time inputed in string
    let fullTime = tempDate.getHours() + 'hrs ' + tempDate.getMinutes() + 'min';
    // store in state Text to be displayed
    setText("Start Time: " + fullTime);
  }

  /**
   * updates end time when changed on the picker
   */ 
  const onChangeEnd = (event, selectedTime) => {
    // template for end time
    const finish = new Date();
    // set date to the date selected in previous screen
    finish.setDate(endDate.day);
    finish.setMonth(endDate.month);
    finish.setFullYear(endDate.year);
    // set time to the time that was selected on the picker
    finish.setTime(selectedTime.getTime());
    // store in the state DateEnd
    setDateEnd(finish);

    let tempDate = new Date(finish);
    // get the time inputted in string
    let fullTime = tempDate.getHours() + 'hrs ' + tempDate.getMinutes() + 'min';
    // store in state textEnd to be displayed
    setTextEnd("End Time: " + fullTime);
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
          // minimum date is the current date and time
          minimumDate={new Date()}
        />
      )}

      {showEnd && (
        <DateTimePicker
        // end picker, only shows when end is supposed to be visible (showEnd === true)
          // id of picker is End
          testID='End'
          // value input will be stored as dateEnd
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
      // Button to confirm booking
      // a confirmed booking creates a new document in the "bookings" collection in firestore
      // then the user is asked if they want to add the event to calendar
      // if the user wishes to, then permission is requested, a calendar and then an event is created.
        onPress={async () => {
          // variable to store document ID of booking in firestore after creating
          var bookingID;
          // if washing machine or dryer, no need to check existing bookings
          if (facility === 'W' || facility === 'D') {
            // create booking in firestore
            const docRef = await addDoc(collection(db, "bookings"), {
              // values are stored in the following form - title: value
              // values are captured by the states
              uid: uid,
              name: name,
              hall: hall,
              block: block,
              facility: facility,
              startDateTime: date,
              endDateTime: dateEnd,
            })
            // store document ID
            bookingID = docRef.id;
            // logs that the booking is successfully made (not visible to users)
            console.log("Booking made with ID: " + bookingID);
            // return Bookings tab to Hall page - so the next booking the user makes, the preexisting bookings would be refreshed
            navigation.popToTop();
            // user notified of successful booking and asked if wish to add to native calendar on device through an alert
            Alert.alert('Booking successfully made', 'Add to Calendar?', [
              // option to add to calendar
              {text:'Add to Calendar', onPress: () => {
                (async () => {
                  // request permission to access device calendar
                  const { status } = await Calendar.requestCalendarPermissionsAsync();
                  // permission to access calendar granted
                  if (status === 'granted') {
                    // yet to create a new calendar for hall bookings
                      if (calendarId === '') {
                      // creates a calendar in device native calendar, named Hall Bookings. calender represents ID of calendar
                      const calendar = await createCalendar();
                      // store ID
                      setCalendarId(calendar)
                      console.log("calender " + calendar);
                      // add calendar ID of device into profile
                      const docRef = updateDoc(doc(db, 'users', uid), {
                        calendarId: calendar
                      })
                      .catch(err => {
                        alert("Unable to update calendar")
                      })
                      // create event for booking in the calendar that was just created
                      const event = await createEvent(calendar);
                      console.log("event created with ID: " + event);
                      // update event ID into the booking document for edits in the future (if the user amends the booking)
                      await updateDoc(doc(db, 'bookings', bookingID), {
                        eventID: event
                      })
                      .catch(err => {
                        alert("Unable to update calendar")
                      })
                      console.log("Event ID updated");
                    // hall bookings calendar created, just create event
                    } else {
                      // create event in calendar whose ID was stored in the user profile
                      const event = await createEvent(calendarId)
                      // if any errors eg change device, need to create new calendar (calendarID in firestore does not exist on local device etc)
                        .catch(async err => {
                          // logs on console that an error was caught - for tracing flow and debugging
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
                          const event2 = await createEvent(calendar);
                          console.log("event recreated with ID: " + event2);
                          // store event ID
                          await updateDoc(doc(db, 'bookings', bookingID), {
                            eventID: event2
                          })
                          .catch(err => {
                            alert("Unable to update calendar")
                          })
                          console.log("Event ID updated")
                        });
                        if (event) {
                          console.log("event created with ID: " + event);
                          // store event ID
                          await updateDoc(doc(db, 'bookings', bookingID), {
                            eventID: event
                          })
                          .catch(err => {
                            alert("Unable to update calendar")
                          })
                          console.log("Event ID updated")
                        } 
                    }
                  }
                  // access to calendar denied
                  else {
                    // alerts users that app was unable to access the device's calendar
                    alert("Unable to access calendar")
                  }
                })();
                // navigate to history page to see made bookings
                navigation.navigate("History", {
                  amended: true
                });
              }},
              // navigate to history page to see made bookings if do not wish to add to calendar
              {text:'No', onPress: () => {
                navigation.navigate("History", {
                  amended: true
                });
              }}
            ])
          // other facilities need to check if there are any overlapping bookings
          } else {
            // to check if there are any bookings that overlap i.e. facility is booked during selected period
            var booked = false;
            // go through array of existing bookings for that facility on that day (from previous screen) and check any overlaps. if booked remains false, booking can be made
            for (let i = 0; i < existingBookings.length; i++) {
              // access the start and end date and time stored in the existing bookings - stored as seconds (Firestore timestamp format)
              const existingStart = existingBookings[i].data.startDateTime.seconds;
              const existingEnd = existingBookings[i].data.endDateTime.seconds;
              // get the start and end time that was selected  -stored as milliseconds (JavaScript Date format) hence need to divide by 1000
              const selectedStart = date.getTime() / 1000;
              const selectedEnd = dateEnd.getTime() / 1000;
              // overlaps if it doesnt end before selected start timing or doesnt start after selected end timing
              const available = (existingEnd < selectedStart) || (existingStart > selectedEnd);
              // accumulates through the existing bookings if the facility is booked
              booked = booked || !available;
            }
            // facility is booked during selected period
            if (booked) {
              // alerts user that the facility is booked during selected period
              alert("Selected time period already has a booking! Check previous page for existing bookings!");
            // facility available
            } else {
            // create booking, rest of process same as above for washing machine and dryer
              const docRef = await addDoc(collection(db, "bookings"), {
                uid: uid,
                name: name,
                hall: hall,
                block: block,
                facility: facility,
                startDateTime: date,
                endDateTime: dateEnd,
              })
              bookingID = docRef.id;
              console.log("Booking made with ID: " + bookingID);
              // return Bookings tab to Hall page
              navigation.popToTop();
              // user notified of successful booking and asked if want to add to calendar
              Alert.alert('Booking successfully made', 'Add to Calendar?', [
                // adding to calendar
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
                        const event = await createEvent(calendar);
                        console.log("event created with ID: " + event);
                        await updateDoc(doc(db, 'bookings', bookingID), {
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
                          const docRef = await updateDoc(doc(db, 'users', uid), {
                            calendarId: calendar
                          })
                          .catch(err => {
                            alert("Unable to update calendar")
                          })
                          await createEvent(calendar);
                          console.log("event recreated with ID: " + event);
                        });
                        console.log("event created with ID: " + event);
                        await updateDoc(doc(db, 'bookings', bookingID), {
                          eventID: event
                        })
                        .catch(err => {
                          alert("Unable to update calendar")
                        })
                        console.log("Event ID updated")
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