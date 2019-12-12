import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  PermissionsAndroid
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';


import { DARK_SKY_URL } from './config/consts';


const App = () => {
  const [location, setLocation] = useState({});
  const [summary, setSummary] = useState('');

  const geoCode = async (latitude, longitude) => {
    axios.get(`${DARK_SKY_URL}/${latitude},${longitude}?lang=pt`)
      .then(function (response) {
        // handle success
        console.log(response);
        let { summary } = response.data.daily;
        setSummary(summary)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }

  const getLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de localização',
          message:
            'Necessário para funcionar',
          buttonNeutral: 'Depois',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            setLocation({ 'lat': latitude, 'long': longitude })
            geoCode(latitude, longitude)
          },
          (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
        );

      } else {
        console.log('Fine Location permission denied');
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getLocation()

  }, [])



  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <Text>{summary}</Text>
      </SafeAreaView>
    </>
  );


};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
