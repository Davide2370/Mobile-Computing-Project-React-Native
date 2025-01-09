import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ActivityIndicator} from 'react-native';
import { StileGlobale } from '../../../../styles/StileGlobale';
const EquipaggiaOggettoPage = ({ selectedObject, onConfirm, onCancel }) => {

  let message = `Vuoi equipaggiare ${selectedObject.name}?`;
  let message2 = '';

  if (selectedObject.type === 'amulet') {
    const distance = 100 + selectedObject.level;
    message2 = `Potrai attivare gli oggetti a ${distance} metri di distanza`;
  } else if (selectedObject.type === 'weapon') {
    message2 = `Avrai il ${selectedObject.level}% in meno dei danni nel combattimento`;
  } else if (selectedObject.type === 'armor') {
    message2 = `Potrai arrivare fino a ${100 + selectedObject.level} punti vita`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.distanceText}>{message2}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Text style={styles.backButtonText}>Indietro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.equipButton} onPress={onConfirm}>
          <Text style={styles.backButtonText}>Equipaggia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: StileGlobale.coloreScritte,
  },
  equipButton: {
    flex: 1,
    marginRight: 60,
    marginLeft: 6, 
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  messageText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  distanceText: {
    marginBottom: 10,
  },
  backButton: {
    flex: 1, // Utilizza flex per distribuire dinamicamente la larghezza
    marginRight: 6, // Aggiunto un margine per separare i pulsanti
    marginLeft: 60, // Aggiunto un margine per separare i pulsanti
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Ridotto il padding orizzontale
  },
});
export default EquipaggiaOggettoPage;
