import React from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Lottie from 'lottie-react-native';

import test from '../../assets/test.png'

import lottieArrow from '../assets/lottieArrow.json'

export default function Map(props) {

    let { lat, long } = props.location;


    return (
        <Animated.View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Text style={styles.headerText}>Explorar mapa</Text>
                </View>
                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', marginLeft: 40 }}>
                  
                </View>
            </View>
            <MapView
                style={styles.mapview}
                region={{
                    latitude: lat ? lat : -22.3353565,
                    longitude: long ? long : -47.4695278,
                    latitudeDelta: 0.0243,
                    longitudeDelta: 0.0234
                }}
                showsUserLocation
                loadingEnabled
            >
                <Marker
                    coordinate={{
                        latitude: lat ? lat : -22.3353565,
                        longitude: long ? long : -47.4695278,
                    }
                    }
                    title='ALAGADO'
                    description='alagadíssimo aqui'
                    anchor={{ x: 0, y: 0 }}
                    onPress={() => { }}
                >
                    <View>
                        <Image style={{ width: 50, height: 50, borderRadius: 50, borderWidth: 0.5, borderColor: 'purple' }} source={test} />
                    </View>
                </Marker>
            </MapView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        height: '100%'
    },

    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerText: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'sans-serif-light',
    },

    mapview: {
        flex: 9
    }
})
