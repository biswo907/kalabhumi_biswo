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
// import {
//   fetchSectionData,
//   fetchRatingDataByQrcode,
// } from '../redux/features/qrcode/qrcodeSlice';
import {Buffer} from 'buffer';
// import {useSelector, useDispatch} from 'react-redux';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {useIsFocused} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import Slideshow from 'react-native-image-slider-show';
import {APIURL} from '../constants/resource.jsx';
import YoutubePlayer from 'react-native-youtube-iframe';
// import {saveReview, fetchUser} from '../redux/features/auth/authSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import Sound from 'react-native-sound';
import {AudioPlayer} from 'react-native-simple-audio-player';
import Video from 'react-native-video';
import videobg from '../videos/bg13.mp4';
import {
  saveReview,
  getRatingByQRCode,
  getUserProfile,
  getSectionData,
} from '../services/Services';
const imageBaseUrl = APIURL.imageBaseUrl;

const Groups = ({route, navigation}) => {
  // const dispatch = useDispatch();
  const [scan, setScan] = useState('');
  const [comments, setComments] = useState('');
  const [userProfileName, setUserProfileName] = useState('');
  const [userToken, setUserToken] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [isReviewBtn, setIsReviewBtn] = useState('none');
  const [ratingStar, setRatingStar] = useState('');
  const isFocused = useIsFocused();
  const {
    token,
    gallerySectionId,
    groupImage,
    gallerySectionImages,
    gallerySectionName,
    qrCodeStr,
    description,
    galleryAudios,
    galleryVideos,
    gallaryHeaderName,
  } = route.params;
  const [ratingList, setRatingList] = useState([]);
  const [artifactList, setArtifactList] = useState([]);
  const [commentsError, setCommentsError] = useState('');
  const [ratingStarError, setRatingStarError] = useState('');
  const [profileNameError, setProfileNameError] = useState('');
  const [defaultRating, setDefaultRating] = useState(0);
  const [isAudioSlider, setIsAudioSlider] = useState(true);
  const [isVideoSlider, setIsVideoSlider] = useState(false);
  const [isImageSlider, setIsImageSlider] = useState(false);
  const [position, setPosition] = useState(1);
  const [interval, setInterval] = useState('');
  const [playing, setPlaying] = useState(false);
  const [audioTextColor, setAudioTextColor] = useState('#fff');
  const [audioBgColor, setAudioBgColor] = useState('#A4451F');
  const [videoTextColor, setVideoTextColor] = useState('#AE4D26');
  const [videoBgColor, setVideoBgColor] = useState('#fff');
  const [imageTextColor, setImageTextColor] = useState('#AE4D26');
  const [imageBgColor, setImageBgColor] = useState('#fff');

  // useEffect(() => {
  //   console.log(gallerySectionId);
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
  //   console.log(gallerySectionImages);
  //   console.log(gallerySectionName);
  //   console.log(qrCodeStr);
  //   console.log(description);
  //   console.log(galleryAudios);
  //   console.log(galleryVideos);
  //   console.log(gallaryHeaderName);
  // }, []);

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
  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);
  const ratingCompleted = rating => {
    setRatingStar(rating);
    // console.log('Rating is: ' + rating);
  };

  const regex = /(<([^>]+)>)/gi;
  const result = description.replace(regex, '');
  const sourceDesc = {
    html: description,
  };
  const html = description.substring(0, 100);
  const [isDescTxt, setIsDescTxt] = useState(false);
  const [isShoMore, setIsShoMore] = useState('flex');
  const height = 100;
  const width = 100;
  const [size, setSize] = useState({width, height});
  const [isLoader, setIsLoader] = useState(false);
  // console.log('Hindi', galleryAudios);
  // console.log('ODIA', gallerySectionImages);
  // console.log('ENG', galleryVideos);
  const checkTextInput = () => {
    //Check for the Name TextInput
    if (!userProfileName) {
      navigation.navigate('ProfilePage', {
        token: userToken,
        mobile: userMobile,
        gallerySectionId: gallerySectionId,
        description: description,
        groupImage: groupImage,
        //  gallerySectionImages: gallerySectionImages,
        gallerySectionName: gallerySectionName,
        galleryVideos: galleryVideos,
        galleryAudios: galleryAudios,
        qrCodeStr: qrCodeStr,
        gallaryHeaderName: gallaryHeaderName,
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
      // console.log('PURI>>>>>>>>>...', postbase64Data);
      saveReview(postbase64Data, token)
        .then(data => {
          setIsLoader(false);
          if (data.outcome == true) {
            Alert.alert('Success', data.message);
            handleRatingCallGroup();
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
      setIsLoader(false);
    }
  };
  const handleRatingCallGroup = () => {
    //Rating List
    var postdata = {qrCode: qrCodeStr};
    var obj = JSON.stringify(postdata);
    var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
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

  const validateGroup = () => {
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
      if (mounted) {
        setDefaultRating(0);
        handleFetchUserDetails();
        setRatingList([]);
        setArtifactList([]);
        handleRatingCallGroup();
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
        var gallerySectionIds = gallerySectionId.toString();
        var postdata = {gallerySectionId: gallerySectionIds};
        var obj = JSON.stringify(postdata);
        var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
        getSectionData(postbase64Data, token)
          .then(data => {
            console.log('fetchSectionData', data.data.artifactList[0]);
            if (data.outcome == true) {
              setArtifactList(data.data.artifactList);
            } else {
              Alert.alert('Error', data.message);
            }
          })
          .catch(error => {
            console.log('error', error);
          });
      }
    }
    return () => {
      mounted = false; // add this
    };
  }, [isFocused]);

  return (
    <>
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
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingTop: 40,
        }}>
        {isLoader && <Spinner visible={true} color="#A4451F" />}
        <ScrollView style={{marginBottom: 20}}>
          <ImageBackground
            source={{
              uri: imageBaseUrl + groupImage,
            }}
            size="cover"
            style={{height: 500}}>
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
                  navigation.navigate('MainScreen', {
                    token: token,
                  })
                }>
                <MaterialIcons
                  name="keyboard-backspace"
                  color="#FFF"
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
                {gallerySectionName}
              </Text>
            </View>
          </ImageBackground>
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
                <View style={{paddingBottom: 20}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: '#A4451F',
                      fontStyle: 'italic',
                    }}>
                    Audio Guide
                  </Text>
                  <Text style={{color: '#000', fontSize: 12, marginTop: 5}}>
                    Select Language
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingBottom: 10,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      backgroundColor: audioBgColor,
                      alignItems: 'center',
                      marginRight: 5,
                      borderRadius: 5,
                      display: 'flex',
                      width: '30%',
                      padding: 5,
                      borderWidth: 2,
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
                      borderWidth: 2,
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
                      borderWidth: 2,
                      borderColor: '#A4451F',
                      width: '30%',
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
                    {gallerySectionImages && gallerySectionImages.length > 0 ? (
                      gallerySectionImages.map((oriyaAudio, i) => {
                        var currentPageURL = imageBaseUrl + oriyaAudio;
                        var readParam = 'filePath';
                        const regex = new RegExp(
                          '[?&]' + encodeURIComponent(readParam) + '=([^&#]*)',
                        );
                        var paramValue = regex.exec(currentPageURL)[1];
                        return (
                          <React.Fragment key={i}>
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
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <Text>Odia not found</Text>
                    )}
                  </>
                ) : null}

                {isVideoSlider ? (
                  <>
                    {galleryAudios.length > 0 ? (
                      galleryAudios.map((hindiAudio, j) => {
                        var currentPageURL = imageBaseUrl + hindiAudio;
                        var readParam = 'filePath';
                        const regex = new RegExp(
                          '[?&]' + encodeURIComponent(readParam) + '=([^&#]*)',
                        );
                        var paramValue = regex.exec(currentPageURL)[1];
                        return (
                          <React.Fragment key={j}>
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
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <Text>Hindi not found</Text>
                    )}
                  </>
                ) : null}

                {isImageSlider ? (
                  <>
                    {galleryVideos.length > 0 ? (
                      galleryVideos.map((engaudio, k) => {
                        var currentPageURL = imageBaseUrl + engaudio;
                        var readParam = 'filePath';
                        const regex = new RegExp(
                          '[?&]' + encodeURIComponent(readParam) + '=([^&#]*)',
                        );
                        var paramValue = regex.exec(currentPageURL)[1];
                        return (
                          <React.Fragment key={k}>
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
                          </React.Fragment>
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
          <View style={{width: '100%', padding: 5}}>
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
                borderRadius: 5,
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
          {artifactList && artifactList.length > 0 ? (
            <>
              <View
                style={{
                  width: '100%',
                  padding: 20,
                  paddingTop: 0,
                  display: 'none',
                }}>
                <Text style={{padding: 5}}>Artifact List</Text>
                {artifactList &&
                  artifactList.length > 0 &&
                  artifactList.map((alist, m) => {
                    //var html = alist.artifactDescriptionEn;
                    var html =
                      alist.artifactDescriptionEn.length > 100
                        ? alist.artifactDescriptionEn.substring(0, 50) + '...'
                        : alist.artifactDescriptionEn;
                    return (
                      <React.Fragment key={m}>
                        <ImageBackground
                          source={require('../images/card_background.png')}
                          style={{
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 1},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            elevation: 5,
                            width: '100%',
                            borderRadius: 20,
                            overflow: 'hidden',
                            backgroundSize: 'cover',
                            marginTop: 10,
                          }}>
                          <View key={alist.artifactNameEn}>
                            <View style={{flexDirection: 'row'}}>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  width: '47%',
                                  alignItems: 'flex-start',
                                }}>
                                <Image
                                  source={{
                                    uri:
                                      imageBaseUrl +
                                      alist.artifactDisplayImagePath,
                                  }}
                                  style={{
                                    width: '100%',
                                    height: 120,
                                  }}></Image>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'column',
                                  width: '50%',

                                  paddingLeft: 10,
                                  paddingTop: 10,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                  }}>
                                  <Text
                                    style={{
                                      alignSelf: 'center',
                                      fontSize: 12,
                                      color: '#000000',
                                      fontWeight: '700',
                                      paddingLeft: 0,
                                      marginLeft: 0,
                                      textAlign: 'left',
                                    }}>
                                    {alist.artifactNameEn}
                                  </Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                  <RenderHTML
                                    contentWidth={width}
                                    source={{html}}
                                  />
                                </View>
                                <View
                                  style={{
                                    alignItems: 'flex-end',
                                    marginBottom: 5,
                                  }}>
                                  <View
                                    style={{
                                      color: '#A4451F',
                                      backgroundColor: '#AE4D26',
                                      borderRadius: 100,
                                      width: '28%',
                                      height: 25,
                                      alignItems: 'center',
                                    }}>
                                    <TouchableOpacity
                                      onPress={() => {
                                        navigation.navigate('Artifact', {
                                          artifactId: alist.artifactId,
                                          token: token,
                                        });
                                      }}>
                                      <MaterialIcons
                                        name="arrow-right-alt"
                                        color="#fff"
                                        size={25}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </ImageBackground>
                      </React.Fragment>
                    );
                  })}
              </View>
            </>
          ) : null}

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
                //  borderRadius: 15,
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 5,
                padding: 20,
              }}>
              <View>
                <Text
                  style={{fontSize: 14, color: '#A4451F', fontStyle: 'italic'}}>
                  Ratings & Reviews
                </Text>
                <Text style={{color: '#000', fontSize: 15, marginTop: 10}}>
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
                    //onKeyPress={keyPress => setIsReviewBtn('flex')}
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
                        handleSaveReviewGroup();
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
                <Text style={{color: '#000', fontSize: 15, marginTop: 10}}>
                  Customer Reviews
                </Text>

                {ratingList &&
                  ratingList.length > 0 &&
                  ratingList.map((arating, p) => {
                    return (
                      <React.Fragment key={p}>
                        <View
                          style={{
                            paddingBottom: 10,
                            borderBottomColor: '#ECECEC',
                            borderBottomWidth: 1,
                          }}
                          key={arating.ratingId}>
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
                      </React.Fragment>
                    );
                  })}
              </View>
            </View>
          </View>
        </ScrollView>
        {/* </ImageBackground> */}
      </View>
    </>
  );
};
export default Groups;
