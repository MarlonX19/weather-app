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
  ImageBackground,
  Animated,
  ActivityIndicator
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { fromUnixTime } from 'date-fns'
import Lottie from 'lottie-react-native';
import firebase from 'firebase';

import Search from './src/components/Search';
import Map from './src/components/Map';
import { firebaseConfig } from './config/firebase';


import { DARK_SKY_URL } from './config/consts';
import rainy from './assets/rainyweather.jpg'
import sunny from './assets/sunnyweather.jpg'
import ordinary from './assets/ordinary.jpg'

import sunnyLottie from './src/assets/sunnyLottie.json'
import sunLottie from './src/assets/sunLottie.json'
import rainyLottie from './src/assets/rainyLottie.json'
import snowLottie from './src/assets/snowLottie.json'
import cloudyLottie from './src/assets/cloudyLottie.json'
import weatherLottie from './src/assets/weatherLottie.json'


const App = () => {
  let offset = 0;
  const [currentlyData, setCurrentlyData] = useState({});
  const [location, setLocation] = useState({});
  const [weekData, setWeekData] = useState([]);
  const [cityName, setCityName] = useState('Minha região');

  const translateY = new Animated.Value(0);
  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY
        }
      }
    ],
    { useNativeDriver: true }
  )

  function onHandlerStateChange(event) {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = false;
      const { translationY } = event.nativeEvent;
      offset += translationY;

      if (translationY <= 80) {
        opened = true;
      } else {
        translateY.setValue(offset);
        translateY.setOffset(0);
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? -510 : 0,
        duration: 400,
        useNativeDriver: true
      }).start(() => {
        offset = opened ? -510 : 0
        translateY.setOffset(offset);
        translateY.setValue(0);
      });

    }
  }


  //Sets latitude, longitude and city name to the whole component
  const geoCode = async (latitude, longitude, cityName) => {
    axios.get(`${DARK_SKY_URL}/${latitude},${longitude}?lang=pt&units=si`)
      .then(function (response) {
        setCurrentlyData(response.data.currently);
        setLocation({ 'lat': response.data.latitude, 'long': response.data.longitude })
        let data = response.data.daily.data;
        setCityName(cityName)
        setWeekData(data)
        console.log(response.data.currently)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  async function getLocation() {
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
    firebase.initializeApp(firebaseConfig);
    getLocation()

  }, [])


  const fromTimestampToDay = (timestamp) => {
    let day = fromUnixTime(timestamp)
    let res = day.toString()
    let finalres = res.substring(0, 3)

    return finalres;
  }

  const handleLocationSearch = async (res) => {
    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${res.description}.json?access_token=pk.eyJ1IjoibWFybG9uYmVubmV0IiwiYSI6ImNrM3o5MnY0ZDA4a3ozbHBwcDVvbGdxMzkifQ.yv0dR5O-EZe71ndYaFSTeQ&limit=1`)
      .then(resp => { geoCode(resp.data.features[0].center[1], resp.data.features[0].center[0], resp.data.features[0].text) })
      .catch(err => console.log(err))
  }

  const img = weekData[0] ? weekData[0].icon === 'rain' ? rainy : sunny : ordinary

  const handleLottieIcon = () => {
    let summary = currentlyData.summary.toLowerCase();

    if (summary.includes('sol') || summary.includes('limpo')) {
      return <Lottie style={{ width: 150, height: 150 }} autoPlay loop source={sunnyLottie} />
    }
    else if (summary.includes('neve')) {
      return <Lottie style={{ width: 150, height: 150 }} autoPlay loop source={snowLottie} />
    }

    else if (summary.includes('chuva') || summary.includes('chuviscos') || summary.includes('tempestade')) {
      return <Lottie style={{ width: 150, height: 150 }} autoPlay loop source={rainyLottie} />
    }

    else if (summary.includes('nublado') || summary.includes('núvens')) {
      return <Lottie style={{ width: 150, height: 150 }} autoPlay loop source={cloudyLottie} />
    }

    else {
      return <Lottie style={{ width: 150, height: 150 }} autoPlay loop source={weatherLottie} />
    }

  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ImageBackground source={img} style={{ width: '100%', height: '100%' }}>
          <Animated.View style={[styles.currentInfoView, { opacity: translateY.interpolate({ inputRange: [-510, 0], outputRange: [0, 1] }) }]}>
            <Animated.View style={[styles.summaryView, { opacity: translateY.interpolate({ inputRange: [-510, 0], outputRange: [0, 1] }) }]}>
              <Animated.View style={{ flex: 1 }}>
                {currentlyData ? <Animated.Text style={[styles.summaryText, { opacity: translateY.interpolate({ inputRange: [-300, 0], outputRange: [0, 1] }) }]}>{currentlyData.summary} </Animated.Text> : <Text>''</Text>}
                {currentlyData.temperature ? <Animated.Text style={[styles.summaryText, { opacity: translateY.interpolate({ inputRange: [-300, 0], outputRange: [0, 1] }), fontSize: 55 }]}>{Math.floor(currentlyData.temperature)} Cº </Animated.Text> : <Text>''</Text>}
              </Animated.View>
              {currentlyData.summary ?
                <Animated.View style={styles.summaryLottieView}>
                  {handleLottieIcon()}
                </Animated.View> : <ActivityIndicator size='large' />}

            </Animated.View>
          </Animated.View>
          <View>
            <Animated.Text style={{ opacity: translateY.interpolate({ inputRange: [-300, 0], outputRange: [0, 1] }), color: '#fff', fontSize: 24, fontFamily: 'sans-serif-light', paddingLeft: 5 }}>Próximos dias</Animated.Text>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={weekData}
              renderItem={({ item, index }) => (
                <Animated.View style={[styles.forcastView, { opacity: translateY.interpolate({ inputRange: [-300, 0], outputRange: [0, 1] }) }]} >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.forcastDay}>{fromTimestampToDay(item.time)}</Text>
                    <View style={styles.forcastPrecip}>
                      {100 - Math.floor(item.precipProbability * 100) > 50 ?
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.forcastPrecipText}>
                            {Math.floor(100 - item.precipProbability * 100)}%</Text>
                          <Lottie style={{ width: 25, height: 25 }} autoPlay loop source={sunLottie} />
                        </View> :
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.forcastPrecipText}>{Math.floor(item.precipProbability * 100)}%</Text>
                          <Lottie style={{ width: 25, height: 25 }} autoPlay loop source={rainyLottie} />
                        </View>
                      }
                    </View>
                  </View>
                  <View style={styles.forcastTemperature}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image style={{ height: 15, width: 15 }} source={require('./assets/up.png')} />
                      <Text style={styles.forcastTemperatureText}> {Math.floor(item.temperatureMax)} C°</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Image style={{ height: 15, width: 15 }} source={require('./assets/down.png')} />
                      <Text style={styles.forcastTemperatureText}> {Math.floor(item.temperatureMin)} C°</Text>
                    </View>
                  </View>
                </Animated.View>
              )}
              keyExtractor={item => item.time.toString()}
            />
          </View>
          <PanGestureHandler
            onGestureEvent={animatedEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[styles.AnimatedMapView, {
                transform: [{
                  translateY: translateY.interpolate({
                    inputRange: [-510, 0],
                    outputRange: [-510, 0],
                    extrapolate: 'clamp'
                  })
                }]
              }]}
            >
              <Map location={location} />
            </Animated.View>
          </PanGestureHandler>
          <Search handleLocationSearch={handleLocationSearch} cityName={cityName} />
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
  },

  currentInfoView: {
    marginTop: 100,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },

  summaryView: {
    flexDirection: 'row',
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    borderRadius: 5,
    marginHorizontal: 4
  },

  summaryLottieView: {
    flex: 1, flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },

  summaryText: {
    fontSize: 35,
    color: '#fff',
    fontFamily: 'sans-serif-light',
    paddingLeft: 5,
    fontWeight: '600'
  },

  forcastView: {
    marginHorizontal: 5,
    height: 120,
    width: 120, borderColor: '#ccc',
    borderWidth: 0.1,
    borderRadius: 5,
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },

  forcastDay: {
    paddingLeft: 3,
    fontSize: 18,
    fontFamily: 'sans-serif-light',
    color: '#fff'
  },

  forcastPrecip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  forcastPrecipText: {
    paddingLeft: 3,
    fontFamily: 'sans-serif-light',
    color: '#fff'
  },

  forcastTemperature: {
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 3
  },

  forcastTemperatureText: {
    fontSize: 11,
    color: '#fff'
  },

  AnimatedMapView: {
    backgroundColor: '#42a5f5',
    borderRadius: 5,
    height: '100%',
    left: 10,
    right: 10,
    position: 'absolute',
    zIndex: 5,
    top: 600
  }
});
