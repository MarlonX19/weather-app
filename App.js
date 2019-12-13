import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  FlatList,
  Image,
  ImageBackground
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { fromUnixTime } from 'date-fns'

import Search from './src/components/Search';


import { DARK_SKY_URL } from './config/consts';
import rainy from './assets/rainyweather.jpg'
import sunny from './assets/sunnyweather.jpg'
import ordinary from './assets/ordinary.jpg'

const App = () => {
  const [location, setLocation] = useState({});
  const [summary, setSummary] = useState('');
  const [weekData, setWeekData] = useState([]);
  const [cityName, setcityName] = useState('Minha região');


  //Sets latitude, longitude and city name to the whole component
  const geoCode = async (latitude, longitude, cityName) => {
    axios.get(`${DARK_SKY_URL}/${latitude},${longitude}?lang=pt&units=si`)
      .then(function (response) {
        // handle success
        console.log(response)
        setLocation({ 'lat': response.data.latitude, 'long': response.data.longitude })
        let { summary } = response.data.daily;
        setSummary(summary)
        let data = response.data.daily.data;
        setcityName(cityName)
        setWeekData(data)
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
            geoCode(latitude, longitude, cityName)
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

  
  const fromTimestampToDay = (timestamp) => {
    let day = fromUnixTime(timestamp)
    let res = day.toString()
    let finalres = res.substring(0, 3)

    return finalres;
  }

  const find = async (res) => {
    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${res.description}.json?access_token=pk.eyJ1IjoibWFybG9uYmVubmV0IiwiYSI6ImNrM3o5MnY0ZDA4a3ozbHBwcDVvbGdxMzkifQ.yv0dR5O-EZe71ndYaFSTeQ&limit=1`)
      .then(resp => { geoCode(resp.data.features[0].center[1], resp.data.features[0].center[0], resp.data.features[0].text) })
      .catch(err => console.log(err))
  }

  const img = weekData[0] ? weekData[0].icon === 'rain' ? rainy : sunny : ordinary

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
      <ImageBackground source={img} style={{width: '100%', height: '100%'}}>
        <View style={styles.headerView}>
          <Search fun={find} cityName={cityName} />
        </View>
        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
        {weekData[0] ? <Text style={{ fontSize: 32, color: '#fff', fontFamily: 'sans-serif-light', paddingLeft: 5 }}>{weekData[0].summary} </Text> : <Text>''</Text>}
        </View>
        <View style={{ flex: 2 }}>
          <Text style={{ fontSize: 24, fontFamily: 'sans-serif-light', paddingLeft: 5 }}>Resumo diário</Text>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={weekData}
            renderItem={({ item, index }) => (
              <View style={{ marginHorizontal: 5, height: 120, width: 120, borderColor: '#ccc', borderWidth: 0.1, borderRadius: 5, backgroundColor: 'rgba(52, 52, 52, 0.4)' }} >
                <View style={{ flex: 1 }}>
                  <Text style={{ paddingLeft: 3, fontSize: 18, fontFamily: 'sans-serif-light', color: '#fff' }}>{fromTimestampToDay(item.time)}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                    {100 - Math.floor(item.precipProbability * 100) > 50 ? 
                       <View style={{ flexDirection: 'row'}}> 
                       <Text style={{ paddingLeft: 3, fontFamily: 'sans-serif-light', color: '#fff' }}>
                         {Math.floor(100 - item.precipProbability * 100)}%</Text>
                          <Image style={{ height: 25, width: 25 }} source={require('./assets/sunny.png')} /> 
                       </View> :
                       <View style={{ flexDirection: 'row'}}> 
                       <Text style={{ paddingLeft: 3, fontFamily: 'sans-serif-light', color: '#fff' }}>{Math.floor(item.precipProbability * 100)}%</Text>
                        <Image style={{ height: 25, width: 25 }} source={require('./assets/rain.png')} /> 
                      </View>
                    }

                  </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'space-around', marginLeft: 3 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image style={{ height: 15, width: 15 }} source={require('./assets/up.png')} />
                    <Text style={{ fontSize: 11, color: '#fff' }}> {Math.floor(item.temperatureMax)} C°</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Image style={{ height: 15, width: 15 }} source={require('./assets/down.png')} />
                    <Text style={{ fontSize: 11, color: '#fff' }}> {Math.floor(item.temperatureMin)} C°</Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={item => item.time.toString()}
          />

        </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );


};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  headerView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: 5
  }
});
