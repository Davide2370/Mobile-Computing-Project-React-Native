import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LifeBar = ({ currentLife, maxLife }) => {
  // Calcola la percentuale di vita rimasta
  const percentage = (currentLife / maxLife) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${percentage}%` }]} />
      <Text style={styles.text}>{currentLife}/{maxLife}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  bar: {
    height: 20,
    backgroundColor: 'green', // Colore della barra
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LifeBar;
