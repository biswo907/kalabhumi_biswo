import React, {useState, useEffect, useCallback} from 'react';
import {
  TouchableOpacity,
  Text,
  Linking,
  View,
  Image,
  ImageBackground,
  BackHandler,
  ScrollView,
  TextInput,
  Alert,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import styles from './scanStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  fetchSectionData,
  fetchRatingDataByQrcode,
} from '../redux/features/qrcode/qrcodeSlice';
import {Buffer} from 'buffer';
import {useSelector, useDispatch} from 'react-redux';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {useIsFocused} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import Slideshow from 'react-native-image-slider-show';
import {APIURL} from '../constants/resource.jsx';
import YoutubePlayer from 'react-native-youtube-iframe';
import {saveReview, fetchUser} from '../redux/features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
const imageBaseUrl = APIURL.imageBaseUrl;

const TestAlertRa = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [scan, setScan] = useState('');
  const [ratingList, setRatingList] = useState([]);
  const [comments, setComments] = useState('');
  const [userProfileName, setUserProfileName] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [isReviewBtn, setIsReviewBtn] = useState('none');
  const [ratingStar, setRatingStar] = useState('');
  const isFocused = useIsFocused();
  const {token} = route.params;
  const [commentsError, setCommentsError] = useState('');
  const [ratingStarError, setRatingStarError] = useState('');
  const [profileNameError, setProfileNameError] = useState('');
  const [defaultRating, setDefaultRating] = useState('');
  const ratingCompleted = rating => {
    setRatingStar(rating);
    console.log('Rating is: ' + rating);
  };

  const checkTextInput = () => {
    //Check for the Name TextInput
    if (!userProfileName) {
      navigation.navigate('ProfilePage', {
        token: userToken,
      });
    }
  };
  const handleSaveReviewGroup = () => {
    if (validateGroup()) {
      var postdata = {
        publicName: userProfileName,
        publicComment: comments,
        star: ratingStar,
        qrCode: qrCodeStr,
      };
      var obj = JSON.stringify(postdata);
      var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
      console.log('PURI>>>>>>>>>...', postbase64Data);
      dispatch(saveReview({postbase64Data, token}))
        .then(data => {
          if (data.payload.outcome == true) {
            Alert.alert('Success', data.payload.message);
            handleRatingCallGroup();
            setIsReviewBtn('none');
            setComments('');
            setDefaultRating(0);
          } else {
            Alert.alert('Error', data.payload.message);
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  };
  const handleRatingCallGroup = () => {
    //Rating List
    // var postdata = {qrCode: qrCodeStr};

    var obj = JSON.stringify('eyJxckNvZGUiOiAiTTc4SFpFWVUifQ==');
    var postbase64Data = 'eyJxckNvZGUiOiAiTTc4SFpFWVUifQ==';
    dispatch(fetchRatingDataByQrcode({postbase64Data, token}))
      .then(data => {
        console.log('fetchRatingDataByQrcode..', data.payload.data);
        if (data.payload.outcome == true) {
          setRatingList(data.payload.data);
        } else {
          Alert.alert('Error', data.payload.message);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const validateGroup = () => {
    if (comments == '' || comments === null) {
      setCommentsError('Comment is required');
      return false;
    } else {
      setCommentsError('');
    }

    if (ratingStar.length == 0 || ratingStar == '' || ratingStar === null) {
      setRatingStarError('Rating  is required');
      return false;
    } else {
      setRatingStarError('');
    }

    if (userProfileName == '' || userProfileName === null) {
      setProfileNameError('Name  is required');
      return false;
    } else {
      setProfileNameError('');
    }

    return true;
  };

  const handleFetchUserDetails = () => {
    dispatch(fetchUser(token))
      .then(data => {
        if (data.payload.outcome == true) {
          var userGetProfileData = data.payload.data;
          console.log('RRRRRRRRRRRRRRRRRRRRRR', userGetProfileData.firstName);
          setUserProfileName(userGetProfileData.firstName);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  useEffect(() => {
    if (isFocused) {
      handleFetchUserDetails();
      setRatingList([]);
      handleRatingCallGroup();
      AsyncStorage.getItem('userToken')
        .then(token => {
          setUserToken(token);
        })
        .then(res => {});

      AsyncStorage.getItem('userMobile')
        .then(mobile => {
          setUserMobile(mobile);
        })
        .then(res => {});
    }
  }, [isFocused]);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          backgroundColor: '#fff',
        }}>
        <ImageBackground
          source={require('../images/background_home.jpg')}
          size="cover"
          style={styles.backgroundImage}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexDirection: 'column', marginVertical: 10}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ScannerPage', {
                    token: token,
                  })
                }>
                <MaterialIcons
                  name="keyboard-backspace"
                  color="#000"
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.textTitle}> Group</Text>
            </View>
          </View>
        </ImageBackground>
        <ImageBackground
          source={require('../images/background_home.jpg')}
          size="cover"
          style={styles.backgroundImage}>
          <ScrollView style={{marginBottom: 60}}>
            <ImageBackground
              size="cover"
              style={{...styles.backgroundImage, height: 200}}>
              <View
                style={{
                  backgroundColor: '#A4451F',
                  width: '50%',
                  margin: 10,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: '500',
                    padding: 10,
                  }}></Text>
              </View>
            </ImageBackground>

            <View style={{width: '100%', padding: 20, paddingTop: 15}}>
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                  borderRadius: 15,
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 20,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#A4451F',
                      fontStyle: 'italic',
                    }}>
                    Group Description
                  </Text>
                </View>
              </View>
            </View>
            <View style={{paddingLeft: 20, paddingTop: 20}}>
              <Text style={{color: '#000', fontSize: 14}}>Multimedia</Text>
            </View>
            <View style={{width: '100%', padding: 20, paddingTop: 10}}></View>
            <View style={{paddingLeft: 20, paddingTop: 20}}>
              <Text style={{color: '#000', fontSize: 14}}>
                Ratings & Reviews
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                padding: 20,
                paddingTop: 10,
              }}>
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                  //  borderRadius: 15,
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 20,
                }}>
                <View>
                  <Text style={{color: '#000', fontSize: 15}}>
                    Write a Review
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'column'}}>
                      <Text>Rate </Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                      <Rating
                        onFinishRating={ratingCompleted}
                        imageSize={20}
                        startingValue={defaultRating}
                      />
                    </View>
                    {ratingStarError.length > 0 && (
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 14,
                          color: 'red',
                          width: '100%',
                          textAlign: 'left',
                          fontFamily: 'sans-serif',
                          marginLeft: 35,
                          padding: 5,
                          marginBottom: 5,
                        }}>
                        {ratingStarError}
                      </Text>
                    )}
                  </View>
                  <View>
                    <TouchableOpacity onPress={checkTextInput}>
                      <TextInput
                        style={{
                          marginTop: 10,
                          width: '100%',
                          borderColor: '#ADADAD',
                          borderWidth: 1,
                          padding: 5,
                          minHeight: 10,
                          textAlignVertical: 'center',
                          color: 'black',
                        }}
                        numberOfLines={1}
                        value={userProfileName}
                        onChangeText={text => setUserProfileName(text)}
                        underlineColorAndroid="transparent"
                        editable={false}
                      />
                      {profileNameError.length > 0 && (
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            color: 'red',
                            width: '100%',
                            textAlign: 'left',
                            fontFamily: 'sans-serif',
                            marginLeft: 35,
                            padding: 5,
                            marginBottom: 5,
                          }}>
                          {profileNameError}
                        </Text>
                      )}
                    </TouchableOpacity>
                    <TextInput
                      style={{
                        marginTop: 10,
                        width: '100%',
                        borderColor: '#ADADAD',
                        borderWidth: 1,
                        padding: 10,
                        minHeight: 100,
                        textAlignVertical: 'top',
                      }}
                      numberOfLines={1}
                      value={comments}
                      onChangeText={text => setComments(text)}
                      multiline={true}
                      placeholder="Add comment"
                      underlineColorAndroid="transparent"
                      onKeyPress={keyPress => setIsReviewBtn('flex')}
                    />
                    {commentsError.length > 0 && (
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 14,
                          color: 'red',
                          width: '100%',
                          textAlign: 'left',
                          fontFamily: 'sans-serif',
                          marginLeft: 35,
                          padding: 5,
                          marginBottom: 5,
                        }}>
                        {commentsError}
                      </Text>
                    )}
                    <View
                      style={{
                        display: isReviewBtn,
                        flexDirection: 'column',
                        backgroundColor: '#A4451F',
                        alignItems: 'center',
                        alignSelf: 'flex-end',
                        marginTop: 5,
                        borderRadius: 25,
                        width: 60,
                        height: 20,
                        borderColor: '#A4451F',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          handleSaveReviewGroup();
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#fff',
                            fontStyle: 'italic',
                          }}>
                          Send
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View>
                  <Text style={{color: '#000', fontSize: 15, marginTop: 10}}>
                    Customer Reviews
                  </Text>

                  {ratingList &&
                    ratingList.length > 0 &&
                    ratingList.map(arating => {
                      return (
                        <>
                          <View
                            style={{
                              paddingBottom: 10,
                              borderBottomColor: '#ECECEC',
                              borderBottomWidth: 1,
                            }}>
                            <View style={{flexDirection: 'row'}}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  marginLeft: 0,
                                  marginTop: 10,
                                  backgroundColor: '#DADADA',
                                  padding: 10,
                                  borderRadius: 10,
                                }}>
                                <Icon name="user" size={40} color="#808080" />
                              </View>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  marginLeft: 10,
                                  marginTop: 15,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: '500',
                                    color: '#525252',
                                  }}>
                                  {arating.publicName}
                                </Text>

                                <Rating
                                  readonly={true}
                                  isDisabled={true}
                                  imageSize={20}
                                  startingValue={arating.star}
                                />
                                <Text>{arating.ratingOn}</Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  marginLeft: '25%',
                                  marginTop: 20,
                                  alignItems: 'flex-end',
                                }}></View>
                            </View>
                            <Text>{arating.publicComment}</Text>
                          </View>
                        </>
                      );
                    })}
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    </>
  );
};
export default TestAlertRa;
