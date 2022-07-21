import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CalendarList } from 'react-native-calendars';

// users are brought here after selecting a facility to choose a date
// this screen shows a calendar list
const ExistingBookingsScreen = ({route, navigation}) => {
    const {hall, block, facility} = route.params;
    return (
    <View>
      <CalendarList
  // Callback which gets executed when visible months change in scroll view. Default = undefined
  // onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={4}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={4}
  // Enable or disable scrolling of calendar list
  scrollEnabled={true}
  // Enable or disable vertical scroll indicator. Default = false
  showScrollIndicator={true}
  // When certain date is selected
  onDayPress={day => {
    // bring users to see existing bookings (and make a new booking), passes the hall, block, facility and date chosen, as well as triggers a reload of the next screen
    navigation.navigate("Existing Bookings", {
        hall: hall,
        block: block,
        facility: facility,
        date: day,
        reload: true
    })
  }}
/>
    </View>
  )
}

export default ExistingBookingsScreen

const styles = StyleSheet.create({})