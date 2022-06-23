import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, {useState} from 'react'
import { auth, db } from '../../Firebase/Firebase';
import { doc, addDoc, collection } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import KeyboardAvoidingView from 'react-native/Libraries/Components/Keyboard/KeyboardAvoidingView'


// here users can create their own jio to be posted
// yet to be implemented
const PostScreen = ({route, navigation}) => {
  // obtaining hall, block and level
  const {hall, block, level, name} = route.params;

  // privacy picker states (value, visibility)
  const [privacy, setPrivacy] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);

  // data fields
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // date time fields
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

  // updates start date and time when changed
  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  }

  // updates end date and time when changed
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDateEnd(currentDate);
  }

  // toggles mode and visibility for start picker
  const showModeStart = (currentMode) => {
    setShowPrivacy(false);
    setShowEnd(false);
    setShowStart(true);
    setMode(currentMode);
  }

  // toggles mode and visibility for end picker
  const showModeEnd = (currentMode) => {
    setShowPrivacy(false);
    setShowStart(false);
    setShowEnd(true);
    setMode(currentMode);
  }

  // toggles mode and visibility for privacy picker
  const showModePrivacy = () => {
    setShowPrivacy(true);
    setShowStart(false);
    setShowEnd(false);
  }


  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}> 
            <TextInput
              // input field to type user's desired location, which is stored as location
              placeholder="Location"
              value={location}
              onChangeText={text => setLocation(text)}
              style={styles.input}
            />

            <TextInput
              // input field to type user's desired description, which is stored as description
              placeholder="Description of jio"
              value={description}
              onChangeText={text => setDescription(text)}
              style={styles.input}
            />

            <TouchableOpacity
              // for selecting start date - shows start picker on date mode
              title='Privacy'
              onPress={showModePrivacy}
              style={styles.button}
            >
              <Text>Select Privacy Level</Text> 
            </TouchableOpacity> 
            
            {showPrivacy && (
              <Picker
              // picker to select privacy
              // appears as dropdown for android, scrolling wheel for ios
              // privacy are listed as their abbreviations to save space
               style={styles.picker}
               selectedValue={privacy}
               onValueChange={(val, index) => setPrivacy(val)}
               >
              <Picker.Item label="Open to all Halls" value="O" />
              <Picker.Item label="Hall only" value="H" />
              <Picker.Item label="Block only" value="B" />
              <Picker.Item label="Level only" value="L" />
             </Picker>
            )}

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
              console.log("privacy:" + privacy)
              console.log(name)
              console.log(hall)
              console.log(block)
              console.log(level)
              console.log(date)
              console.log(dateEnd)
              console.log(location)
              console.log(description)
                const docRef = addDoc(collection(db, "posts"), {
                privacy: privacy,
                name: name,
                hall: hall,
                block: block,
                level: level,
                startDateTime: date,
                endDateTime: dateEnd,
                location: location,
                text: description
              })
              console.log("Post made");
              // user notified of successful booking and brought back to main page
              alert("jio successfully posted")
              navigation.navigate("Feed");
            }}
              
            style={styles.confirm}
          >
            <Text style={styles.text}>Confirm Post</Text>
          </TouchableOpacity>
        </View>

    </KeyboardAvoidingView>
  )
}

export default PostScreen

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
  },
  picker: {
    width: '100%',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 2,
    borderColor: '#0782F9',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 5,
    width: '100%',
    marginBottom: 5,
  },
})