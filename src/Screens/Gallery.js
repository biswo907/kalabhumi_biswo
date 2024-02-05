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
  useWindowDimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styles from './scanStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  fetchDataByQrcode,
  fetchRatingDataByQrcode,
} from '../redux/features/qrcode/qrcodeSlice';
import {Buffer} from 'buffer';
import {useSelector, useDispatch} from 'react-redux';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import RenderHTML from 'react-native-render-html';
import Slideshow from 'react-native-image-slider-show';
import YoutubePlayer from 'react-native-youtube-iframe';
//const imageBaseUrl = 'http://209.97.136.18:8080/kalabhoomi';
import {APIURL} from '../constants/resource.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveReview, fetchUser} from '../redux/features/auth/authSlice';
import {useIsFocused} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import Sound from 'react-native-sound';
import {AudioPlayer} from 'react-native-simple-audio-player';
const imageBaseUrl = APIURL.imageBaseUrl;
const Gallery = ({route, navigation}) => {
  const [isAudioSlider, setIsAudioSlider] = useState(true);
  const [isImageSlider, setIsImageSlider] = useState(false);
  const [isVideoSlider, setIsVideoSlider] = useState(false);
  const [position, setPosition] = useState(1);
  const [interval, setInterval] = useState('');
  const {width} = useWindowDimensions();
  const [scan, setScan] = useState('');
  const [comments, setComments] = useState('');
  const [ratingStar, setRatingStar] = useState('');
  const [ratingList, setRatingList] = useState([]);
  const [userProfileName, setUserProfileName] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [isReviewBtn, setIsReviewBtn] = useState('none');
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [audioTextColor, setAudioTextColor] = useState('#fff');
  const [audioBgColor, setAudioBgColor] = useState('#A4451F');
  const [imageTextColor, setImageTextColor] = useState('#AE4D26');
  const [imageBgColor, setImageBgColor] = useState('#fff');
  const [videoTextColor, setVideoTextColor] = useState('#AE4D26');
  const [videoBgColor, setVideoBgColor] = useState('#fff');
  const [loading, setLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const [ratingStarError, setRatingStarError] = useState('');
  const [profileNameError, setProfileNameError] = useState('');
  const [defaultRating, setDefaultRating] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const {
    token,
    galleryId,
    description,
    qrTypeCode,
    groupImage,
    gallerySectionImages,
    galleryName,
    galleryVideos,
    galleryAudios,
    qrCodeGallary,
    gallaryHeaderName,
  } = route.params;
  const regex = /(<([^>]+)>)/gi;
  const result = description.replace(regex, '');
  const sourceDesc = {
    html: description,
  };
  const html = description.substring(0, 100);
  const [isDescTxt, setIsDescTxt] = useState(false);
  const [isShoMore, setIsShoMore] = useState('flex');
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainScreen', {
        token: token,
      });
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const ratingCompleted = rating => {
    setRatingStar(rating);
    console.log('Rating is: ' + rating);
  };

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback(state => {
    alert(state);
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);
  const updateMultimedioColor = mulType => {
    if (mulType == 'Audio') {
      setAudioTextColor('#fff');
      setAudioBgColor('#A4451F');
      setImageTextColor('#A4451F');
      setImageBgColor('#fff');
      setVideoTextColor('#A4451F');
      setVideoBgColor('#fff');
    } else if (mulType == 'Video') {
      setVideoTextColor('#fff');
      setVideoBgColor('#A4451F');
      setImageTextColor('#A4451F');
      setImageBgColor('#fff');
      setAudioTextColor('#A4451F');
      setAudioBgColor('#fff');
    } else {
      setImageTextColor('#fff');
      setImageBgColor('#A4451F');
      setAudioTextColor('#A4451F');
      setAudioBgColor('#fff');
      setVideoTextColor('#A4451F');
      setVideoBgColor('#fff');
    }
  };
  const checkTextInput = () => {
    //Check for the Name TextInput
    if (!userProfileName) {
      navigation.navigate('ProfilePage', {
        token: userToken,
        mobile: userMobile,
        galleryId: galleryId,
        description: description,
        qrTypeCode: qrTypeCode,
        groupImage: groupImage,
        gallerySectionImages: gallerySectionImages,
        galleryName: galleryName,
        galleryVideos: galleryVideos,
        galleryAudios: galleryAudios,
        qrCodeGallary: qrCodeGallary,
        gallaryHeaderName: gallaryHeaderName,
      });
    } else {
    }
  };

  const handleSaveReview = () => {
    if (validate()) {
      var postdata = {
        publicName: userProfileName,
        publicComment: comments,
        star: ratingStar,
        qrCode: qrCodeGallary,
      };
      var obj = JSON.stringify(postdata);
      var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
      console.log('PURI>>>>>>>>>...', postbase64Data);
      dispatch(saveReview({postbase64Data, token}))
        .then(data => {
          setIsLoader(false);
          if (data.payload.outcome == true) {
            // Alert.alert('Success', data.payload.message);
            handleRatingCall();
            setIsReviewBtn('none');
            setComments('');
            setDefaultRating(0);
            setRatingStar('');
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
  const handleRatingCall = () => {
    //Rating List

    var postdata = {qrCode: qrCodeGallary};
    var obj = JSON.stringify(postdata);
    var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
    dispatch(fetchRatingDataByQrcode({postbase64Data, token}))
      .then(data => {
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
  const onloading = value => {
    setLoading(value);
  };

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);
  const validate = () => {
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
    let mounted = true;
    if (isFocused) {
      setDefaultRating(0);
      if (mounted) {
        handleFetchUserDetails();
        setRatingList([]);
        handleRatingCall();
        AsyncStorage.getItem('profileName')
          .then(uname => {
            setUserProfileName(uname);
          })
          .then(res => {});
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
    }
    return () => {
      mounted = false; // add this
    };
  }, [isFocused]);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          backgroundColor: '#fff',
        }}>
        {isLoader && <Spinner visible={true} color="#A4451F" />}
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
              <Text style={styles.textTitle2}> Section/Gallery</Text>
            </View>
          </View>
        </ImageBackground>
        <ImageBackground
          source={require('../images/background_home.jpg')}
          size="cover"
          style={styles.backgroundImage}>
          <ScrollView style={{marginBottom: 20}}>
            <ImageBackground
              source={{
                uri: imageBaseUrl + groupImage,
              }}
              size="cover"
              style={{...styles.backgroundImage, height: 200}}>
              <View
                style={{backgroundColor: '#A4451F', width: '50%', margin: 10}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: '500',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  {galleryName}
                </Text>
              </View>
            </ImageBackground>
            <View style={{width: '100%', padding: 20, display: 'none'}}>
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
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      padding: 10,
                      width: '50%',
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                    }}>
                    <Text>No. of Artifacts</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      width: '50%',
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                    }}>
                    <Text>1789</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      padding: 10,
                      width: '50%',
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                    }}>
                    <Text>Period From</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      width: '50%',
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                    }}>
                    <Text>6999</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      padding: 10,
                      width: '50%',
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                    }}>
                    <Text>Period To</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      width: '50%',
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                    }}>
                    <Text>6999</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      padding: 10,
                      width: '50%',
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                    }}>
                    <Text>Civilizations</Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 10,
                      width: '50%',
                      borderWidth: 1,
                      borderColor: '#d0d0d0',
                    }}>
                    <Text>XYZ, ABC, XZY, YXZ</Text>
                  </View>
                </View>
              </View>
            </View>
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
                    Description
                  </Text>
                  {isDescTxt && (
                    <RenderHTML contentWidth={width} source={sourceDesc} />
                  )}
                  {!isDescTxt && (
                    <RenderHTML contentWidth={width} source={{html}} />
                  )}

                  {isDescTxt && (
                    <TouchableOpacity
                      onPress={() => {
                        setIsDescTxt(false);
                        setIsShoMore('flex');
                      }}>
                      <Text
                        style={{
                          fontSize: 9,
                          alignSelf: 'flex-end',
                          color: '#A4451F',
                          marginTop: 10,
                        }}>
                        Read Less
                      </Text>
                    </TouchableOpacity>
                  )}

                  {result.length > 100 ? (
                    <TouchableOpacity
                      onPress={() => {
                        setIsDescTxt(true);
                        setIsShoMore('none');
                      }}
                      style={{display: isShoMore}}>
                      <Text
                        style={{
                          fontSize: 9,
                          alignSelf: 'flex-end',
                          color: '#A4451F',
                          marginTop: 10,
                        }}>
                        Read More...
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>
            <View style={{width: '100%', padding: 20, paddingTop: 0}}>
              <Text style={{padding: 5}}>Artifacts Displayed</Text>
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
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '40%',
                      alignItems: 'flex-start',
                      padding: 10,
                    }}>
                    <Image
                      source={require('../images/artifact1.png')}
                      style={{
                        width: '100%',
                        height: 80,
                        color: 'black',
                      }}></Image>
                  </View>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '40%',
                      alignItems: 'flex-end',
                      padding: 10,
                    }}>
                    <Image
                      source={require('../images/artifact1.png')}
                      style={{
                        width: '100%',
                        height: 80,
                        color: 'black',
                      }}></Image>
                  </View>
                </View>
              </View>
            </View>
            {qrTypeCode == 'GALLERY_ARTIFACT' ? (
              <>
                <View style={{width: '100%', padding: 20, paddingTop: 0}}>
                  <Text style={{padding: 5}}>Artifact List</Text>
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
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '40%',
                          alignItems: 'flex-start',
                          padding: 10,
                        }}>
                        <Image
                          source={require('../images/artifact1.png')}
                          style={{
                            width: '100%',
                            height: 80,
                            color: 'black',
                          }}></Image>
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '50%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={{
                            fontSize: 11,
                            color: '#1F1F1F',
                            marginTop: 10,
                          }}>
                          In publishing and graphic design, Lorem ipsum is a
                          placeholder text commonly used to demonstrate the
                          visual form of a document or a typeface.
                        </Text>
                      </View>
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          color: '#A4451F',
                          backgroundColor: '#AE4D26',
                          borderRadius: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('Artifact', {
                              artifactId: 1,
                              token: token,
                            });
                          }}>
                          <MaterialIcons
                            name="arrow-right-alt"
                            color="#fff"
                            size={30}
                            height={10}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
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
                      marginTop: 10,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '40%',
                          alignItems: 'flex-start',
                          padding: 10,
                        }}>
                        <Image
                          source={require('../images/artifact1.png')}
                          style={{
                            width: '100%',
                            height: 80,
                            color: 'black',
                          }}></Image>
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '50%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={{
                            fontSize: 11,
                            color: '#1F1F1F',
                            marginTop: 10,
                          }}>
                          In publishing and graphic design, Lorem ipsum is a
                          placeholder text commonly used to demonstrate the
                          visual form of a document or a typeface.
                        </Text>
                      </View>
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          color: '#A4451F',
                          backgroundColor: '#AE4D26',
                          borderRadius: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('Artifact', {
                              artifactId: 1,
                              token: token,
                            });
                          }}>
                          <MaterialIcons
                            name="arrow-right-alt"
                            color="#fff"
                            size={30}
                            height={10}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
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
                      marginTop: 10,
                    }}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '40%',
                          alignItems: 'flex-start',
                          padding: 10,
                        }}>
                        <Image
                          source={require('../images/artifact1.png')}
                          style={{
                            width: '100%',
                            height: 80,
                            color: 'black',
                          }}></Image>
                      </View>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '50%',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={{
                            fontSize: 11,
                            color: '#1F1F1F',
                            marginTop: 10,
                          }}>
                          In publishing and graphic design, Lorem ipsum is a
                          placeholder text commonly used to demonstrate the
                          visual form of a document or a typeface.
                        </Text>
                      </View>
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          color: '#A4451F',
                          backgroundColor: '#AE4D26',
                          borderRadius: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('Artifact', {
                              artifactId: 1,
                              token: token,
                            });
                          }}>
                          <MaterialIcons
                            name="arrow-right-alt"
                            color="#fff"
                            size={30}
                            height={10}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            ) : null}

            <View style={{paddingLeft: 20, paddingTop: 20}}>
              <Text style={{color: '#000', fontSize: 14, fontWeight: 'bold'}}>
                {' '}
                Audio Guide
              </Text>
            </View>
            <View style={{width: '100%', padding: 20, paddingTop: 10}}>
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                  //borderRadius: 15,
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 20,
                  paddingTop: 15,
                }}>
                <View>
                  <View style={{paddingBottom: 20}}>
                    <Text style={{color: '#000', fontSize: 12}}>
                      Select Language
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingBottom: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        backgroundColor: audioBgColor,
                        alignItems: 'center',
                        marginRight: 5,
                        borderRadius: 25,
                        width: 80,
                        padding: 5,
                        borderWidth: 1,
                        borderColor: '#A4451F',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          updateMultimedioColor('Audio');
                          // setLoading(true);
                          setIsAudioSlider(!isAudioSlider);
                          setIsImageSlider(false);
                          setIsVideoSlider(false);
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: audioTextColor,
                            fontStyle: 'italic',
                          }}>
                          Odia
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        backgroundColor: videoBgColor,
                        alignItems: 'center',
                        marginRight: 5,
                        borderRadius: 25,
                        width: 80,
                        padding: 5,
                        borderWidth: 1,
                        borderColor: '#A4451F',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          updateMultimedioColor('Video');
                          setIsVideoSlider(!isVideoSlider);
                          setIsImageSlider(false);
                          setIsAudioSlider(false);
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: videoTextColor,
                            fontStyle: 'italic',
                          }}>
                          Hindi
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        backgroundColor: imageBgColor,
                        alignItems: 'center',
                        borderRadius: 25,
                        borderWidth: 1,
                        borderColor: '#A4451F',
                        width: 80,
                        padding: 5,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          updateMultimedioColor('Image');
                          setIsImageSlider(!isImageSlider);
                          setIsVideoSlider(false);
                          setIsAudioSlider(false);
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: imageTextColor,
                            fontStyle: 'italic',
                          }}>
                          English
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {isAudioSlider ? (
                    <>
                      {gallerySectionImages &&
                      gallerySectionImages.length > 0 ? (
                        gallerySectionImages.map(oriyaAudio => {
                          var currentPageURL = imageBaseUrl + oriyaAudio;
                          var readParam = 'filePath';
                          const regex = new RegExp(
                            '[?&]' +
                              encodeURIComponent(readParam) +
                              '=([^&#]*)',
                          );
                          var paramValue = regex.exec(currentPageURL)[1];
                          return (
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  backgroundColor: '#fff',
                                  justifyContent: 'center',
                                }}>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                  }}>
                                  <Text style={{fontSize: 8, color: '#A4451F'}}>
                                    {paramValue}
                                  </Text>
                                </View>
                                <AudioPlayer url={imageBaseUrl + oriyaAudio} />
                              </View>
                            </>
                          );
                        })
                      ) : (
                        <Text>Odia not found</Text>
                      )}
                    </>
                  ) : null}

                  {isVideoSlider ? (
                    <>
                      {galleryAudios && galleryAudios.length > 0 ? (
                        galleryAudios.map(hindiAudio => {
                          var currentPageURL = imageBaseUrl + hindiAudio;
                          var readParam = 'filePath';
                          const regex = new RegExp(
                            '[?&]' +
                              encodeURIComponent(readParam) +
                              '=([^&#]*)',
                          );
                          var paramValue = regex.exec(currentPageURL)[1];
                          return (
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  backgroundColor: '#fff',
                                  justifyContent: 'center',
                                }}>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                  }}>
                                  <Text style={{fontSize: 8, color: '#A4451F'}}>
                                    {paramValue}
                                  </Text>
                                </View>
                                <AudioPlayer url={imageBaseUrl + hindiAudio} />
                              </View>
                            </>
                          );
                        })
                      ) : (
                        <Text>Hindi not found</Text>
                      )}
                    </>
                  ) : null}

                  {isImageSlider ? (
                    <>
                      {galleryVideos && galleryVideos.length > 0 ? (
                        galleryVideos.map(engaudio => {
                          var currentPageURL = imageBaseUrl + engaudio;
                          var readParam = 'filePath';
                          const regex = new RegExp(
                            '[?&]' +
                              encodeURIComponent(readParam) +
                              '=([^&#]*)',
                          );
                          var paramValue = regex.exec(currentPageURL)[1];
                          return (
                            <>
                              <View
                                style={{
                                  flex: 1,
                                  backgroundColor: '#fff',
                                  justifyContent: 'center',
                                }}>
                                <View
                                  style={{
                                    alignSelf: 'center',
                                  }}>
                                  <Text style={{fontSize: 8, color: '#A4451F'}}>
                                    {paramValue}
                                  </Text>
                                </View>
                                <AudioPlayer url={imageBaseUrl + engaudio} />
                              </View>
                            </>
                          );
                        })
                      ) : (
                        <Text>English not found</Text>
                      )}
                    </>
                  ) : null}
                </View>
              </View>
            </View>
            <View style={{width: '100%', padding: 20, paddingTop: 10}}>
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                  elevation: 5,
                  //borderRadius: 15,
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 20,
                }}>
                <View></View>
              </View>
            </View>
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
                        startingValue={ratingStar}
                        onFinishRating={ratingCompleted}
                        imageSize={20}
                      />
                    </View>
                    {ratingStarError && ratingStarError.length > 0 && (
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
                      // onKeyPress={keyPress => setIsReviewBtn('flex')}
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
                        flexDirection: 'column',
                        backgroundColor: '#A4451F',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'flex-end',
                        marginTop: 5,
                        borderRadius: 10,
                        width: 100,
                        height: 30,
                        borderColor: '#A4451F',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsLoader(true);
                          handleSaveReview();
                        }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: '#fff',
                            // fontStyle: 'italic',
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
                </View>
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
          </ScrollView>
        </ImageBackground>
      </View>
    </>
  );
};
export default Gallery;
