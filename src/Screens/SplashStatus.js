import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import LoginPage from '../Screens/LoginPage';
const SplashStatus = ({navigation}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContainer}>
        <View style={{marginRight: '75%', marginTop: 180}}>
          <Image
            source={require('../images/quote.png')}
            style={{width: 52, height: 41}}
          />
        </View>

        <Text
          style={{
            color: 'white',
            marginLeft: '5%',
            fontSize: 12,
            marginTop: 10,
          }}>
          The Soul of india shiness through the skilful hands of Odisha
        </Text>
        <Text
          style={{
            color: 'white',
            marginRight: '40%',
            marginTop: 10,
            fontSize: 12,
          }}>
          -Hon'ble CM Naveen Patnaik
        </Text>
        <Text
          style={{
            color: 'white',
            marginTop: 70,
            marginRight: '35%',
            fontSize: 19,
            fontWeight: '500',
          }}>
          Explore the world of
        </Text>
        <Text
          style={{
            color: '#a4451f',
            marginTop: 5,
            marginRight: '50%',
            fontSize: 19,
            fontWeight: '500',
          }}>
          Kala Bhoomi
        </Text>
        <View style={{marginTop: 20}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('LoginPage');
            }}>
            <Text style={{color: 'white'}}>
              GET STARTED
              <Image
                source={require('../images/right.png')}
                style={{width: 22, height: 14}}
              />
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default SplashStatus;

const styles = StyleSheet.create({
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
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: '40%',
  },
  button: {
    backgroundColor: '#AE4D26',
    paddingHorizontal: 30,
    padding: 10,
    marginVertical: 15,
    width: '70%',
    borderRadius: 100,
    display: 'flex',
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
});
