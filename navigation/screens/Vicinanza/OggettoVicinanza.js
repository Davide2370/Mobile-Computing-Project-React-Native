import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,ActivityIndicator } from 'react-native';
import CombattimentoPage from './ComponentsVicinanza/CombattimentoPage';
import CombattimentoRisultatoPage from './ComponentsVicinanza/CombattimentoRisultatoPage';
import EquipaggiaOggettoPage from './ComponentsVicinanza/EquipaggiaOggettoPage';
import ConsumaCaramella from './ComponentsVicinanza/ConsumaCaramella';
import OggettoRisultatoPage from './ComponentsVicinanza/OggettoRisultatoPage';
import CaramellaRisultatoPage from './ComponentsVicinanza/CaramellaRisultatoPage';
import { StileGlobale } from '../../../styles/StileGlobale';

class OggettoVicinanza extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextPage: false,
      confirmPage: false,
      loading:false,
    };
  }

  //è semplicemente una funzione che aggiusta il valore this
  primaPagina = () => {
    //prendo prevstate e lo inverto
    this.setState((prevState) => ({ nextPage: !prevState.nextPage }));
  };


  render() {
    const { selectedObject, handlePaginaOggetto, vicinanzaViewModel } = this.props;
    const minLifeLoss = selectedObject.level;
    const maxLifeLoss = selectedObject.level * 2;
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
    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    if (!selectedObject) {
      // Se selectedObject è null o undefined, mostra un messaggio o comportamento adeguato
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Nessun oggetto selezionato</Text>
          <TouchableOpacity style={styles.backButton} onPress={handlePaginaOggetto}>
            <Text style={styles.backButtonText}>Indietro</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if(this.state.confirmPage == true){
      if(selectedObject.type == "monster"){
        return (
          <CombattimentoRisultatoPage
                handlePaginaOggetto={handlePaginaOggetto}
                vicinanzaModel={vicinanzaViewModel}
                onCancel={() => this.setState({ confirmPage: false })}
              />
        )
      } else if (selectedObject.type === "amulet" || selectedObject.type === "weapon" || selectedObject.type === "armor") {
        return (
          <OggettoRisultatoPage
                selectedObject={selectedObject}
                handlePaginaOggetto={handlePaginaOggetto}
                onCancel={() => this.setState({ confirmPage: false })}
              />
        )
      }else if(selectedObject.type == "candy"){
        return(
          <CaramellaRisultatoPage
            handlePaginaOggetto={handlePaginaOggetto}
            onCancel={() => this.setState({ confirmPage: false })}
            />
        );
      }
    }else if(this.state.nextPage == true){
      if(selectedObject.type == "monster"){
        return (
          <CombattimentoPage
                minLifeLoss={minLifeLoss}
                maxLifeLoss={maxLifeLoss}
                vicinanzaModel={vicinanzaViewModel}
                handlePaginaOggetto={this.handlePaginaOggetto}
                onConfirm={async () => {
                  await vicinanzaViewModel.attivaOggetto(selectedObject.id);
                  this.setState({ confirmPage: true });
                }}
                onCancel={() => this.setState({ nextPage: false })}
              />
        );
      } else if (selectedObject.type === "amulet" || selectedObject.type === "weapon" || selectedObject.type === "armor") {
        return (
          <EquipaggiaOggettoPage
                selectedObject={selectedObject}
                handlePaginaOggetto={this.handlePaginaOggetto}
                onConfirm={async () => {
                  this.setState({ loading:true });
                  await vicinanzaViewModel.attivaOggetto(selectedObject.id);
                  this.setState({ confirmPage: true });
                  this.setState({ loading:false });

                }}
                onCancel={() => this.setState({ nextPage: false })}
              />
        );
      }else if(selectedObject.type == "candy"){
        return (
          <ConsumaCaramella
                selectedObject={selectedObject}
                handlePaginaOggetto={this.handlePaginaOggetto}
                onConfirm={async () => {
                  await vicinanzaViewModel.attivaOggetto(selectedObject.id);
                  this.setState({ confirmPage: true });
                  
                }}
                onCancel={() => this.setState({ nextPage: false })}
              />
          );
      }
   
    }else{
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Dettagli Oggetto</Text>
  
          <Image
            source={
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
              selectedObject.type === 'candy' && styles.candyBorder,
              selectedObject.type === 'weapon' && styles.weaponBorder,
            ]}
          />
           <Text style={styles.detailText}><Text style={styles.boldText}>Nome:</Text> {selectedObject.name}</Text>
           <Text style={styles.detailText}><Text style={styles.boldText}>Tipo:</Text> {tipoVisualizzato}</Text>
           <Text style={styles.detailText}><Text style={styles.boldText}>Livello:</Text> {selectedObject.level}</Text>

  
          
  
            {/* Mostra il pulsante "Attiva" solo se selectedObject.vicino è true */}
            {selectedObject.vicino ? (
              <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handlePaginaOggetto}>
                <Text style={styles.backButtonText}>Indietro</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.activateButton} onPress={this.primaPagina}>
                <Text style={styles.backButtonText}>
                  {selectedObject.type === 'monster' ? 'Combatti' : 'Attiva'}
                </Text>
              </TouchableOpacity>
              </View>

            ) : (
                // blocco else
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton2} onPress={handlePaginaOggetto}>
                  <Text style={styles.backButtonText}>Indietro</Text>
                </TouchableOpacity>
                </View>
              )}
        </View>
      );
    }
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
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Aggiunto per centrare il testo

  },
  imageBorder: {
    borderWidth: 2, // Spessore della cornice
    borderColor: 'black', // Colore della cornice
  },
  image: {
    width: 95, // La larghezza dell'immagine occupa il 100% del contenitore
    height: 95, // Altezza desiderata
    aspectRatio: 1, // Imposta il rapporto di aspetto per mantenere le proporzioni originali
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Ridotto il padding orizzontale
  },
  backButton: {
    flex: 1,
    marginRight: 6,
    marginLeft: 65,

    paddingVertical: 8, // Ridotto il padding verticale
    paddingHorizontal: 8, // Ridotto il padding orizzontale
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  activateButton: {
    flex: 1,
    marginRight: 65,
    marginLeft: 6,

    paddingVertical: 8, // Ridotto il padding verticale
    paddingHorizontal: 8, // Ridotto il padding orizzontale
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  backButton2: {
    flex: 1,
    marginRight: 120,
    marginLeft: 120,

    paddingVertical: 8, // Ridotto il padding verticale
    paddingHorizontal: 8, // Ridotto il padding orizzontale
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: StileGlobale.coloreScritte,

  }
});

export default OggettoVicinanza;
