import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  Image,
  ImageBackground,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  BackHandler,
  Platform,
  // ToastAndroid,
} from 'react-native';
import OTPPage from '../Screens/OTPPage';
import {useDispatch} from 'react-redux';
import {loginmobile} from '../redux/features/auth/authSlice';
import Spinner from 'react-native-loading-spinner-overlay';
import {Buffer} from 'buffer';
import Video from 'react-native-video';
import videobg from '../videos/bg1.mp4';
import Animated, {
  FadeInDown,
  BounceInDown,
  withTiming,
} from 'react-native-reanimated';
const phoneInputPattern = /[6789][0-9]{9}/;
const LoginPage = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [otpCounter, setOtpCounter] = useState(60);
  const [resendOtp, setResendOtp] = useState(false);
  const [startCount, setStartCount] = useState(false);
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const [backButtonIsPressed, setBackButtonIsPressed] = useState(false);
  useEffect(() => {
    const handleBackButtonPress = () => {
      setBackButtonIsPressed(true);
      // console.log('true hela');
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
  useEffect(() => {
    if (otpCounter == 0) {
      setIsLoader(false);
    }
    startCount &&
      otpCounter > 0 &&
      setTimeout(() => {
        setOtpCounter(otpCounter - 1);
      }, 1000);
  }, [otpCounter, startCount]);

  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
  //       {
  //         text: 'Cancel',
  //         onPress: () => null,
  //         style: 'cancel',
  //       },
  //       {text: 'YES', onPress: () => BackHandler.exitApp()},
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  const validate = () => {
    if (username === '') {
      setUsernameError('Enter Mobile No.');
      return false;
    } else if (!phoneInputPattern.test(username)) {
      setUsernameError('Enter valid Indian mobile number');
    } else {
      setUsernameError('');
      return true;
    }
  };
  const handleSignin = async () => {
    // var postbase64Data = 'eyJ1c2VyTmFtZSI6Ijk2NTg3NDU2MjMifQ==';
    // const requestOptions = {
    //   method: 'POST',
    //   headers: {'Content-Type': 'text/plain'},
    //   body: postbase64Data,
    // };

    // const response = await fetch(
    //   'https://odishacraftsmuseum.odisha.gov.in/kalabhoomi/api/allowAll/generate-otp',
    //   requestOptions,
    // );
    // const data = await response.json();
    // console.log('data', data);
    setUsernameError('');
    if (validate()) {
      console.log('sign in', username);
      var postdata = {userName: username};
      var obj = JSON.stringify(postdata);
      var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
      dispatch(loginmobile(postbase64Data))
        .then(data => {
          setStartCount(true);
          setOtpCounter(60);
          if (data.payload.outcome === true) {
            setIsLoader(false);
            // Alert.alert('Success', data.payload.message);
            if (Platform.OS === 'android') {
              ToastAndroid.show(data.payload.message, ToastAndroid.SHORT);
            } else {
              AlertIOS.alert(data.payload.message);
            }
            navigation.navigate('OTPPage', {
              password: data.payload.data,
              userName: username,
            });
            setUsername('');
          } else {
            Alert.alert('Error', data.payload.message);
            setIsLoader(false);
            setResendOtp(true);
          }
        })
        .catch(error => {
          console.log('error', error);
          if (error === 'error loginmobile timeout') {
            setIsLoader(false);
            setResendOtp(true);
          }
        });
    } else {
      setIsLoader(false);
    }
  };
  return (
    <View style={styles.container}>
      {isLoader && <Spinner visible={true} color="#A4451F" />}
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
      {/* <Image
        source={require('../images/slide_banner-min.jpg')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        resizeMode="cover"
      /> */}
      <SafeAreaView style={styles.safeContainer}>
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '45%',
            paddingTop: 10,
            paddingBottom: 2,
            borderTopEndRadius: 15,
            borderTopStartRadius: 15,
            backgroundColor: 'rgba(255,255,255,0.9)',
          }}>
          <Image
            source={require('../images/logo_homesc.png')}
            resizeMode="contain"
            style={{width: 80, height: 60}}
          />
          <Text
            style={{
              color: '#a4451f',
              fontSize: 20,
              marginTop: 10,
              marginBottom: 2,
            }}>
            LOGIN
          </Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter 10 digit mobile number..."
              placeholderTextColor="#884A39"
              fontWeight="bold"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="phone-pad"
              maxLength={10}
              pattern={phoneInputPattern}
              value={username}
              onChangeText={value => {
                setUsername(value.replace(/[^0-9]/g, ''));
                setUsernameError('');
              }}
            />
          </View>
          {usernameError.length > 0 && (
            <Text
              style={{color: 'red', alignSelf: 'flex-start', marginLeft: 25}}>
              {usernameError}
            </Text>
          )}
          {startCount && otpCounter > 0 && (
            <Text style={{fontSize: 18, fontWeight: '600'}}>
              please wait for {otpCounter} seconds to try again
            </Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsLoader(true);
              handleSignin();
            }}>
            <Text style={{color: 'white', fontSize: 20}}>NEXT</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* </ImageBackground> */}
    </View>
  );
};
export default LoginPage;

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    padding: 0,
    height: 60,
    width: '90%',
    overflow: 'hidden',
  },
  safeContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#a4451f',
    paddingHorizontal: 50,
    padding: 10,
    marginVertical: 15,
    width: '90%',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonHeader: {
    backgroundColor: '#000000',
    paddingHorizontal: 50,
    padding: 10,
    marginVertical: 15,
    fontSize: 30,
    marginTop: 60,
    fontWeight: '700',
    width: '70%',
    borderRadius: 5,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  textInput: {
    width: '100%',
    borderRadius: 10,
    borderColor: '#EB8062',
    borderWidth: 2,
    height: '100%',
    fontSize: 20,
    paddingLeft: 10,
    color: '#884A39',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to bottom, #FF9800, #FF5722)',
  },
});
