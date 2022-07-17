import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native'

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
            console.log(booked);
          }
         
        }
        if (booked) {
          alert("Selected time period already has a booking! Check previous page for existing bookings!");
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
            // user notified of successful booking and brought back to main page
            alert("Booking successfully updated")
            navigation.navigate("Bookings", {amended: amended})
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