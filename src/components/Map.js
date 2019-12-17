import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import MapView from 'react-native-maps';

export default function Map(props) {

    let { lat, long } = props.location;


    return (
        <Animated.View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Explorar mapa</Text>
            </View>
            <MapView
                style={styles.mapview}
                region={{
                    latitude: lat ? lat : -22.3353565,
                    longitude: long ? long: -47.4695278,
                    latitudeDelta: 0.0243,
                    longitudeDelta: 0.0234
                }}
                showsUserLocation
                loadingEnabled
            />
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
        justifyContent: 'center',
        alignItems: 'center',
    },

    headerText: {
        fontSize: 26,
        color: '#fff',
        fontFamily: 'sans-serif-light',
    },

    mapview: {
        flex: 9
    }
})
