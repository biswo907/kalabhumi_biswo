import React, {Component, Fragment, useState, useEffect} from 'react';
import {
  TouchableOpacity,
  Text,
  Linking,
  View,
  Image,
  ImageBackground,
  BackHandler,
  StatusBar,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './scanStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {fetchDataByQrcode} from '../redux/features/qrcode/qrcodeSlice';
import {Buffer} from 'buffer';
import {useSelector, useDispatch} from 'react-redux';
const imageBaseUrl = 'http://209.97.136.18:8080/kalabhoomi';
import Spinner from 'react-native-loading-spinner-overlay';
import Video from 'react-native-video';
import videobg from '../videos/bg13.mp4';
const ScannerPage = ({route, navigation}) => {
  const [scan, setScan] = useState('');
  const [ScanResult, setScanResult] = useState('');
  const [result, setResult] = useState('');
  const dispatch = useDispatch();
  const {token} = route.params;
  const [isLoader, setIsLoader] = useState(false);
  //const token_data = useSelector(state => state.auth.login);
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
  const onSuccess = e => {
    const check = e.data.substring(0, 4);
    // console.log('code...' + check);
    setResult(e);
    setScan(false);
    setScanResult(true);
    var sp = e.data.split('/');
    var theCode = sp[sp.length - 1];
    // console.log(sp[sp.length - 1+]);
    var postdata = {qrCode: theCode};
    var obj = JSON.stringify(postdata);
    var postbase64Data = Buffer.from(obj, 'utf-8').toString('base64');
    // console.log('AJAY BASE^$........', postbase64Data);
    dispatch(fetchDataByQrcode({postbase64Data, token}))
      .then(data => {
        console.log('DATA PAYLOAD', data);
        setScan(true);
        setScanResult(false);
        // alert(data.payload.data.qrTypeCode);
        if (data.payload.outcome === true) {
          if (
            data.payload.data.qrTypeCode == 'GALLERY' ||
            data.payload.data.qrTypeCode == 'GALLERY_ARTIFACT'
          ) {
            //navigation.navigate('Gallery', {token: token});
            var gallery = data.payload.data.gallery;
            var galleryId = gallery.galleryId;
            var description = gallery.galleryDescriptionEn;
            var groupImage = gallery.galleryDisplayImagePath;
            var galleryImages = gallery.gallerySectionOdiaAudios;
            var galleryNameEn = gallery.galleryNameEn;
            var galleryAudios = gallery.gallerySectionHindiAudios;
            var galleryVideos = gallery.gallerySectionEnglishAudios;
            var qrcodesss = e.data;
            var gallaryHeaderName = data.payload.data.qrTypeCode;

            // let temp = [];
            // if (galleryImages.length > 0) {
            //   for (let i = 0; i < galleryImages.length; i++) {
            //     temp.push({
            //       ...galleryImages[i],
            //       url: imageBaseUrl + galleryImages[i],
            //     });
            //   }
            // }

            var galleryOdiaA = [];
            if (galleryImages.length > 0) {
              galleryOdiaA = galleryImages;
            }
            navigation.navigate('Gallery', {
              token: token,
              galleryId: galleryId,
              description: description,
              qrTypeCode: data.payload.data.qrTypeCode,
              groupImage: groupImage,
              gallerySectionImages: galleryOdiaA,
              galleryName: galleryNameEn,
              galleryAudios: galleryAudios,
              galleryVideos: galleryVideos,
              qrCodeGallary: qrcodesss,
              gallaryHeaderName: gallaryHeaderName,
            });
          } else if (data.payload.data.qrTypeCode == 'SECTION') {
            var section = data.payload.data.gallerySection;
            //  console.log('data.payload.data', data.payload.data);
            //console.log('section', section);
            var gallerySectionId = section.gallerySectionId;
            var description = section.gallerySectionDescriptionEn;
            var groupImage = section.gallerySectionDisplayImagePath;
            var gallerySectionImages = section.gallerySectionOdiaAudios;
            var gallerySectionNameEn = section.gallerySectionNameEn;
            var galleryAudiosDb = section.gallerySectionHindiAudios;
            var galleryVideosDb = section.gallerySectionEnglishAudios;
            var QRCodeStrValue = e.data;
            var gallaryHeaderName = 'SECTION';
            var galleryAudios = [];

            if (galleryAudiosDb.length > 0) {
              galleryAudios = galleryAudiosDb;
            }
            var galleryVideos = [];
            if (galleryVideosDb.length > 0) {
              galleryVideos = galleryVideosDb;
            }

            var galleryOdia = [];
            if (gallerySectionImages.length > 0) {
              galleryOdia = gallerySectionImages;
            }
            // let temp = [];
            // if (gallerySectionImages.length > 0) {
            //   for (let i = 0; i < gallerySectionImages.length; i++) {
            //     temp.push({
            //       ...gallerySectionImages[i],
            //       url: imageBaseUrl + gallerySectionImages[i],
            //     });
            //   }
            // }
            // var x = {
            //   token: token,
            //   gallerySectionId: gallerySectionId,
            //   description: description,
            //   groupImage: groupImage,
            //   gallerySectionImages: galleryOdia,
            //   galleryAudios: galleryAudios,
            //   galleryVideos: galleryVideos,
            //   gallerySectionName: gallerySectionNameEn,
            //   qrCodeStr: QRCodeStrValue,
            //   gallaryHeaderName: gallaryHeaderName,
            // };
            // console.log(x);

            navigation.navigate('Groups', {
              token: token,
              gallerySectionId: gallerySectionId,
              description: description,
              groupImage: groupImage,
              gallerySectionImages: galleryOdia,
              galleryAudios: galleryAudios,
              galleryVideos: galleryVideos,
              gallerySectionName: gallerySectionNameEn,
              qrCodeStr: QRCodeStrValue,
              gallaryHeaderName: gallaryHeaderName,
            });
          } else if (data.payload.data.qrTypeCode == 'ARTIFACT') {
            var artifactId = data.payload.data.artifact.artifactId;
            navigation.navigate('Artifact', {
              token: token,
              artifactId: artifactId,
              qrCodeStrss: e.data,
              gallaryHeaderName: data.payload.data.qrTypeCode,
            });
          }
          // Alert.alert('Success', data.payload.message);
        } else {
          Alert.alert('Error', data.payload.message);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  const activeQR = () => {
    setScan(true);
  };
  const scanAgain = () => {
    setScan(true);
    setScanResult(false);
  };
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
      {/* <Video
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
      /> */}
      <Image
        source={require('../images/bg2-min.jpg')}
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
          backgroundColor: 'rgba(255,255,255,0)',
        }}></View>
      <SafeAreaView
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 50,
        }}>
        <View>
          <Fragment>
            {!scan && !ScanResult && (
              <>
                <View>
                  <TouchableOpacity onPress={activeQR}>
                    <Image
                      source={require('../images/qr-scan-icon-with-bg.png')}
                      style={{margin: 0, height: 200, width: 250}}></Image>
                    <View
                      style={{
                        ...styles.buttonScan,
                        textAlign: 'center',
                        backgroundColor: '#AE4D26',
                        borderColor: '#AE4D26',
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          textAlign: 'center',
                          alignSelf: 'center',
                        }}>
                        Scan QR Code
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* <View style={styles.buttonWrapper}>
              <Text style={{...styles.scanFooterTextStyle}}>Artifact Page</Text>
            </View>
            <View style={styles.buttonWrapper}>
              <Text style={{...styles.scanFooterTextStyle}}>Gallery Page</Text>
            </View>
            <View style={styles.buttonWrapper}>
              <Text style={{...styles.scanFooterTextStyle}}>
                Informative Page
              </Text>
            </View>
            <View style={styles.buttonWrapper}>
              <Text style={{...styles.scanFooterTextStyle}}>Group Page</Text>
            </View>
            <View style={styles.buttonWrapper}>
              <Text style={{...styles.scanFooterTextStyle}}>CategoryPage</Text>
            </View> */}
              </>
            )}
            {ScanResult && (
              <Fragment>
                <View>
                  <Spinner visible={true} color="#A4451F" />
                </View>
              </Fragment>
            )}
            {scan && (
              <QRCodeScanner
                reactivate={true}
                showMarker={true}
                ref={node => {
                  scanner = node;
                }}
                onRead={onSuccess}
                topContent={
                  <Text style={styles.centerText}>
                    Please move your camera {'\n'} over the QR Code
                  </Text>
                }
                bottomContent={
                  <View style={{marginTop: 50}}>
                    <TouchableOpacity onPress={() => setScan(false)}>
                      <MaterialCommunityIcons
                        name="sync"
                        color="#fff"
                        size={50}
                      />
                    </TouchableOpacity>
                  </View>
                }
              />
            )}
          </Fragment>
        </View>
      </SafeAreaView>
    </>
  );
};
export default ScannerPage;
