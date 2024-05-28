import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
  Image,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  updateUser,
  fetchUser,
  getAllState,
} from '../redux/features/auth/authSlice';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {Buffer} from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
const ProfilePage = ({route, navigation}) => {
  const isFocused = useIsFocused();
  const {
    //Group
    token,
    mobile,
    gallerySectionId,
    description,
    groupImage,
    gallerySectionImages,
    gallerySectionName,
    galleryVideos,
    galleryAudios,
    qrCodeStr,
    gallaryHeaderName,
    //Gallary or Section
    galleryId,
    qrTypeCode,
    galleryName,
    qrCodeGallary,
    //ARTIFACT
    artifactId,
    qrCodeStrss,
  } = route.params;
  const dispatch = useDispatch();
  const [isLoader, setIsLoader] = useState(false);
  const [saveButtonHide, setSaveButtonHide] = useState('none');
  const [editButtonHide, setEditButtonHide] = useState('flex');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState('');
  // Set all variable value
  const [genderDropDown] = React.useState(['Male', 'Female', 'Other']);
  const [gender, setGender] = useState('Male');
  const [openGenderDropDown, setOpenGenderDropDown] = useState(false);
  const [citizenDropDown] = React.useState(['INDIAN', 'FOREIGNER']);
  const [isCitizen, setIsCitizen] = useState('INDIAN');
  const [openCitizenDropDown, setOpenCitizenDropDown] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState(new Date());
  const [citizen, setCitizen] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [pinzipcode, setPinzipcode] = useState('');
  const [email, setEmail] = useState('');
  const [states, setStates] = useState([]);
  const [isStates, setIsStates] = useState('');
  const [openStatesDropDown, setOpenStatesDropDown] = useState(false);
  const [selectDate, setSelectDate] = useState('');
  const [stateId, setStateId] = useState(0);
  // Error shoo all
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [pinzipcodeError, setPinzipcodeError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [dateError, setDateError] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateIdError, setStateIdError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [isCitizenError, setIsCitizenError] = useState('');
  // Edit of all box
  const [editFirstName, setEditFirstName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);
  const [editDob, setEditDob] = useState(false);
  const [editGender, setEditGender] = useState(false);
  const [editCitizen, setEditCitizen] = useState(false);
  const [editState, setEditState] = useState(false);
  const [editCountry, setEditCountry] = useState(false);
  const [editCity, setEditCity] = useState(false);
  const [editPin, setEditPin] = useState(false);
  const [editMail, setEditMail] = useState(false);

  useEffect(() => {
    alert('focused');
    if (isFocused) {
      setStates([]);
      var stId = 0;

      console.log('fetch user called', token);

      dispatch(fetchUser(token))
        .then(data => {
          if (data.payload.outcome == true) {
            var userGetProfileData = data.payload.data;
            // console.log('userProfileData', data.payload);
            setFirstName(userGetProfileData.firstName);
            setLastName(userGetProfileData.lastName);
            var firstName = '';
            if (userGetProfileData.firstName) {
              var firstName = userGetProfileData.firstName;
            }
            AsyncStorage.setItem('profileName', firstName);
            if (userGetProfileData.dob) {
              var getDate = userGetProfileData.dob;
              const array = getDate.split('-');
              var cdate = array[0];
              var cmonth = array[1];
              var cyear = array[2];
              setDate(new Date(cyear, cmonth, cdate));
            } else {
              setDate(new Date());
            }

            if (userGetProfileData.gender) {
              var selectGender = 'Male';
              if (userGetProfileData.gender == 2) {
                selectGender = 'Female';
              } else if (userGetProfileData.gender == 3) {
                selectGender = 'Other';
              }
              setGender(selectGender);
            }

            if (userGetProfileData.state) {
              setStateId(userGetProfileData.state);
              getAllStates(userGetProfileData.state);
            } else {
              console.log('aaabbb', stId);
              getAllStates(stId);
            }

            if (userGetProfileData.citizen) {
              setCitizen(userGetProfileData.citizen);
              setIsCitizen(userGetProfileData.citizen);
            }
            setCountry(userGetProfileData.country);
            setCity(userGetProfileData.city);
            if (userGetProfileData.pincode) {
              var pincodeInt = userGetProfileData.pincode.toString();
              setPinzipcode(pincodeInt);
            }
            setEmail(userGetProfileData.email);
            setUserId(userGetProfileData.userId);
          } else {
            Alert.alert('Error', data.payload.message);
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  }, [isFocused]);
  const backAction = () => {
    navigation.goBack();
    return true;
  };

  const getAllStates = stId => {
    console.log('get all state called', stId);
    dispatch(getAllState(token))
      .then(data => {
        if (data.payload.outcome == true) {
          setStates(data.payload.data);
          if (stId > 0) {
            for (let i = 0; i < data.payload.data.length; i++) {
              if (stId == data.payload.data[i].stateId) {
                setIsStates(data.payload.data[i].stateNameEn);
                break;
              }
            }
          }
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    var month = selectedDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    const formattedDate =
      selectedDate.getDate() + '-' + month + '-' + selectedDate.getFullYear();
    setSelectDate(formattedDate);
  };

  const showMode = currentMode => {
    if (Platform.OS === 'android') {
      // setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    setShow(true);
    showMode('date');
  };

  const handleUserUpdate = () => {
    console.log('handle user update called');
    if (validate()) {
      setEditButtonHide('flex');
      setSaveButtonHide('none');
      var selectGender = 1;
      if (gender == 'Female') {
        selectGender = 2;
      } else if (gender == 'Other') {
        selectGender = 3;
      }
      let day = date.getDate();
      console.log(day);

      let month = date.getMonth();
      console.log(month + 1);

      let year = date.getFullYear();
      if (day < 10) {
        day = '0' + day;
      }

      if (month < 10) {
        month = `0${month}`;
      }

      let format1 = `${day}-${month}-${year}`;
      var postdata = {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        dob: format1,
        gender: selectGender,
        citizen: isCitizen,
        country: country ? country : '',
        state: stateId ? stateId : '',
        city: city ? city : '',
        email: email,
        pincode: pinzipcode,
      };
      var obj = JSON.stringify(postdata);
      var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
      console.log('postbase64Data', postbase64Data, obj);
      dispatch(updateUser({postbase64Data, token}))
        .then(data => {
          setIsLoader(false);
          console.log('KUMAR UPDATE', data.payload);
          if (data.payload.outcome == true) {
            if (gallaryHeaderName == 'SECTION') {
              //alert(GallaryHeaderName);
              navigation.navigate('Groups', {
                token: token,
                gallerySectionId: gallerySectionId,
                description: description,
                groupImage: groupImage,
                gallerySectionImages: gallerySectionImages,
                galleryAudios: galleryAudios,
                galleryVideos: galleryVideos,
                gallerySectionName: gallerySectionName,
                qrCodeStr: qrCodeStr,
                gallaryHeaderName: gallaryHeaderName,
              });
              //alert('ok');
            } else if (
              gallaryHeaderName == 'GALLERY' ||
              gallaryHeaderName == 'GALLERY_ARTIFACT'
            ) {
              navigation.navigate('Gallery', {
                token: token,
                galleryId: galleryId,
                description: description,
                qrTypeCode: qrTypeCode,
                groupImage: groupImage,
                gallerySectionImages: gallerySectionImages,
                galleryName: galleryName,
                galleryAudios: galleryAudios,
                galleryVideos: galleryVideos,
                qrCodeGallary: qrCodeGallary,
                gallaryHeaderName: gallaryHeaderName,
              });
            } else if (gallaryHeaderName == 'ARTIFACT') {
              navigation.navigate('Artifact', {
                token: token,
                artifactId: artifactId,
                qrCodeStrss: qrCodeStrss,
                gallaryHeaderName: gallaryHeaderName,
              });
            } else {
              navigation.navigate('MainScreen');
            }
            //Alert.alert('Success', data.payload.message);
          } else {
            Alert.alert('Error', data.payload.message);
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    } else {
      setIsLoader(false);
    }
  };

  const editProfile = () => {
    setEditButtonHide('none');
    setSaveButtonHide('flex');
    setEditFirstName(true);
    setEditLastName(true);
    setEditDob(true);
    setEditGender(true);
    setEditCitizen(true);
    setEditState(true);
    setEditCountry(true);
    setEditCity(true);
    setEditPin(true);
    setEditMail(true);
  };

  const validate = () => {
    if (firstName == '' || firstName === null) {
      setFirstNameError('First name is required');
      return false;
    } else {
      setFirstNameError('');
    }

    if (lastName == '' || lastName === null) {
      setLastNameError('Last name is required');
      return false;
    } else {
      setLastNameError('');
    }

    if (gender == '' || gender === null) {
      setGenderError('Gender is required');
      return false;
    } else {
      setGenderError('');
    }
    if (isCitizen == '' || isCitizen === null) {
      setIsCitizenError('Citizen is required');
      return false;
    } else {
      setIsCitizenError('');
    }

    if (!stateId && isCitizen == 'INDIAN') {
      setStateIdError('State is required');
      return false;
    } else {
      setStateIdError('');
    }

    if ((country == '' || country === null) && isCitizen == 'FOREIGNER') {
      setCountryError('Country is required');
      return false;
    } else {
      setCountryError('');
    }

    if ((city == '' || city === null) && isCitizen == 'INDIAN') {
      setCityError('City is required');
      return false;
    } else {
      setCityError('');
    }

    // if (pinzipcode == '' || pinzipcode === null) {
    //   setPinzipcodeError('Pincode is required');
    //   return false;
    // } else {
    //   setPinzipcodeError('');
    // }

    let regPincode = /^[1-9][0-9]{5}$/;
    if (pinzipcode == '' || pinzipcode === null) {
      setPinzipcodeError('Pincode is required');
      return false;
    } else if (regPincode.test(pinzipcode) === false && isCitizen == 'INDIAN') {
      setPinzipcodeError('Pincode is not correct');
      return false;
    } else {
      setPinzipcodeError('');
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (email == '' || email === null) {
      setEmailError('Email is required');
      return false;
    } else if (reg.test(email) === false) {
      setEmailError('Email is not correct');
      return false;
    } else {
      setEmailError('');
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {isLoader && <Spinner visible={true} color="#A4451F" />}
        <ImageBackground
          source={require('../images/background_home.jpg')}
          size="cover"
          style={styles.backgroundImage}>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <View
              style={{
                flexDirection: 'column',
                marginVertical: 10,
                alignItems: 'flex-start',
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('HomeScreen')}>
                <MaterialIcons
                  name="keyboard-backspace"
                  color="#000"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'column',
                width: '60%',
              }}>
              <Text style={styles.textTitle}> My Profile</Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                width: '16%',
              }}>
              <TouchableOpacity
                style={{...styles.button, display: editButtonHide}}
                onPress={() => {
                  editProfile();
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '700',
                    alignSelf: 'center',
                    alignItems: 'center',
                  }}>
                  Edit
                  <MaterialIcons name="edit" color="#fff" size={16} />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.TextViewStylefullprofile}>
            <View style={{flex: 1}}>
              <ScrollView>
                <View style={styles.MainContainer}>
                  <View style={styles.TextViewStyle}>
                    <TextInput
                      style={styles.TextStyle}
                      placeholder="First Name"
                      keyboardType="text"
                      value={firstName}
                      editable={editFirstName}
                      onChangeText={e => {
                        setFirstName(e);
                      }}
                    />
                  </View>
                  {firstNameError.length > 0 && (
                    <Text style={styles.errorText}>{firstNameError}</Text>
                  )}
                  <View style={styles.TextViewStyle}>
                    <TextInput
                      style={styles.TextStyle}
                      placeholder="Last Name"
                      keyboardType="text"
                      value={lastName}
                      editable={editLastName}
                      onChangeText={e => {
                        setLastName(e);
                      }}
                    />
                  </View>
                  {lastNameError.length > 0 && (
                    <Text style={styles.errorText}>{lastNameError}</Text>
                  )}
                  <View style={styles.TextViewStyle}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}>
                        <TextInput
                          style={styles.TextStyle}
                          placeholder="DOB"
                          keyboardType="text"
                          editable={editDob}
                          value={date.toLocaleDateString()}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          marginLeft: 'auto',
                          paddingRight: 3,
                          marginTop: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            if (editDob) {
                              setShow(true);
                              showDatepicker();
                            }
                          }}>
                          <MaterialIcons
                            name="calendar-today"
                            color="#d1d1d1"
                            size={20}
                            style={{alignSelf: 'flex-end'}}
                          />
                          <Text>Date of Birth</Text>
                        </TouchableOpacity>
                        {show ? (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                            maximumDate={new Date(Date.now() - 86400000)}
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>
                  {dateError.length > 0 && (
                    <Text style={styles.errorText}>{dateError}</Text>
                  )}
                  <View style={styles.TextViewStyle}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        padding: 2,
                        margin: 6,
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          textAlign: 'flex-start',
                        }}>
                        {gender && (
                          <Text
                            style={{
                              textAlign: 'left',
                              width: '100%',
                              color: '#000',
                            }}>
                            {gender}
                          </Text>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          textAlign: 'flex-end',
                          width: '85%',
                          padding: 2,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            if (editGender) {
                              setOpenGenderDropDown(!openGenderDropDown);
                            }
                          }}>
                          <MaterialIcons
                            name="keyboard-arrow-down"
                            color="#000000"
                            size={20}
                            style={{alignSelf: 'flex-end'}}
                          />
                        </TouchableOpacity>
                        {openGenderDropDown &&
                          genderDropDown &&
                          genderDropDown.length > 0 &&
                          genderDropDown.map(item => {
                            return (
                              <TouchableOpacity
                                key={item}
                                onPress={() => {
                                  setGender(item);
                                  setOpenGenderDropDown(false);
                                }}
                                style={{
                                  padding: 10,
                                  borderWidth: 1,
                                  borderColor: '#c6c6c6',
                                }}>
                                <Text
                                  style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    color: '#000',
                                  }}>
                                  {item}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    </View>
                  </View>
                  {genderError.length > 0 && (
                    <Text style={styles.errorText}>{genderError}</Text>
                  )}
                  <View style={styles.TextViewStyle}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        padding: 2,
                        margin: 6,
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          textAlign: 'flex-start',
                        }}>
                        {isCitizen && (
                          <Text
                            style={{
                              textAlign: 'left',
                              width: '100%',
                              color: '#000',
                            }}>
                            {isCitizen}
                          </Text>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          textAlign: 'flex-end',
                          width: '70%',
                          padding: 2,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            if (editCitizen) {
                              setOpenCitizenDropDown(!openCitizenDropDown);
                            }
                          }}>
                          <MaterialIcons
                            name="keyboard-arrow-down"
                            color="#000000"
                            size={20}
                            style={{alignSelf: 'flex-end'}}
                          />
                        </TouchableOpacity>
                        {openCitizenDropDown &&
                          citizenDropDown &&
                          citizenDropDown.length > 0 &&
                          citizenDropDown.map(item => {
                            return (
                              <TouchableOpacity
                                key={item}
                                onPress={() => {
                                  setIsCitizen(item);
                                  setOpenCitizenDropDown(false);
                                }}
                                style={{
                                  padding: 10,
                                  borderWidth: 1,
                                  borderColor: '#c6c6c6',
                                }}>
                                <Text
                                  style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    color: '#000',
                                  }}>
                                  {item}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                      </View>
                    </View>
                  </View>
                  {isCitizenError.length > 0 && (
                    <Text style={styles.errorText}>{isCitizenError}</Text>
                  )}
                  {isCitizen == 'FOREIGNER' && (
                    <View style={styles.TextViewStyle}>
                      <TextInput
                        style={styles.TextStyle}
                        placeholder="Country"
                        keyboardType="text"
                        editable={editCountry}
                        value={country}
                        onChangeText={e => {
                          setCountry(e);
                        }}
                      />
                    </View>
                  )}
                  {countryError.length > 0 && (
                    <Text style={styles.errorText}>{countryError}</Text>
                  )}
                  {isCitizen == 'INDIAN' && (
                    <>
                      <View style={styles.TextViewStyle}>
                        <TouchableOpacity
                          onPress={() => {
                            if (editState) {
                              setOpenStatesDropDown(!openStatesDropDown);
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: 10,
                          }}>
                          {isStates ? (
                            <Text style={{color: '#000'}}>{isStates}</Text>
                          ) : (
                            <Text style={{color: '#000'}}>Select State</Text>
                          )}
                        </TouchableOpacity>

                        {openStatesDropDown ? (
                          <ScrollView
                            nestedScrollEnabled={true}
                            style={{
                              maxHeight: 130,
                              overflow: 'scroll',
                            }}>
                            {states &&
                              states.map(item => {
                                return (
                                  <TouchableOpacity
                                    key={item.stateId}
                                    onPress={() => {
                                      setIsStates(item.stateNameEn);
                                      setOpenStatesDropDown(false);
                                      setStateId(item.stateId);
                                    }}
                                    style={{
                                      borderWidth: 1,
                                      padding: 10,
                                      borderColor: '#c6c6c6',
                                    }}>
                                    <Text style={{color: '#000'}}>
                                      {item.stateNameEn}
                                    </Text>
                                  </TouchableOpacity>
                                );
                              })}
                          </ScrollView>
                        ) : null}
                      </View>
                      {stateIdError.length > 0 && (
                        <Text style={styles.errorText}>{stateIdError}</Text>
                      )}
                      <View style={styles.TextViewStyle}>
                        <TextInput
                          style={styles.TextStyle}
                          placeholder="City"
                          keyboardType="text"
                          value={city}
                          editable={editCity}
                          onChangeText={e => {
                            setCity(e);
                          }}
                        />
                      </View>
                      {cityError.length > 0 && (
                        <Text style={styles.errorText}>{cityError}</Text>
                      )}
                    </>
                  )}
                  <View style={styles.TextViewStyle}>
                    <TextInput
                      style={styles.TextStyle}
                      placeholder="Pin/Zip Code"
                      keyboardType="numeric"
                      maxLength={6}
                      value={pinzipcode}
                      editable={editPin}
                      onChangeText={e => {
                        setPinzipcode(e);
                      }}
                    />
                  </View>
                  {pinzipcodeError.length > 0 && (
                    <Text style={styles.errorText}>{pinzipcodeError}</Text>
                  )}
                  <View style={styles.TextViewStyle}>
                    <TextInput
                      style={styles.TextStyle}
                      placeholder="Email"
                      keyboardType="email"
                      editable={editMail}
                      value={email}
                      onChangeText={e => {
                        setEmail(e);
                      }}
                    />
                  </View>
                  {emailError.length > 0 && (
                    <Text style={styles.errorText}>{emailError}</Text>
                  )}
                  <View style={styles.TextViewStyle}>
                    <TextInput
                      style={styles.textInputDiabled}
                      placeholder="Mobile No."
                      editable={false}
                      value={mobile}
                    />
                  </View>
                  <TouchableOpacity
                    style={{...styles.buttonsave, display: saveButtonHide}}
                    onPress={() => {
                      setIsLoader(true);
                      handleUserUpdate();
                    }}>
                    <Text style={{color: 'white'}}>Save</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};
export default ProfilePage;

const styles = StyleSheet.create({
  errorText: {
    color: '#fff',
    fontSize: 14,
    color: 'red',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'sans-serif',
    marginLeft: 35,
    padding: 5,
    marginBottom: 5,
  },
  safeContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 50,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 5,
    paddingVertical: 10,
    marginBottom: 10,
    marginTop: 5,
  },

  textTitle: {
    display: 'flex',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    padding: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#AE4D26',
    padding: 5,
    width: '100%',
    alignSelf: 'center',
    marginLeft: 30,
    marginTop: 5,
    borderRadius: 100,
  },

  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  TextViewStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#838383',
    width: '90%',
    marginTop: 10,
    backgroundColor: '#ffffff',
  },

  TextStyle: {
    textAlign: 'left',
    color: '#000',
    fontSize: 15,
    padding: 5,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  buttonsave: {
    backgroundColor: '#a4451f',
    paddingHorizontal: 50,
    padding: 10,
    marginVertical: 15,
    width: '70%',
    borderRadius: 5,
    alignItems: 'center',
  },
  TextViewStylefullprofile: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#d1d1d1',
    width: '95%',
    marginLeft: 10,
    height: '100%',
    flex: 1,
  },
  textInputDiabled: {
    borderColor: '#f5f5f5',
    borderBottomColor: '#f5f5f5',
    backgroundColor: '#f5f5f5',
  },
});
