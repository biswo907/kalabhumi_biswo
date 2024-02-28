import React, {useEffect} from 'react';
import {View, Text, Image, Dimensions, StatusBar} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
// import {useDispatch} from 'react-redux';
// import {logout} from '../redux/features/auth/authSlice';
import Video from 'react-native-video';
import videobg from '../videos/bg13.mp4';
import Animated, {
  FadeInDown,
  BounceInDown,
  withTiming,
} from 'react-native-reanimated';
const Splash = ({navigation}) => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   AsyncStorage.getItem('userToken')
  //     .then(token => {
  //       console.log('token-------------------', token);
  //       if (token !== null && token != '') {
  //         const decoded = jwtDecode(token);
  //         console.log('decoded--------------', decoded);
  //         let unixTimestampEnd = decoded.exp;
  //         let dateEnd = new Date(unixTimestampEnd * 1000) * 60000;
  //         if (Date.now() >= dateEnd) {
  //           handleLogout(token);
  //         } else {
  //           setTimeout(() => {
  //             navigation.navigate('MainScreen');
  //           }, 5000);
  //           navigation.closeDrawer();
  //         }
  //       } else {
  //         setTimeout(() => {
  //           navigation.navigate('LoginPage');
  //         }, 5000);
  //       }
  //     })
  //     .then(res => {});
  // }, []);
  // const handleLogout = token => {
  //   dispatch(logout(token));
  //   AsyncStorage.clear();
  //   navigation.navigate('LoginPage');
  // };

  return (
    <>
      <StatusBar
        animated={true}
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        <Video
          source={videobg}
          repeat={true}
          paused={false}
          playInBackground
          resizeMode="cover"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
        <Image
          source={require('../images/bg2-min.jpg')}
          resizeMode="cover"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.3,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            // backgroundColor: 'rgba(255,255,255,0.1)',
          }}></View>
        <Animated.View
          entering={BounceInDown.duration(2000).delay(500)}
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: (Dimensions.get('window').width - 80) / 2,
            width: Dimensions.get('window').width - 80,
            height: Dimensions.get('window').width - 80,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 5,
              height: 5,
            },
            shadowOpacity: 0.8,
            elevation: 5,
          }}>
          <Image
            source={require('../images/logo_homesc.png')}
            style={{
              width: 200,
              height: 200,
            }}
            resizeMode="contain"
          />
          <Text style={{fontSize: 18, fontWeight: '600', color: '#AE4D26'}}>
            Audio Guide Tour
          </Text>
        </Animated.View>
      </View>
    </>
  );
};
export default Splash;
