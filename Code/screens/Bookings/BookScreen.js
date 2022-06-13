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


// facility being booked
const facility = block === 'F' ? commonfac : fac;

// this screen is to fill in the details of the booking of the facility selected in previous page - date and time
const BookScreen = () => {
  const currentUser = auth.currentUser;
  const uid = currentUser.uid;
  const name = currentUser.displayName;

  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [mode, setMode] = useState('date')
  const [showStart, setShowStart] = useState(false)
  const [showEnd, setShowEnd] = useState(false)
  const [text, setText] = useState("Start Date:\nStart time:")
  const [textEnd, setTextEnd] = useState("End Date:\nEnd time:")

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fullDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fullTime = tempDate.getHours() + 'hrs ' + tempDate.getMinutes() + 'min';
    setText("Start Date: " + fullDate + '\n' + "Start Time: " + fullTime);
  }

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateEnd(currentDate);

    let tempDate = new Date(currentDate);
    let fullDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    let fullTime = tempDate.getHours() + 'hrs ' + tempDate.getMinutes() + 'min';
    setTextEnd("End Date: " + fullDate + '\n' + "End Time: " + fullTime);
  }

  const showModeStart = (currentMode) => {
    setShowEnd(false);
    setShowStart(true);
    setMode(currentMode);
  }

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
        title='Select Start Date'
        onPress={() => showModeStart('date')}
        style={styles.button}
       >
         <Text>Select Start Date </Text> 
       </TouchableOpacity> 

      <TouchableOpacity
        onPress={() => showModeStart('time')}
        style={styles.button}
      > 
        <Text>Select Start Time </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => showModeEnd('date')}
        style={styles.button}
      > 
        <Text>Select End Date </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => showModeEnd('time')}
        style={styles.button}
      > 
        <Text>Select End Time </Text>
      </TouchableOpacity>

      {showStart && (
        <DateTimePicker
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
          testID='End'
          value={dateEnd}
          mode={mode}
          is24Hour={false}
          display='default'
          onChange={onChangeEnd}
          style={styles.dtpicker}
        />
      )}

      <TouchableOpacity
        onPress={() => {
          const docRef = addDoc(collection(db, "bookings"), {
            uid: uid,
            name: name,
            hall: hallname,
            block: block,
            facility: facility,
            startDateTime: date,
            endDateTime: dateEnd,
          })
          console.log("Booking made with ID: ", docRef.id);
          navigation.navigate("Hall")
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