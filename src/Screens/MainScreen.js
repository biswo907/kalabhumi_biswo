import {createDrawerNavigator} from '@react-navigation/drawer';
import {TabRouter} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, BackHandler, Alert} from 'react-native';
import SidebarScreen from './SidebarScreen';
import HomeScreen from './HomeScreen';
const Drawer = createDrawerNavigator();
const MainScreen = () => {
  useEffect(() => {
    const handleBackButtonPress = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    // Register the back button handler
    const backButton = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );

    // Unregister the back button handler when the component unmounts
    return () => {
      backButton.remove();
    };
  }, []);
  return (
    <Drawer.Navigator drawerContent={props => <SidebarScreen {...props} />}>
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};
export default MainScreen;
