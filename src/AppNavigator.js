import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import Splash from './Screens/Splash';
import SplashStatus from './Screens/SplashStatus';
import LoginPage from './Screens/LoginPage';
import OTPPage from './Screens/OTPPage';
import MainScreen from './Screens/MainScreen';
import ScannerPage from './Screens/ScannerPage';
import Artifact from './Screens/Artifact';
import Groups from './Screens/Groups';
import Gallery from './Screens/Gallery';
import ProfilePage from './Screens/ProfilePage';
import TestAlertRa from './Screens/TestAlertRa';
const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="SplashStatus"
          component={SplashStatus}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="OTPPage"
          component={OTPPage}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="ScannerPage"
          component={ScannerPage}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="Artifact"
          component={Artifact}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="Groups"
          component={Groups}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="Gallery"
          component={Gallery}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="ProfilePage"
          component={ProfilePage}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="TestAlertRa"
          component={TestAlertRa}
          options={{headerShown: false}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
