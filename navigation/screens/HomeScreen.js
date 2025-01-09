import React from 'react';
import { View, StyleSheet, Image,Text,ActivityIndicator} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import HomeViewModel from '../../viewModels/HomeViewModel';
import ClassificaViewModel from '../../viewModels/ClassificaViewModel';

import OggettoVicinanza from './Vicinanza/OggettoVicinanza';
import UtenteClassifica from './Classifica/UtenteClassifica';
import customMapStyle from '../../styles/CustomMapStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import VicinanzaViewModel from '../../viewModels/VicinanzaViewModel';
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: {
        latitude: 45.4566899,
        longitude: 9.2445289,
      },
      selectedObject: false,
      selectedUser : false,
      utenteSelezionato:false,
      utentiVicini:[],
      utenteData: [],
      loading: true,
      mapCentered: false,
      oggettiVicini: [],
      oggettoData: [],
      oggetto: null,
      isConnected: false, // Nuovo stato per la connessione Internet
    };
    this.viewModel = new HomeViewModel();
    this.vicinanzaViewModel=new VicinanzaViewModel();
    this.classificaViewModel=new ClassificaViewModel();

    this.mapRef = null; // Riferimento alla mappa

    this.setupBeforeMount();
  }

  //parte il controllo della posizione
  async setupBeforeMount(){
    await this.viewModel.startLocationWatch(this.updateLocation);
  }

  async componentDidMount() {
    await this.checkInternetConnection();

    if (this.state.isConnected) {
      this.setState({loading:true});
      // Configura l'intervallo per chiamare la funzione ogni 3 secondi solo se la connessione è disponibile
      this.checkInternetConnectionInterval = setInterval(async () => {
        await this.checkInternetConnection();
      }, 3000);
  
      // Altre operazioni da eseguire solo se la connessione è disponibile
      this.state.currentLocation;
      //fetchdata è l'aggiornamento dei markers
      await this.fetchData();
      this.updateInterval = setInterval(() => {
        this.fetchData();
      }, 5000);
    }
    }

  async componentWillUnmount() {
      // Pulisci l'intervallo quando il componente viene smontato
    clearInterval(this.updateInterval);
  }

  async componentDidUpdate(prevProps, prevState) {
    // Controlla se ci sono stati cambiamenti rilevanti nello stato che richiedono un refresh dei dati
    if (
      this.state.selectedUser !== prevState.selectedUser ||
      this.state.selectedObject !== prevState.selectedObject
    ) {
      // Esegui il refresh dei dati
      await this.fetchData();
    }
  }

  async fetchData() {
    await this.viewModel.startLocationWatch(this.updateLocation);

    //prende gli oggettie gli utenti vicini in base alla mia posizione
    const oggettiVicini = await this.viewModel.getObjects();
    const utentiVicini = await this.viewModel.getUsersWithPosition();
    this.setState({ oggettiVicini , utentiVicini});
    // Per ogni oggetto nei dintorni, ottieni i dettagli promise.all attende la risposta di tutte le promise
    //oggettoData è l'array che ne esce
    const oggettoData = await Promise.all(
      oggettiVicini.map(async (item) => {
        try {
          // Usa una funzione freccia per mantenere il contesto
          const details = await this.vicinanzaViewModel.getObjectDetails(item.id,item.lat,item.lon);

          // Aggiungi l'immagine al dettaglio dell'oggetto in oggettiVicini così da poterlo usare per i marker
          item.image = details.image;
          item.vicino= details.vicino;
          item.level= details.level;
          item.type = details.type;
          item.name = details.name;
          return details;
        } catch (error) {
          console.error('Error fetching object details:', error);
          // Tratta l'errore come preferisci, ad esempio restituendo un oggetto di dettagli vuoto
          return {};
        }
      })
    );

    //utenteData è l'array che ne esce
    const utenteData = await Promise.all(
      utentiVicini.map(async (item) => {
        try {
          const response = await this.classificaViewModel.getUserDetails(item);
          item.picture=response.picture;   
          item.name=response.name;   

          return item;
        } catch (error) {
          console.error(':', error);
          // Tratta l'errore come preferisci, ad esempio restituendo un oggetto di dettagli vuoto
          return {};
        }
      })
    );

    this.setState({ oggettoData , utenteData});
  }
    
  // Funzione di callback per aggiornare lo stato con le nuove coordinate, prende come parametri latitude e longitude presi dallo stato
  updateLocation = (latitude, longitude) => {
    this.setState(
      {
        currentLocation: {
          latitude,
          longitude,
        },
        loading: false, // Imposta loading su false quando la posizione è stata caricata

      },
      () => {
        // Centra la mappa sulla posizione del marker solo la prima volta
        //uso la funzione di callback per aspettare che lo stato venga aggiornato
        if (!this.state.mapCentered) {
          this.mapRef.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
          this.setState({
            mapCentered: true,
          });
        }
      }
    );
  };

  //sono le funzioni che passo al prossimo fragment per permettergli di tornare indietro
  selectedObj (oggetto) {
    //prendo prevstate e lo inverto
    this.setState((prevState) => ({
      selectedObject: !prevState.selectedObject,oggetto: oggetto
    }));
    };

  selectedUs (oggetto) {
    //ho tutte le proprietà dell'oggetto oggetto tranne positionshare che cambia
    const updatedOggetto = { ...oggetto, positionshare: true };

    //prendo prevstate e lo inverto
    this.setState((prevState) => ({ selectedUser: !prevState.selectedUser ,oggetto: updatedOggetto,
      }));
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
      if (!this.state.isConnected) {
        return (
          <View style={styles.connectionErrorContainer}>
            <Text style={styles.connectionErrorText}>
              Connessione Internet non disponibile. Verifica la tua connessione e riprova.
            </Text>
          </View>
        );
      }
      if(this.state.selectedObject){
        return (
        <OggettoVicinanza selectedObject={this.state.oggetto} handlePaginaOggetto={() => this.selectedObj()} vicinanzaViewModel={this.vicinanzaViewModel} />
        )
      }
      if(this.state.selectedUser){
        //passo la funzione come prop al figlio per eseguirla e tornare indietro
        return (
        <UtenteClassifica userDetails={this.state.oggetto} handlePaginaUtente={() => this.selectedUs()}/>
        )
      }
 
    return (
      <View style={styles.container}>
        <MapView
          ref={(ref) => (this.mapRef = ref)} // Salva il riferimento alla mappa
          style={styles.map}
          initialRegion={{
            latitude: this.state.currentLocation.latitude,
            longitude: this.state.currentLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true} // Mostra la posizione dell'utente sulla mappa
          followUserLocation={true} // Fai seguire la posizione dell'utente dalla mappa
          customMapStyle={customMapStyle} 
        >
        {this.state.utentiVicini && this.state.utentiVicini.map((oggetto) => (
        
            <Marker
              key={oggetto.uid}
              coordinate={{
                latitude: oggetto.lat,
                longitude: oggetto.lon,
              }}
              onPress={() => this.selectedUs(oggetto)}
            >
              <View style={styles.customMarker}>
              <Image
                source={require("../../assets/profile_menu.png")}
                style={{
                width: 35,
                height: 35,
              }}
            />
              </View>             
            </Marker>
          ))}
          {/* Itera attraverso gli oggetti e aggiungi un Marker per ciascun oggetto */}
          {this.state.oggettiVicini && this.state.oggettiVicini.map((oggetto) => (
            <Marker
              key={oggetto.id}
              coordinate={{
                latitude: oggetto.lat,
                longitude: oggetto.lon,
              }}
              onPress={() => this.selectedObj(oggetto)}
            >
              <View style={{
                ...styles.customMarker,
                ...((oggetto.type === 'monster' && styles.monsterBorder) ||
                  (oggetto.type === 'amulet' && styles.amuletBorder) ||
                  (oggetto.type === 'candy' && styles.candyBorder)),
              }}>
                <Image
                    source={
   
                            oggetto.type === 'monster'
                              ? require("../../assets/icona_mostro.png")
                              : oggetto.type === 'amulet'
                                  ? require("../../assets/icona_amuleto.png")
                                  : oggetto.type === 'candy'
                                      ? require("../../assets/icona_caramella.png")
                                      : oggetto.type === 'armor'
                                          ? require("../../assets/icona_armatura.png")
                                          : oggetto.type === 'weapon'
                                            ? require("../../assets/icona_spada.png")
                                          : { uri: `data:image/png;base64,${oggetto.picture}` }
                    }
                
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 0,
                    resizeMode: 'contain',
                    ...((oggetto.type === 'monster' && styles.monsterBorder) ||
                      (oggetto.type === 'amulet' && styles.amuletBorder) ||
                      (oggetto.type === 'candy' && styles.candyBorder)),
                  }}
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    );
  }

  checkInternetConnection = async () => {
    const netInfoState = await NetInfo.fetch();
  
    // Aggiorna lo stato con lo stato della connessione
    this.setState({
      isConnected: netInfoState.isConnected,
    });
  
    if (netInfoState.isConnected) {
      // Puoi inserire qui la logica da eseguire quando la connessione è disponibile
    } else {
      console.log('Connessione Internet non disponibile');
    }
  };

  componentWillUnmount() {
    // Pulisci l'intervallo quando il componente viene smontato
    clearInterval(this.checkInternetConnectionInterval);
    clearInterval(this.updateInterval);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },  
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white', // Sfondo bianco
    borderWidth: 2, // Larghezza del bordo
    borderColor: '#000', // Colore del bordo (puoi cambiare questo valore)
    overflow: 'hidden',
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monsterBorder: {
    borderColor: 'red', 
  },
  candyBorder: {
    borderColor: 'orange', 
  },
  amuletBorder: {
    borderColor: 'purple', 
  },
  container: {
    flex: 1,
  },
  connectionErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionErrorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold', // Aggiunto stile per rendere il testo in grassetto
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
  
});

export default HomeScreen;
