import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import ProfileViewModel from '../../../viewModels/ProfileViewModel';  // Assicurati di importare il modulo ProfileViewModel correttamente
import { StileGlobale } from '../../../styles/StileGlobale';

class DettagliOggettoProfilo extends React.Component {
  constructor(props) {
    super(props);
    this.ProfileViewModel = new ProfileViewModel();
    this.state = {
      selectedObject: null,
    };
  }

  async componentDidMount() {
    const selectedObject = await this.ProfileViewModel.getArtifactDetails(this.props.idSelectedObject);
    this.setState({ selectedObject });
  }

  render() {
    const { onCancel } = this.props;
    const { selectedObject } = this.state;

    if (!selectedObject) {
      return (
        <View style={styles.container}>
          <Text>Caricamento in corso...</Text>
        </View>
      );
    }

    let typeSpecificMessage;

    if (selectedObject.type === 'weapon') {
      typeSpecificMessage = `Hai il ${selectedObject.level}% di danni in meno nel combattimento`;
    } else if (selectedObject.type === 'amulet') {
      const distance = 100 + selectedObject.level ; 
      typeSpecificMessage = `Attivi gli oggetti fino a ${distance} metri di distanza`;
    } else if (selectedObject.type === 'armor') {
      typeSpecificMessage = `Puoi arrivare fino a ${100+selectedObject.level} punti vita`;
    }

    let tipoVisualizzato;
    switch (selectedObject.type) {
      case 'candy':
        tipoVisualizzato = 'Caramella';
        break;
      case 'amulet':
        tipoVisualizzato = 'Amuleto';
        break;
      case 'weapon':
        tipoVisualizzato = 'Arma';
        break;
      case 'armor':
        tipoVisualizzato = 'Armatura';
        break;
      case 'monster':
        tipoVisualizzato = 'Mostro';
        break;
      default:
        tipoVisualizzato = selectedObject.type;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Dettagli Oggetto</Text>
        <Image source={
            selectedObject.image
              ? { uri: `data:image/png;base64,${selectedObject.image}` }
              : selectedObject.type === 'monster'
              ? require("../../../assets/icona_mostro.png")
              : selectedObject.type === 'amulet'
              ? require("../../../assets/icona_amuleto.png")
              : selectedObject.type === 'candy'
              ? require("../../../assets/icona_caramella.png")
              : selectedObject.type === 'armor'
              ? require("../../../assets/icona_armatura.png")
              : selectedObject.type === 'weapon'
              ? require("../../../assets/icona_spada.png")
              : { uri: `data:image/png;base64,${selectedObject.image}` }
          }
          style={[
            styles.image,
            styles.imageBorder,
            selectedObject.type === 'monster' && styles.monsterBorder,
            selectedObject.type === 'amulet' && styles.amuletBorder,
            selectedObject.type === 'armor' && styles.armorBorder,
            selectedObject.type === 'candy' && styles.candyBorder,
            selectedObject.type === 'weapon' && styles.weaponBorder,
          ]}/>
        <Text style={styles.detailText}><Text style={styles.boldText}>Nome:</Text> {selectedObject.name}</Text>
        <Text style={styles.detailText}><Text style={styles.boldText}>Tipo:</Text> {tipoVisualizzato}</Text>
        <Text style={styles.detailText}><Text style={styles.boldText}>Livello:</Text> {selectedObject.level}</Text>
        <Text style={styles.detailText}>{typeSpecificMessage}</Text>

        <TouchableOpacity style={styles.backButton} onPress={onCancel}>
          <Text style={styles.backButtonText}>Indietro</Text>
        </TouchableOpacity>
      </View>
    );
  
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: StileGlobale.coloreScritte,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageBorder: {
    borderWidth: 2, // Spessore della cornice
    borderColor: 'black', // Colore della cornice
  },
  image: {
    width: 100, // La larghezza dell'immagine occupa il 100% del contenitore
    height: 100, // Altezza desiderata
    aspectRatio: 1, // Imposta il rapporto di aspetto per mantenere le proporzioni originali
  },
  boldText: {
    fontWeight: 'bold',
  },
  monsterBorder: {
    borderColor: '#DC143C', 
  },
  candyBorder: {
    borderColor: 'orange', 
  },
  amuletBorder: {
    borderColor: 'purple', 
  },
  weaponBorder: {
    borderColor: '#483D8B', // blu scuro
  },
  armorBorder: {
    borderColor: 'green', // blu scuro
  },
});

export default DettagliOggettoProfilo;
