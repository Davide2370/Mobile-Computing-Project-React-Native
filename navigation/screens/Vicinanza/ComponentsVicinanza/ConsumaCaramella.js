import React from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import { StileGlobale
 } from '../../../../styles/StileGlobale';
const ConsumaCaramella = ({ selectedObject, onConfirm, onCancel }) => {

  message = `Vuoi consumare ${selectedObject.name}?`;
  message2 = `Otterrai tra i ${selectedObject.level} e i ${selectedObject.level*2} punti vita`;
  return (
    <View style={styles.container}>     
      <View style={{ padding: 20, borderRadius: 10, alignItems: 'center' }}>
        <Text style={styles.boldText}>{message}</Text>
        <Text >{message2}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Text style={styles.backButtonText}>Indietro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.consumeText} onPress={onConfirm}>
          <Text style={styles.backButtonText}>Consuma</Text>
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
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    flex: 1, // Utilizza flex per distribuire dinamicamente la larghezza
    marginRight: 6, // Aggiunto un margine per separare i pulsanti
    marginLeft: 65, // Aggiunto un margine per separare i pulsanti
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  consumeText: {
    flex: 1,
    marginRight: 65,
    marginLeft: 6, 
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

export default ConsumaCaramella;
