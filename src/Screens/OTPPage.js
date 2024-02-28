import React, {useRef, useState, useEffect} from 'react';
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
  BackHandler,
  ToastAndroid,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import videobg from '../videos/bg1.mp4';
import Animated, {
  FadeInDown,
  BounceInDown,
  withTiming,
} from 'react-native-reanimated';
import {
  OTPInputContainer,
  SplitOTPBoxesContainer,
  TextInputHidden,
  SplitBoxes,
  SplitBoxText,
  SplitBoxesFocused,
} from './OtpStyle';
import {authenticateOTP} from '../services/Services';
// import {useDispatch} from 'react-redux';
// import {login} from '../redux/features/auth/authSlice';
import {Buffer} from 'buffer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {useAuthorization} from '../context/AuthProvider';
import {setUser, setLoginTime} from '../context/async-storage';
const OTPPage = ({route, navigation}) => {
  const isFocused = useIsFocused();
  const [isLoader, setIsLoader] = useState(false);
  const {signIn} = useAuthorization();
  const inputRef = useRef();
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('LoginPage');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const {password, userName} = route.params;
  const [code, setCode] = useState('');
  const [isPinReady, setIsPinReady] = useState(false);
  const maximumLength = 4;

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const validate = () => {
    if (code.length === 0) {
      setOtpError('Enter OTP');
      return false;
    } else {
      setOtpError('');
    }
    return true;
  };
  const handleOTP = () => {
    setOtpError('');
    if (validate()) {
      console.log('sign in', userName);
      var postdata = {
        userName: userName,
        password: code,
        captcha: '',
        isOtp: 'true',
      };
      var obj = JSON.stringify(postdata);
      var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
      authenticateOTP(postbase64Data)
        .then(data => {
          setIsLoader(false);
          console.log('sign in', data);
          if (data.outcome === true) {
            signIn(data.data);
            setUser(userName);
            setLoginTime(new Date().toString());
            // AsyncStorage.setItem('userToken', data.payload.data);
            // AsyncStorage.setItem('userMobile', userName);
            // AsyncStorage.setItem('loginTime', new Date().toString());
            //Alert.alert('Success', data.payload.message);
            if (Platform.OS === 'android') {
              ToastAndroid.show(data.message, ToastAndroid.SHORT);
            } else {
              Alert.alert(data.message);
            }
            navigation.navigate('Home');
          } else {
            setCode('');
            setOtpError(data.message);
            setIsInputBoxFocused(true);
            // Platform.OS === 'ios'
            //   ? inputRef.current.focus()
            //   : setTimeout(() => inputRef.current.focus(), 40);
          }
        })
        .catch(error => {
          //navigation.replace("Login");
          console.log('error', error);
        });
    } else {
      setIsLoader(false);
    }
  };

  const boxArray = new Array(maximumLength).fill(0);

  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

  const handleOnPress = () => {
    inputRef.current.focus();
    setIsInputBoxFocused(true);
    // Platform.OS === 'ios'
    //   ? inputRef.current.focus()
    //   : setTimeout(() => inputRef.current.focus(), 40);
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  useEffect(() => {
    // update pin ready status
    setIsPinReady(code.length === maximumLength);
    // clean up function
    return () => {
      setIsPinReady(false);
    };
  }, [code]);
  const boxDigit = (_, index) => {
    const emptyInput = '';
    const digit = code[index] || emptyInput;

    const isCurrentValue = index === code.length;
    const isLastValue = index === maximumLength - 1;
    const isCodeComplete = code.length === maximumLength;

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

    const StyledSplitBoxes =
      isInputBoxFocused && isValueFocused ? SplitBoxesFocused : SplitBoxes;
    return (
      <StyledSplitBoxes key={index}>
        <SplitBoxText>{digit}</SplitBoxText>
      </StyledSplitBoxes>
    );
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
      <SafeAreaView style={styles.safeContainer}>
        {/* <View style={{alignItems: 'center'}}>
          <Image
            source={require('../images/logo_large.png')}
            style={{width: 120, height: 120}}
          />
        </View> */}
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
            style={{width: 80, height: 80}}
          />
          <Text
            style={{
              color: '#a4451f',
              fontSize: 20,
              marginTop: 5,
              marginBottom: 2,
            }}>
            Enter OTP
          </Text>
          <TextInput
            value={code}
            onChangeText={text => setCode(text)}
            maxLength={maximumLength}
            keyboardType="numeric"
            autoFocus={true}
            style={{
              backgroundColor: '#e5e5e5',
              width: '50%',
              borderColor: '#a4451f',
              borderWidth: 2,
              borderRadius: 15,
              marginVertical: 20,
              textAlign: 'center',
              fontSize: 20,
              letterSpacing: 20,
              fontWeight: '700',
            }}
          />
          {otpError.length > 0 && (
            <Text style={{...styles.errorText, color: '#a4451f'}}>
              {otpError}
            </Text>
          )}
          <TouchableOpacity
            style={styles.button}
            // disabled={!isPinReady}
            onPress={() => {
              setIsLoader(true);
              handleOTP();
            }}>
            <Text style={{color: 'white'}}>Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* </ImageBackground> */}
    </View>
  );
};
export default OTPPage;

const styles = StyleSheet.create({
  inputBox: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
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
    width: '70%',
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
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  textInput: {
    marginLeft: 5,
    width: '100%',
  },
});
