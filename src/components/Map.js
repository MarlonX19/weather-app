import React from 'react';
import { View, Text, StyleSheet, Animated} from 'react-native';

export default function Map() {
  return (
      <View style={styles.container}>
          <Text>Ver pontos de chuva, alagamento etc!</Text>  
      </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
