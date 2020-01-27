import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from 'firebase';

import test from '../../assets/test.png'


export default function Map(props) {
    const [imgUri, setImgUri] = useState('');
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [photoSelected, setPhotoSelected] = useState(false);
    const [data, setData] = useState([]);



    const uploadFromGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            setImgUri(image.path)
            setPhotoSelected(true)
            console.log(image);
        });

    }

    const handleUpload = async () => {
        let lati = '';
        let longi = '';
        Geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                lati = latitude;
                longi = longitude
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
        );


        const response = await fetch(imgUri);
        const blob = await response.blob()
        var filePath = 'imageId' // + '.' + currentFileType

        var uploadTask = firebase.storage().ref('img').child(filePath).put(blob)

        uploadTask.on('state_changed', function (snapshot) {
        }, function (error) {
            console.log(error)
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                processUpload(downloadURL, lati, longi)
            })

        })
    }

    const processUpload = (imageUrl, lati, longi) => {
        var dateTime = Date.now();
        var timestamp = Math.floor(dateTime / 1000);

        //Build photo obj
        var photoObj = {
            tit: title,
            caption: desc,
            posted: timestamp,
            url: imageUrl,
            latitude: lati,
            longitude: longi
        }

        firebase.database().ref('/photos/').push(photoObj)

        Alert.alert(
            'Photo uploaded',
            'Your new photo is already available',
            [
                { text: 'Ok', onPress: () => { } },
            ],
            { cancelable: false },
        );

        setPhotoSelected(false)
        setImgUri('')
        fetchData()
    }

    const uploadFromCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            console.log(image);
        });
    }

    let { lat, long } = props.location;

    const fetchData = () => {
        let vals = []
        firebase.database().ref('photos/').once('value').then(function (snapshot) {

            for (var item in snapshot.val()) {
                vals.push(snapshot.val()[item])
            }
            setData(vals)
        }).catch(error => console.log(error))
    }

    useEffect(() => {
        setData(props.mapdata)
    })



    return (
        <Animated.View style={styles.container}>
            <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => uploadFromGallery()}
                        style={{ padding: 5, flex: 1 }}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Tirar foto</Text>
                    </TouchableOpacity> 
                <Text style={styles.headerText}>Explorar mapa</Text>
                {photoSelected == true ? (
                    <TouchableOpacity
                        disabled={!photoSelected}
                        onPress={() => handleUpload()}
                        style={{ flex: 1 }}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center' }}>Publicar</Text>
                    </TouchableOpacity>
                ) : (
                        <View style={{ flex: 1 }}>
                        </View>
                    )}

            </View>
            {photoSelected == true ? (
                <View style={{ backgroundColor: '#fff', flex: 9, padding: 10 }}>
                    <TextInput
                        placeholder='Título'
                        placeholderTextColor='grey'
                        editable
                        maxLength={20}
                        onChangeText={text => setTitle(text)}
                        value={title}
                        style={{ borderBottomColor: 'lightblue', borderBottomWidth: 1, alignSelf: 'center' }}
                    />
                    <TextInput
                        placeholder='Descreva a situação do local'
                        placeholderTextColor='grey'
                        multiline
                        numberOfLines={2}
                        editable
                        maxLength={50}
                        onChangeText={text => setDesc(text)}
                        value={desc}
                        style={{ borderBottomColor: 'lightblue', borderBottomWidth: 1, alignSelf: 'center' }}
                    />
                    <Image style={{ width: '100%', height: 400, resizeMode: 'cover', marginBottom: 20 }} source={{ uri: imgUri }} />
                </View>
            ) : (
                    <MapView
                        style={styles.mapview}
                        region={{
                            latitude: data.latitude ? data.latitude : -22.3353565,
                            longitude: data.longitude ? data.longitude : -47.4695278,
                            latitudeDelta: 0.0243,
                            longitudeDelta: 0.0234
                        }}
                        showsUserLocation
                        loadingEnabled
                    >
                        {data.map(x =>
                            <Marker
                                coordinate={{
                                    latitude: x.latitude ? x.latitude : -22.3353565,
                                    longitude: x.longitude ? x.longitude : -47.4695278,
                                }
                                }
                                title={x.caption}
                                description={x.tit}
                                anchor={{ x: 0, y: 0 }}
                                onPress={() => { }}
                            >
                                <View>
                                    <Image style={{ width: 50, height: 50, borderRadius: 50, borderWidth: 0.5, borderColor: 'purple' }} source={{ uri: x.url }} />
                                </View>
                            </Marker>
                        )}
                    </MapView>
                )}

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
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerText: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#fff',
        fontFamily: 'sans-serif-light',
    },

    mapview: {
        flex: 9
    }
})
