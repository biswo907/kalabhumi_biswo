import React, {useEffect, useState} from 'react';
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
  StatusBar,
  Dimensions,
  galleryCode,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import jwt_decode from 'jwt-decode';
// import {useDispatch} from 'react-redux';
// import {Buffer} from 'buffer';
// import {logout} from '../redux/features/auth/authSlice';
// import {fetchAllGalleryData} from '../redux/features/qrcode/qrcodeSlice';
import {useIsFocused} from '@react-navigation/native';
import Slideshow from 'react-native-image-slider-show';
import RenderHTML from 'react-native-render-html';
import Video from 'react-native-video';
import videobg from '../videos/bg13.mp4';
import {APIURL} from '../constants/resource.jsx';
import {getGalleryData} from '../services/Services';
import {getUser, getToken} from '../context/async-storage';
// import {getItem} from '../redux/async-storage';
const imageBaseUrl = APIURL.imageBaseUrl;
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {useAuthorization} from '../context/AuthProvider';
const regex = /(<([^>]+)>)/gi;
const HomeScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  // const dispatch = useDispatch();
  const rotation = useSharedValue(0);
  const [token, setToken] = useState('');
  const {signOut} = useAuthorization();
  const [allGalleryData, setAllGalleryData] = useState([]);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState({});
  const [isGalleryView, setIsGalleryView] = useState(false);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotation.value}deg`}],
    };
  });
  useEffect(() => {
    var _token = getToken();
    // console.log('token------------', _token);
    if (typeof _token !== 'undefined') {
      setToken(_token);
    } else {
      setToken('');
    }
  }, [isFocused]);
  useEffect(() => {
    let mounted = true;
    console.log('token ............................', token);

    getGalleryData(token).then(response => {
      console.log('gallery data ', response.data);
      response && response.data && mounted && setAllGalleryData(response.data);
    });
    return () => {
      mounted = false;
    };
  }, [token]);

  // useEffect(() => {
  //   let mounted = true;
  //   const initState = async () => {
  //     try {
  //       const authToken = await getItem();
  //       if (authToken !== null) {
  //         console.log('token----------', authToken);
  //         // dispatch({type: 'SIGN_IN', token: authToken});
  //       } else {
  //         console.log('token----------', authToken);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   if (mounted && isFocused) initState();
  // }, [isFocused]);
  // useEffect(() => {
  //   let mounted = true;
  //   if (isFocused) {
  //     // rotation.value = withRepeat(withTiming(10), 6, true);
  //     AsyncStorage.getItem('userToken').then(token => {
  //       if (mounted) {
  //         console.log('token----------', decoded);
  //         const decoded = jwt_decode(token);
  //         // console.log(decoded);
  //         let unixTimestampEnd = decoded.exp;
  //         let dateEnd = new Date(unixTimestampEnd * 1000) * 60000;
  //         if (Date.now() >= dateEnd) {
  //           handleLogout(token);
  //         } else {
  //           setToken(token);
  //         }
  //       }
  //     });
  //     //     // .then(res => {});
  //     //     // return () => backHandler.remove();
  //   }
  //   return () => {
  //     mounted = false; // add this
  //   };
  // }, [isFocused]);
  // useEffect(() => {
  //   let mounted = true;
  //   // var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
  //   if (token !== '') {
  //     dispatch(fetchAllGalleryData(token)).then(data => {
  //       console.log('data----------------', data);
  //       // if (data.payload.outcome === true && mounted) {
  //       //   setAllGalleryData(data.payload.data);
  //       //   // console.log(data.payload.data[0].galleryDisplayImagePath);
  //       // }
  //     });
  //   }
  //   return () => {
  //     mounted = false; // add this
  //   };
  // }, [token]);

  // const handleLogout = token => {
  //   dispatch(logout(token));
  //   AsyncStorage.clear();
  //   navigation.navigate('LoginPage');
  // };
  const handleLogout = () => {
    const token = getToken();
    console.log(token);
    signOut();
    navigation.navigate('LoginPage');
  };
  const goToScanPage = () => {
    navigation.navigate('ScannerPage', {
      token: token,
    });
    // AsyncStorage.getItem('userToken')
    //   .then(token => {
    //     navigation.navigate('ScannerPage', {
    //       token: token,
    //     });
    //     const decoded = jwt_decode(token);
    //     console.log(decoded);
    //     let unixTimestampEnd = decoded.exp;
    //     let dateEnd = new Date(unixTimestampEnd * 1000) * 60000;
    //     if (Date.now() >= dateEnd) {
    //       handleLogout(token);
    //     } else {
    //       navigation.navigate('ScannerPage', {
    //         token: token,
    //       });
    //     }
    //   })
    //   .then(res => {});
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
      {/* <Image
        source={require('../images/bg2-min.jpg')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.8,
        }}
      /> */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255,255,255,0.7)',
        }}></View>

      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <View style={{flex: 1, width: '100%'}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 1,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{position: 'absolute', left: 15, top: 10}}
                onPress={() => {
                  navigation.openDrawer();
                }}>
                <MaterialCommunityIcons
                  name="dots-horizontal"
                  color="#000"
                  size={30}
                />
              </TouchableOpacity>
              <View style={{alignSelf: 'center'}}>
                <Text
                  style={{
                    fontWeight: 'normal',
                    color: '#a4451f',
                    textAlign: 'center',
                    marginBottom: 2,
                    fontSize: 35,
                    fontFamily: 'RobotoCondensed-Regular',
                    borderBottomColor: '#D8D8D8',
                    borderBottomWidth: 2,
                  }}>
                  KALABHOOMI
                </Text>
                <Text
                  style={{
                    fontWeight: 'normal',
                    color: '#454545',
                    marginBottom: 15,
                    fontSize: 20,
                    textAlign: 'center',
                    fontFamily: 'RobotoCondensed-Regular',
                  }}>
                  ODISHA CRAFTS MUSEUM
                </Text>
                {/* <TouchableOpacity onPress={() => handleLogout()}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialCommunityIcons
                      name="logout"
                      color="#000"
                      size={15}
                    />
                    <Text style={{marginLeft: 15, color: '#000'}}>Log out</Text>
                  </View>
                </TouchableOpacity> */}
              </View>
            </View>
            <ScrollView style={{marginBottom: 20}}>
              <View style={{marginVertical: 10}}>
                <Slideshow
                  scrollEnabled={false}
                  arrowSize={20}
                  dataSource={[
                    {url: require('../images/1.jpg')},
                    {url: require('../images/2.jpg')},
                    {url: require('../images/3.jpg')},
                    {url: require('../images/4.jpg')},
                    {url: require('../images/5.jpg')},
                    {url: require('../images/6.jpg')},
                    {url: require('../images/7.jpg')},
                    {url: require('../images/8.jpg')},
                    {url: require('../images/9.jpg')},
                    {url: require('../images/10.jpg')},
                    {url: require('../images/11.jpg')},
                  ]}
                />
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  width: '90%',
                  paddingHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 20,
                  backgroundColor: 'red',
                }}>
                <View
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 15,
                      color: '#3F2305',
                      fontStyle: 'italic',
                      fontFamily: 'CrimsonPro-Regular',
                      textAlign: 'center',
                      fontWeight: 'normal',
                      paddingHorizontal: 20,
                    }}>
                    "The soul of India shines through the skilful hands of
                    Odisha".
                  </Text>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 12,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    - Shri Naveen Patnaik
                  </Text>
                  <Text style={{color: '#000', fontSize: 10}}>
                    ( Hon’ble Chief Minister )
                  </Text>
                </View>
                <Image
                  source={require('../images/cm.png')}
                  style={{
                    width: 100,
                    height: 100,
                    resizeMode: 'contain',
                    borderRadius: 50,
                    // elevation: 2,
                  }}
                />
              </View> */}
              <View
                style={{
                  alignItems: 'flex-start',
                  marginTop: 10,
                  paddingTop: 20,
                  width: '100%',
                  borderTopWidth: 2,
                  borderTopColor: '#D8D8D8',
                }}>
                <View
                  style={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontStyle: 'italic',
                      fontSize: 18,
                      marginBottom: 10,
                      color: '#000',
                      fontFamily: 'Baskervville-Regular',
                    }}>
                    Scan to explore details!
                  </Text>
                  {/* <Image
                  source={require('../images/scan_arrow.png')}
                  style={{
                    width: 100,
                    height: 70,
                    position: 'absolute',
                    top: 10,
                    left: 100,
                    transform: [{rotate: '-15deg'}],
                  }}
                /> */}
                  <TouchableOpacity
                    onPress={() => {
                      goToScanPage();
                    }}>
                    <Animated.Image
                      style={[styles.aniImage, animatedStyle]}
                      source={require('../images/scan.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'flex-start',
                  marginTop: 20,
                  padding: 20,
                  width: '100%',
                  borderTopWidth: 2,
                  borderTopColor: '#D8D8D8',
                }}>
                <Text
                  style={{
                    fontWeight: 'normal',
                    color: '#a4451f',
                    textAlign: 'left',
                    marginBottom: 2,
                    fontSize: 20,
                    fontFamily: 'RobotoCondensed-Regular',
                  }}>
                  View Gallery
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}>
                  {allGalleryData &&
                    allGalleryData.length > 0 &&
                    allGalleryData.map(gdata => (
                      <TouchableOpacity
                        onPress={() => {
                          console.log(gdata);
                          setIsGalleryView(true);
                          setSelectedGalleryItem(gdata);
                        }}
                        key={gdata.galleryCode}
                        style={{
                          width: '30%',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          margin: 5,
                          borderRadius: 5,
                          shadowColor: '#000',
                          shadowOffset: {width: 1, height: 1},
                          shadowOpacity: 0.8,
                          shadowRadius: 1,
                          elevation: 1,
                          backgroundColor: '#FFFFFF',
                        }}>
                        <ImageBackground
                          style={{
                            width: '100%',
                            height: 80,
                            resizeMode: 'contain',
                          }}
                          source={{
                            uri:
                              imageBaseUrl +
                              '/api/allowAll/image/viewDocuments?moduleName=GALLERY&filePath=' +
                              encodeURIComponent(
                                gdata.galleryDisplayImagePath.trim(),
                              ).toString(),
                          }}></ImageBackground>
                        <View
                          style={{
                            backgroundColor: '#FFF',
                            width: '100%',
                            padding: 3,
                            height: 60,
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 12,
                              color: '#000',
                            }}>
                            {gdata.galleryNameEn}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
        {isGalleryView && Object.entries(selectedGalleryItem).length > 0 && (
          <View
            style={{
              position: 'absolute',
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              backgroundColor: 'rgba(0,0,0,0.8)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                width: '90%',
                borderRadius: 10,
              }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: -20,
                  right: -10,
                  zIndex: 99,
                  backgroundColor: '#FFFFFF',
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setIsGalleryView(false);
                  setSelectedGalleryItem({});
                }}>
                <Text
                  style={{
                    color: '#a4451f',
                    fontWeight: '700',
                    fontSize: 18,
                  }}>
                  X
                </Text>
              </TouchableOpacity>
              <Image
                style={{
                  width: '100%',
                  height: 150,
                  resizeMode: 'cover',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
                source={{
                  uri:
                    imageBaseUrl +
                    '/api/allowAll/image/viewDocuments?moduleName=GALLERY&filePath=' +
                    encodeURIComponent(
                      selectedGalleryItem.galleryDisplayImagePath.trim(),
                    ).toString(),
                }}
              />
              <View style={{padding: 10}}>
                <Text
                  style={{fontSize: 18, fontWeight: '700', color: '#a4451f'}}>
                  {selectedGalleryItem.galleryNameEn}
                </Text>
                <RenderHTML
                  contentWidth={100}
                  source={{
                    html: selectedGalleryItem.galleryDescriptionEn.replace(
                      regex,
                      '',
                    ),
                  }}
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
  aniImage: {width: 100, height: 97},
  inputBox: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
    borderRadius: 5,
    padding: 0,
    paddingLeft: 10,
    height: 40,
    paddingRight: 10,
    width: '70%',
    overflow: 'hidden',
  },
  safeContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
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

  backgroundHomeImage: {
    width: '100%',
    marginTop: 10,
  },
});
