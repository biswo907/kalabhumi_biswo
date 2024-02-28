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
  StatusBar,
  Dimensions,
} from 'react-native';
import styles from './scanStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {
//   fetchArtifactData,
//   fetchRatingDataByQrcode,
// } from '../redux/features/qrcode/qrcodeSlice';
import {Buffer} from 'buffer';
// import {useSelector, useDispatch} from 'react-redux';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {useIsFocused} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
//const imageBaseUrl = 'http://209.97.136.18:8080/kalabhoomi';
import {APIURL} from '../constants/resource.jsx';
const imageBaseUrl = APIURL.imageBaseUrl;
import Slideshow from 'react-native-image-slider-show';
import YoutubePlayer from 'react-native-youtube-iframe';
// import {saveReview, fetchUser} from '../redux/features/auth/authSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Sound from 'react-native-sound';
import {AudioPlayer} from 'react-native-simple-audio-player';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  saveReview,
  getRatingByQRCode,
  getUserProfile,
  getArtifactData,
} from '../services/Services';
import Video from 'react-native-video';
import videobg from '../videos/bg13.mp4';
const Artifact = ({route, navigation}) => {
  const {width} = useWindowDimensions();
  const heightI = 100;
  const widthI = 100;
  const [size, setSize] = useState({widthI, heightI});
  const [scan, setScan] = useState('');
  const isFocused = useIsFocused();
  const [comments, setComments] = useState('');
  const [userProfileName, setUserProfileName] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [isReviewBtn, setIsReviewBtn] = useState('none');
  const [ratingStar, setRatingStar] = useState('');
  // const dispatch = useDispatch();
  const {token, artifactId, qrCodeStrss, gallaryHeaderName} = route.params;
  const [artifactDetials, setArtifactDetials] = useState('');
  const [html, setHtml] = useState('');
  const [artifactImages, setArtifactImages] = useState([]);
  const [artifactVideos, setArtifactVideos] = useState([]);
  const [artifactAudios, setArtifactAudios] = useState([]);
  const [ratingList, setRatingList] = useState([]);
  const [isAudioSlider, setIsAudioSlider] = useState(true);
  const [isImageSlider, setIsImageSlider] = useState(false);
  const [isVideoSlider, setIsVideoSlider] = useState(false);
  const [position, setPosition] = useState(1);
  const [interval, setInterval] = useState('');
  const [audioTextColor, setAudioTextColor] = useState('#fff');
  const [audioBgColor, setAudioBgColor] = useState('#A4451F');
  const [imageTextColor, setImageTextColor] = useState('#AE4D26');
  const [imageBgColor, setImageBgColor] = useState('#fff');
  const [videoTextColor, setVideoTextColor] = useState('#AE4D26');
  const [videoBgColor, setVideoBgColor] = useState('#fff');
  const [commentsError, setCommentsError] = useState('');
  const [ratingStarError, setRatingStarError] = useState('');
  const [profileNameError, setProfileNameError] = useState('');
  const [defaultRating, setDefaultRating] = useState(0);
  const [isLoader, setIsLoader] = useState(false);

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
  const checkTextInput = () => {
    //Check for the Name TextInput
    if (!userProfileName) {
      navigation.navigate('ProfilePage', {
        token: userToken,
        mobile: userMobile,
        artifactId: artifactId,
        qrCodeStrss: qrCodeStrss,
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
        qrCode: qrCodeStrss,
      };
      console.log('XXXXXXXXXXXXXXXXXXXXXXXXXX', qrCodeStrss);
      var obj = JSON.stringify(postdata);
      var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');

      saveReview(postbase64Data, token)
        .then(data => {
          setIsLoader(false);
          if (data.outcome == true) {
            //Alert.alert('Success', data.message);
            handleRatingCall();
            setIsReviewBtn('none');
            setComments('');
            setDefaultRating(0);
            setRatingStar('');
          } else {
            Alert.alert('Error', data.message);
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    } else {
      setIsLoader(true);
    }
  };
  const handleRatingCall = () => {
    //Rating List
    var postdata = {qrCode: qrCodeStrss};
    var obj = JSON.stringify(postdata);
    var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
    console.log('PRADHAN>>>>>>..', postbase64Data);
    getRatingByQRCode(postbase64Data, token)
      .then(data => {
        console.log('fetchRatingDataByQrcode..', data.data);
        if (data.outcome == true) {
          setRatingList(data.data);
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };
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
    getUserProfile(token)
      .then(data => {
        if (data.outcome == true) {
          var userGetProfileData = data.data;
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
      handleFetchUserDetails();
      setArtifactDetials('');
      setRatingList([]);
      handleRatingCall();
      // AsyncStorage.getItem('profileName')
      //   .then(uname => {
      //     setUserProfileName(uname);
      //   })
      //   .then(res => {});
      // AsyncStorage.getItem('userToken')
      //   .then(token => {
      //     setUserToken(token);
      //   })
      //   .then(res => {});

      // AsyncStorage.getItem('userMobile')
      //   .then(mobile => {
      //     setUserMobile(mobile);
      //   })
      //   .then(res => {});

      var artifactIds = artifactId.toString();
      var postdata = {artifactId: artifactIds};
      var obj = JSON.stringify(postdata);
      var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
      getArtifactData(postbase64Data, token)
        .then(data => {
          console.log('fetchArtifactData', data.payload);
          if (data.outcome == true && mounted) {
            setArtifactDetials(data.data.artifact);
            var artifacData = data.data.artifact;
            setHtml(artifacData.artifactDescriptionEn);
            console.log(artifacData);
            if (artifacData.artifactImages > 0) {
              let temp = [];
              for (let i = 0; i < artifacData.artifactImages.length; i++) {
                temp.push({
                  ...artifacData.artifactImages[i],
                  url: imageBaseUrl + artifacData.artifactImages[i],
                });
              }
              setArtifactImages(temp);
            }
            if (artifacData.artifactAudios > 0) {
              setArtifactAudios(artifacData.artifactDescriptionEn);
            }
            if (artifacData.artifactVideos > 0) {
              setArtifactVideos(artifacData.artifactDescriptionEn);
            }
          } else {
            Alert.alert('Error', data.message);
          }
        })
        .catch(error => {
          console.log('error', error);
        });
    }
    return () => {
      mounted = false; // add this
    };
  }, [isFocused]);

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
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

  const ratingCompleted = rating => {
    setRatingStar(rating);
    console.log('Rating is: ' + rating);
  };

  return (
    <>
      <StatusBar
        animated={true}
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
        // showHideTransition={statusBarTransition}
        hidden={false}
      />
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
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255,255,255,0.2)',
        }}></View>
      <SafeAreaView
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            width: '100%',
          }}>
          {isLoader && <Spinner visible={true} color="#A4451F" />}
          <ScrollView>
            <ImageBackground
              source={{
                uri: imageBaseUrl + artifactDetials.artifactDisplayImagePath,
              }}
              size="cover"
              style={{...styles.backgroundImage, height: 500}}>
              <View
                style={{
                  backgroundColor: '#A4451F',
                  width: '100%',
                  flexDirection: 'row',
                  padding: 2,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
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
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '500',
                    padding: 10,
                  }}>
                  {artifactDetials.artifactNameEn}
                </Text>
                <Text style={{color: '#FFF', fontSize: 12}}>(Artifact)</Text>
              </View>
            </ImageBackground>
            {artifactDetials ? (
              <>
                <View style={{width: '100%', padding: 10}}>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 5,
                      borderRadius: 5,
                      width: '100%',
                      backgroundColor: 'white',
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
                        <Text>Period</Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: 'white',
                          padding: 10,
                          width: '50%',
                          borderWidth: 1,
                          borderColor: '#d0d0d0',
                        }}>
                        <Text>{artifactDetials.aboutEn}</Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', display: 'none'}}>
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
                <View
                  style={{
                    width: '100%',
                    padding: 20,
                    paddingTop: 0,
                    display: 'none',
                  }}>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 5,
                      borderRadius: 5,
                      width: '100%',
                      backgroundColor: 'white',
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
                        <Text>Donated By</Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: 'white',
                          padding: 10,
                          width: '50%',
                          borderWidth: 1,
                          borderColor: '#d0d0d0',
                        }}>
                        <Text>Excavation</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{width: '100%', padding: 10}}>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 5,
                      borderRadius: 5,
                      width: '100%',
                      backgroundColor: 'white',
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
                      {/* <Text
                        style={{fontSize: 11, color: '#1F1F1F', marginTop: 10}}>
                        {artifactDetials.artifactDescriptionEn}
                      </Text> */}
                      <RenderHTML contentWidth={width} source={{html}} />
                      <Text
                        style={{
                          fontSize: 9,
                          alignSelf: 'flex-end',
                          color: '#A4451F',
                          marginTop: 10,
                        }}>
                        Read More...
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{width: '100%', padding: 10}}>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 5,
                      borderRadius: 5,
                      width: '100%',
                      backgroundColor: 'white',
                      padding: 20,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#A4451F',
                          fontStyle: 'italic',
                        }}>
                        Cultural Significance
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: '#1F1F1F',
                          marginTop: 10,
                        }}>
                        {artifactDetials.culturalSignificanceEn}
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          alignSelf: 'flex-end',
                          color: '#A4451F',
                          marginTop: 10,
                        }}>
                        Read More...
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{width: '100%', padding: 10}}>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 5,
                      borderRadius: 5,
                      width: '100%',
                      backgroundColor: 'white',
                      padding: 20,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#A4451F',
                          fontStyle: 'italic',
                        }}>
                        Making Process
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: '#1F1F1F',
                          marginTop: 10,
                        }}>
                        {artifactDetials.processOfMakingEn}
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          alignSelf: 'flex-end',
                          color: '#A4451F',
                          marginTop: 10,
                        }}>
                        Read More...
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{width: '100%', padding: 5}}>
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
                      borderRadius: 5,
                      padding: 20,
                    }}>
                    <View>
                      <View style={{paddingBottom: 5}}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: '#A4451F',
                            fontStyle: 'italic',
                          }}>
                          Audio Guide
                        </Text>
                        <Text
                          style={{color: '#000', fontSize: 12, marginTop: 10}}>
                          Select Language
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingBottom: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                        }}>
                        <View
                          style={{
                            flexDirection: 'column',
                            backgroundColor: audioBgColor,
                            alignItems: 'center',
                            marginRight: 5,
                            borderRadius: 5,
                            width: '30%',
                            padding: 5,
                            borderWidth: 1,
                            borderColor: '#A4451F',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              updateMultimedioColor('Audio');
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
                            borderRadius: 5,
                            width: '30%',
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
                            borderRadius: 5,
                            width: '30%',
                            borderWidth: 1,
                            borderColor: '#A4451F',
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
                          {artifactImages && artifactImages.length > 0 ? (
                            artifactVideos.map(oriyaAudio => {
                              var currentPageURL = imageBaseUrl + oriyaAudio;
                              var readParam = 'filePath';
                              const regex = new RegExp(
                                '[?&]' +
                                  encodeURIComponent(readParam) +
                                  '=([^&#]*)',
                              );
                              var paramValue = regex.exec(currentPageURL)[1];
                              return (
                                <View>
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
                                      <Text
                                        style={{
                                          fontSize: 8,
                                          color: '#A4451F',
                                        }}>
                                        {paramValue}
                                      </Text>
                                    </View>
                                    <AudioPlayer
                                      url={imageBaseUrl + oriyaAudio}
                                    />
                                  </View>
                                </View>
                              );
                            })
                          ) : (
                            <Text>Odia not found</Text>
                          )}
                        </>
                      ) : null}

                      {isVideoSlider ? (
                        <>
                          {artifactAudios && artifactAudios.length > 0 ? (
                            artifactAudios.map(hindiAudio => {
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
                                      <Text
                                        style={{
                                          fontSize: 8,
                                          color: '#A4451F',
                                        }}>
                                        {paramValue}
                                      </Text>
                                    </View>
                                    <AudioPlayer
                                      url={imageBaseUrl + hindiAudio}
                                    />
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
                          {artifactVideos && artifactVideos.length > 0 ? (
                            artifactVideos.map(engaudio => {
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
                                      <Text
                                        style={{
                                          fontSize: 8,
                                          color: '#A4451F',
                                        }}>
                                        {paramValue}
                                      </Text>
                                    </View>
                                    <AudioPlayer
                                      url={imageBaseUrl + engaudio}
                                    />
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
                <View
                  style={{
                    width: '100%',
                    padding: 5,
                  }}>
                  <View
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      elevation: 5,
                      borderRadius: 5,
                      width: '100%',
                      backgroundColor: 'white',
                      padding: 20,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: '#A4451F',
                          fontStyle: 'italic',
                        }}>
                        Ratings & Reviews
                      </Text>
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
                        <View
                          style={{
                            //display: isReviewBtn,
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
                              }}>
                              Send
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <View>
                      <Text
                        style={{color: '#000', fontSize: 15, marginTop: 10}}>
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
              </>
            ) : (
              <View>
                <Text
                  style={{
                    marginLeft: 100,
                    fontSize: 13,
                    fontWeight: 'bold',
                    padding: 10,
                  }}>
                  No data found
                </Text>
              </View>
            )}
          </ScrollView>
          {/* </ImageBackground> */}
        </View>
      </SafeAreaView>
    </>
  );
};
export default Artifact;
