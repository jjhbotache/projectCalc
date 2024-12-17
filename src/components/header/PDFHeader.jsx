
import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  madeBy: {
    fontSize: 8,
    color: 'gray',
    marginLeft: 2,
  },
  author: {
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

const PDFHeader = () => (
  <View style={styles.header}>
    <Image src="pngs/DevKalk.png" style={styles.logo} />
    <View style={styles.column}>
      <Text style={styles.title}>DevKalk</Text>
      <Text style={styles.madeBy}>Made by:</Text>
      <Text style={styles.author}>Juan Jose Huertas Botache</Text>
    </View>
  </View>
);

export default PDFHeader;