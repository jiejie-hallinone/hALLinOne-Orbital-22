import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';import LoginScreen from './screens/LoginScreen';
import BookingsScreen from './screens/BookingsScreen';
import RegisterScreen from './screens/RegisterScreen';
import HistoryScreen from './screens/HistoryScreen';
import SocialScreen from './screens/SocialScreen';
import SettingsScreen from './screens/SettingsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AfterLoginTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Bookings" component={BookingsScreen}/>
      <Tabs.Screen name="History" component={HistoryScreen} />
      <Tabs.Screen name="Social" component={SocialScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );  
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen options={{headerShown:false}} name="Bookings" component={AfterLoginTabs} />
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
