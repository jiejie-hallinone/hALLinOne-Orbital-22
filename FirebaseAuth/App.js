import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/Authentication/LoginScreen';
import BookingsScreen from './screens/Bookings/BookingsScreen';
import RegisterScreen from './screens/Authentication/RegisterScreen';
import HistoryScreen from './screens/History/HistoryScreen';
import SocialScreen from './screens/Social/SocialScreen';
import SettingsScreen from './screens/Settings/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FirstTimeSetupScreen from './screens/Authentication/FirstTimeSetupScreen';
import BlocksScreen from './screens/Bookings/BlocksScreen';
import FacilitiesScreen from './screens/Bookings/FacilitiesScreen';
import AmendScreen from './screens/History/AmendScreen';
import PostScreen from './screens/Social/PostScreen';
import ProfileScreen from './screens/Settings/ProfileScreen';
import BookScreen from './screens/Bookings/BookScreen';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const BookingsStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();
const SocialStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

function BookingTab() {
  return (
    <BookingsStack.Navigator>
      <BookingsStack.Screen name="Select Hall" component={BookingsScreen}/>
      <BookingsStack.Screen name="Select Block" component={BlocksScreen}/>
      <BookingsStack.Screen name="Select Facilities" component={FacilitiesScreen}/>
      <BookingsStack.Screen name="Book" component={BookScreen}/>
    </BookingsStack.Navigator>
  );
}

function HistoryTab() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen name="Existing Bookings" component={HistoryScreen}/>
      <HistoryStack.Screen name="Amend Booking" component={AmendScreen}/>
    </HistoryStack.Navigator>
  );
}

function SocialTab() {
  return (
    <SocialStack.Navigator>
      <SocialStack.Screen name="Feed" component={SocialScreen}/>
      <SocialStack.Screen name="Post" component={PostScreen}/>
    </SocialStack.Navigator>
  );
}

function SettingsTab() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings Menu" component={SettingsScreen}/>
      <SettingsStack.Screen name="Profile" component={ProfileScreen}/>
    </SettingsStack.Navigator>
  );
}

function AfterLoginTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen options={{ headerShown: false }} name="Bookings" component={BookingTab}/>
      <Tabs.Screen options={{ headerShown: false }} name="History" component={HistoryTab} />
      <Tabs.Screen options={{ headerShown: false }} name="Social" component={SocialTab} />
      <Tabs.Screen options={{ headerShown: false }} name="Settings" component={SettingsTab} />
    </Tabs.Navigator>
  );  
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen options={{headerShown:false}} name="FirstTimeSetupScreen" component={FirstTimeSetupScreen} />
        <Stack.Screen options={{headerShown:false}} name="AfterLogin" component={AfterLoginTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
