import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';

// import { Container } from './styles';

export default class Search extends Component {
    constructor(props){
        super(props)
    }
    

    state = {
        isSearchFocused: false
    }

   async find(res){
    console.log(res)
    axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${res}.json?access_token=pk.eyJ1IjoibWFybG9uYmVubmV0IiwiYSI6ImNrM3o5MnY0ZDA4a3ozbHBwcDVvbGdxMzkifQ.yv0dR5O-EZe71ndYaFSTeQ&limit=1`)
        .then(res => console.log(res.data.features[0].center))
        .catch(err => console.log(err))
   }


    render() {
        const { isSearchFocused } = this.state;

        return  <GooglePlacesAutocomplete
                placeholder= 'Araras'
                placeholderTextColor="#333"
                onPress={(res) => this.props.fun(res)}
                query={{
                    key: 'AIzaSyBhAwIwcJLk10RVN1eQIWGiESlcZZnFjcE',
                    language: 'pt'
                }}
                textInputProps={{
                    onFocus: () => { this.setState({ isSearchFocused: true }) },
                    onBlur: () => { this.setState({ isSearchFocused: false }) },
                    autoCapitalize: 'none',
                    autoCorrect: false
                }}
                fetchDetails
                enablePoweredByContainer={false}
                listViewDisplayed={isSearchFocused}
                styles={{
                    container: {
                        position: 'absolute',
                        top: Platform.select({ ios: 60, android: 30 }),
                        width: '100%'
                    },
                    textInputContainer: {
                        flex: 1,
                        backgroundColor: 'transparent',
                        height: 54,
                        marginHorizontal: 20,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                    },
                    textInput: {
                        height: 54,
                        margin: 0,
                        borderRadius: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        paddingLeft: 15,
                        paddingRight: 15,
                        marginTop: 0,
                        marginBottom: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        elevation: 2,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: {x: 0, y: 0},
                        shadowRadius: 15,
                        borderWidth: 0.6,
                        borderColor: "#DDD",
                        fontSize: 18
                    },
                    listView: {
                        borderWidth: 1,
                        borderColor: "#DDD",
                        backgroundColor: "#FFF",
                        marginHorizontal: 20,
                        elevation: 5,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: {x: 0, y: 0},
                        shadowRadius: 10,
                        marginTop: 3,
                    },
                    description: {
                        fontSize: 14,
                    },
                    row: {
                        padding: 10,
                        height: 40
                    }
                  
                }}
           />
    }
}