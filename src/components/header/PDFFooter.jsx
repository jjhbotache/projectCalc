import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  logo: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 9,
  },
  small: {
    fontSize: 7,
    color: 'gray',
  },
});

const PDFFooter = () => (
  <View style={styles.footer}>
    <Image src="pngs/DevKalk.png" style={styles.logo} />
    <Text style={styles.small}>Devkalk was made by: </Text>
    <Text style={styles.text}>Juan Jose Huertas Botache</Text>
  </View>
);

export default PDFFooter;
