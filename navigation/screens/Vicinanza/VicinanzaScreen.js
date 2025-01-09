import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image,ActivityIndicator} from 'react-native';
import VicinanzaViewModel from '../../../viewModels/VicinanzaViewModel';
import OggettoVicinanza from './OggettoVicinanza';
import geolib from 'geolib';
import { createStackNavigator } from '@react-navigation/stack';
import { StileGlobale } from '../../../styles/StileGlobale';
import Ionicons from 'react-native-vector-icons/Ionicons';

class VicinanzaScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          oggettiVicini: [],
          oggettoData: [],
          selectedObject: null, 
          loading: true,
        };
        this.vicinanzaViewModel=new VicinanzaViewModel();
      }

  //se è un amuleto quando torno a questa schermata la ricarico poichè le vicinanze sono cambiate
  handlePaginaOggetto = () => {
    if(this.state.selectedObject.type=='amulet' || this.vicinanzaViewModel.getDied() == true){
      this.setState({ loading:true });
      this.start();
    }
    
    this.setState({ selectedObject:null });
  }
    async componentDidMount() {
      this.start();
    }      

    async start(){
      try {
        // Ottieni la classifica dalla funzione del viewmodel
        const oggettiVicini = await this.vicinanzaViewModel.getObjects();
        if (oggettiVicini !== null) {
          this.setState({ oggettiVicini });
         
          // Per ogni oggetto nei dintorni, ottieni i dettagli promise.all attende la risposta di tutte le promise
          const oggettoData = await Promise.all(
            oggettiVicini.map(async (item) => {
              const details = await this.vicinanzaViewModel.getObjectDetails(item.id,item.lat,item.lon);
              return details;
            })
          );
          /* Ora puoi stampare gli elementi di oggettoData
          oggettoData.forEach((item, index) => {
            console.log(`Element ${index + 1}:`, item.name);
          });*/

          //oggettoData è l'array che avremo
          oggettoData.sort((a, b) => {
            const vicinoA = a.vicino ? 1 : 0; // Converte il valore booleano in 1 o 0
            const vicinoB = b.vicino ? 1 : 0;
            
            return vicinoB - vicinoA; // Ordina in modo decrescente in base al valore numerico (1 o 0) di vicino quindi l'1 che sono i vicini vanno prima
          });
          this.setState({ oggettiVicini });

          this.setState({ oggettoData });
          this.setState({ loading:false });

        } else {
          // Gestisci il caso in cui oggettiVicini è null
          console.error("Oggetti vicini nulli.");
        }

      } catch (error) {
        console.error('Errore durante il recupero della classifica:', error);
      }
    }


    render() {
      const { selectedObject } = this.state;

      if (selectedObject) {
        // Se un oggetto è selezionato ritorna i dettagli dell'oggetto
        return (
          <OggettoVicinanza selectedObject={selectedObject} handlePaginaOggetto={this.handlePaginaOggetto} vicinanzaViewModel={this.vicinanzaViewModel} />
          );
      }
      if (this.state.loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
        return (
            <View style={styles.container}>
      
             {/*} <View style={styles.headerRow}>
                <Text style={[styles.headerText]}>Immagine Artefatto</Text>
                <Text style={[styles.headerText]}>Nome</Text>
                <Text style={[styles.headerText]}>Livello</Text>
                <Text style={[styles.headerText]}>Vicino</Text>
              </View>*/}
      
              <FlatList
                data={this.state.oggettoData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                    onPress={() => this.setState({ selectedObject: item })}
                    >
                    <View style={styles.row}>
                    <View style={styles.imageContainer}>
                        <Image
                        source={
                          item.image
                              ? { uri: `data:image/png;base64,${item.image}` }
                              : item.type === 'monster'
                                  ? require("../../../assets/icona_mostro.png")
                                  : item.type === 'amulet'
                                      ? require("../../../assets/icona_amuleto.png")
                                      : item.type === 'candy'
                                          ? require("../../../assets/icona_caramella.png")
                                          : item.type === 'armor'
                                              ? require("../../../assets/icona_armatura.png")
                                              : item.type === 'weapon'
                                                ? require("../../../assets/icona_spada.png")
                                              : { uri: `data:image/png;base64,${item.image}` }
                        } 
                        style={[
                            styles.image,
                            styles.imageBorder,
                            item.type === 'monster' && styles.monsterBorder, 
                            item.type === 'amulet' && styles.amuletBorder, 
                            item.type === 'candy' && styles.candyBorder, 
                            item.type === 'weapon' && styles.weaponBorder, 

                        ]}
                        resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.cell, styles.name]}>{item.name}</Text>
                    <Text style={[styles.cell, styles.level]}>Lv. {item.level}</Text>
                    <Text style={[styles.cell, styles.vicinanza]}>
                      {item.vicino ? (
                        <Ionicons name="checkmark-circle-outline" size={20} color="green" />
                      ) : (
                        <Ionicons name="close-circle-outline" size={20} color="red" />
                      )}
                    </Text> 
                    </View>
                   </TouchableOpacity>

                )}
                />

            </View>
          );
        }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: StileGlobale.coloreScritte,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        flex:1,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cell: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    name: {
        width: '25%',
        textAlign: 'center',
      },
      level: {
        width: '25%', 
        textAlign: 'center',
      },
      imageContainer: {
        width: '25%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {
        width: '100%', // La larghezza dell'immagine occupa il 100% del contenitore
        height: 35, // Altezza desiderata
        aspectRatio: 1, // Imposta il rapporto di aspetto per mantenere le proporzioni originali
      },
      vicinanza: {
        width: '25%', 
        textAlign: 'center',
      },
      title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      imageBorder: {
        borderWidth: 2, // Spessore della cornice
        borderColor: 'black', // Colore della cornice
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

      
});

export default VicinanzaScreen;
