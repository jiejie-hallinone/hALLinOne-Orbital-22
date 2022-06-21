import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { hallname } from './BookingsScreen'
import { block } from './BlocksScreen'
import { fac } from './FacilitiesScreen'
import { commonfac } from './CommonFacilitiesScreen'
import { auth, db } from '../../Firebase/Firebase';
import { doc, addDoc, collection } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native'
import { FirebaseError } from 'firebase/app'


// facility being booked
const facility = block === 'F' ? commonfac : fac;

// this screen is to fill in the details of the booking of the facility selected in previous page - date and time
const BookScreen = () => {
  // obtains user info used to make booking
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;
  const name = currentUser.displayName;

  // to navigate
  const navigation = useNavigation();

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
  const [text, setText] = useState("Start Date:\nStart time:")
  const [textEnd, setTextEnd] = useState("End Date:\nEnd time:")

  // updates start date and time when changed
  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    // shows selected start date and time for debugging
    let tempDate = new Date(currentDate);
    let fullDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fullTime = tempDate.getHours() + 'hrs ' + tempDate.getMinutes() + 'min';
    setText("Start Date: " + fullDate + '\n' + "Start Time: " + fullTime);
  }

  // updates end date and time when changed
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateEnd(currentDate);

    // shows selected end date and time for debugging
    let tempDate = new Date(currentDate);
    let fullDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fullTime = tempDate.getHours() + 'hrs ' + tempDate.getMinutes() + 'min';
    setTextEnd("End Date: " + fullDate + '\n' + "End Time: " + fullTime);
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
        // for selecting start date - shows start picker on date mode
        title='Select Start Date'
        onPress={() => showModeStart('date')}
        style={styles.button}
       >
         <Text>Select Start Date </Text> 
       </TouchableOpacity> 

      <TouchableOpacity
      // for selecting start time - shows start picker on time mode
        onPress={() => showModeStart('time')}
        style={styles.button}
      > 
        <Text>Select Start Time </Text>
      </TouchableOpacity>

      <TouchableOpacity
      // for selecting end date - shows end picker on date mode
        onPress={() => showModeEnd('date')}
        style={styles.button}
      > 
        <Text>Select End Date </Text>
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
          try {
            const docRef = addDoc(collection(db, "bookings"), {
            uid: uid,
            name: name,
            hall: hallname,
            block: block,
            facility: facility,
            startDateTime: date,
            endDateTime: dateEnd,
          })
          console.log("Booking made");
          // user notified of successful booking and brought back to main page
          alert("Booking successfully made")
          navigation.navigate("Hall")
        } catch (FirebaseError) {
          alert("Select date and time!")
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