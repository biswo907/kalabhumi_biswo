import 'react-native-gesture-handler';
import React from 'react';
import AppNavigator from './src/AppNavigator';
// import {store} from './src/redux/store';
// import {Provider} from 'react-redux';
import SyncStorage from 'sync-storage';
import {AuthProvider} from './src/context/AuthProvider';
import Splash from './src/Screens/Splash';
export default function App() {
  const [showSplash, setShowSplash] = React.useState(true);
  const initializeAsyncStorage = async () => {
    const data = await SyncStorage.init();
    // console.log('AsyncStorage is ready!', data);
  };
  React.useEffect(() => {
    initializeAsyncStorage();
  }, []);
  React.useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 3000); // milliseconds
  }, []);
  return (
    <AuthProvider>{showSplash ? <Splash /> : <AppNavigator />}</AuthProvider>
  );
}
