import React, { useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


const Search = (props) => {
   const [isSearchFocused, setIsSearchFocused] = useState(false);

        return  <GooglePlacesAutocomplete
                placeholder={isSearchFocused ? '' : props.cityName}
                placeholderTextColor="#333"
                onPress={(res) => props.handleLocationSearch(res)}
                query={{
                    key: 'AIzaSyBhAwIwcJLk10RVN1eQIWGiESlcZZnFjcE',
                    language: 'pt'
                }}
                textInputProps={{
                    onFocus: () => { setIsSearchFocused(true) },
                    onBlur: () => { setIsSearchFocused(false) },
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
                        width: '100%',
                        zIndex: 6
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

export default Search;
