import React, {useEffect, useState} from 'react';
import {View, Text, Image, FlatList, Linking} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
// import {logout, fetchUser} from '../redux/features/auth/authSlice';
// import {useSelector, useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {useAuthorization} from '../context/AuthProvider';
import {getToken} from '../context/async-storage';
const SidebarScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const {signOut} = useAuthorization();
  const [userToken, setUserToken] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [userData, setUserData] = useState({});
  //const token_data = useSelector(state => state.auth.login);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   if (isFocused) {
  //     AsyncStorage.getItem('userToken')
  //       .then(token => {
  //         setUserToken(token);
  //       })
  //       .then(res => {});

  //     AsyncStorage.getItem('userMobile')
  //       .then(mobile => {
  //         setUserMobile(mobile);
  //       })
  //       .then(res => {});
  //   }
  // }, [isFocused]);
  // useEffect(() => {
  //   if (isFocused) {
  //     dispatch(fetchUser(userToken)).then(data => {
  //       if (data.payload.outcome == true) {
  //         var userGetProfileData = data.payload.data;
  //         // console.log('userProfileData', data.payload.data);
  //         setUserData(data.payload.data);
  //       }
  //     });
  //   }
  // }, [isFocused, userToken]);

  const handleLogout = () => {
    // const token = getToken();
    // console.log(token);
    signOut();
    navigation.navigate('LoginPage');
    // AsyncStorage.getItem('userToken')
    //   .then(token => {
    //     dispatch(logout(token));
    //     AsyncStorage.clear();
    //   })
    //   .then(res => {});
    // navigation.navigate('LoginPage');
  };

  const handleUserProfile = () => {
    navigation.navigate('ProfilePage', {
      token: userToken,
      mobile: userMobile,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#2E2E2E', paddingTop: 50}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
          padding: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
          }}>
          <Icon name="user" size={40} color="#B95228" />
          <View
            style={{flexDirection: 'column', marginLeft: 10, marginTop: 15}}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#ffffff',
              }}>
              {Object.entries(userData).length > 0 && userData.firstName
                ? 'My Profile'
                : 'Join Us'}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                alignSelf: 'flex-start',
                color: '#ffffff',
              }}>
              {Object.entries(userData).length > 0 && userData.firstName
                ? userData.firstName + ' ' + userData.lastName
                : 'Visitor'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleUserProfile();
          }}>
          <Icon name="chevron-right" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, height: 1, backgroundColor: '#666666'}}></View>
        </View>
      </View>
      <View style={{marginTop: 20, marginLeft: 15}}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(
              'https://www.asteroommls.com/pviewer?hideleadgen=1&token=V0HbCLlJ9EeBmYyc-SwfmQ',
            );
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="panorama-variant"
              color="#fff"
              size={15}
            />
            <Text style={{marginLeft: 15, color: '#fff'}}>Virtual Tour</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 20, marginLeft: 15}}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://odishacraftsmuseum.odisha.gov.in/');
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons name="web" color="#fff" size={15} />
            <Text style={{marginLeft: 15, color: '#fff'}}>
              Official Website
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 20, marginLeft: 15}}>
        <TouchableOpacity onPress={handleLogout}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons name="logout" color="#fff" size={15} />
            <Text style={{marginLeft: 15, color: '#fff'}}>Log out</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 20, marginLeft: 15}}>
        {/* <TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="map-marker-alert"
              color="#fff"
              size={15}
            />
            <Text style={{marginLeft: 15, color: '#fff'}}>Attendance</Text>
          </View>
        </TouchableOpacity> */}
      </View>

      <View style={{marginTop: 20, marginLeft: 15}}>
        {/* <TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons name="line-scan" color="#fff" size={15} />
            <Text style={{marginLeft: 15, color: '#fff'}}>Ticket Scanner</Text>
          </View>
        </TouchableOpacity> */}
      </View>

      <View style={{marginTop: 370}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, height: 1, backgroundColor: '#666666'}}></View>
        </View>
      </View>

      <View style={{marginTop: 20, marginLeft: 15}}>
        <Text style={{color: '#FFFFFF', fontSize: 12}}>
          All rights reserved ©
        </Text>
        <Text style={{color: '#FFFFFF', fontSize: 12}}>
          Handlooms, Textiles & Handicrafts Department,
        </Text>
        <Text style={{color: '#FFFFFF', fontSize: 12}}>
          Government of Odisha
        </Text>
        <Text style={{color: '#FFFFFF', fontSize: 12}}>App Version: 1.04</Text>
        {/* <TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialCommunityIcons
              name="contacts-outline"
              color="#fff"
              size={15}
            />
            <Text style={{marginLeft: 15, color: '#fff'}}>Contact Us</Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};
export default SidebarScreen;
