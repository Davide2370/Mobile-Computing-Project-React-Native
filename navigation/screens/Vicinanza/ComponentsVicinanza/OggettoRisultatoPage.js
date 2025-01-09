import React, { Component } from 'react';
import { View, Text, TouchableOpacity,StyleSheet,ActivityIndicator } from 'react-native';
import VicinanzaViewModel from '../../../../viewModels/VicinanzaViewModel';
import { StileGlobale } from '../../../../styles/StileGlobale';
class OggettoRisultatoPage extends Component {

  render() {

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: StileGlobale.coloreScritte,
      },
      content: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      risultatoText: {
        fontWeight: 'bold',
        fontSize:18,
        marginTop: 10,
      },
      backButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'tomato',
        borderRadius: 5,
      },
      backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center', // Aggiunto per centrare il testo
    
      },
    });

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.risultatoText}>{this.props.selectedObject.name} Equipaggiato!</Text>
          <TouchableOpacity style={styles.backButton} onPress={this.props.handlePaginaOggetto}>
            <Text style={styles.backButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default OggettoRisultatoPage;
