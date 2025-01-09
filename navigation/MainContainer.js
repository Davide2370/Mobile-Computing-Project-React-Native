import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Image,Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Screens
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/Profilo/ProfileScreen';
import VicinanzaScreen from './screens/Vicinanza/VicinanzaScreen';
import ClassificaScreen from './screens/Classifica/ClassificaScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { StileGlobale } from '../styles/StileGlobale';
//Screen names
const homeName = "Mappa";
const profileName = "Profilo";
const classificaName = "Classifica";
const vicinanzaName = "Vicinanza";

const Tab = createBottomTabNavigator();

class MainContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
   
      isConnected: false, // Nuovo stato per la connessione Internet
    };
 
  }

  async componentDidMount() {
    await this.checkInternetConnection();

    if (this.state.isConnected) {
      // Configura l'intervallo per chiamare la funzione ogni 3 secondi solo se la connessione è disponibile
      this.checkInternetConnectionInterval = setInterval(async () => {
        await this.checkInternetConnection();
      }, 3000);
    }
    }

    render(){

      if (!this.state.isConnected) {
        return (
          <View style={styles.connectionErrorContainer}>
            <Text style={styles.connectionErrorText}>
              Connessione Internet non disponibile. Verifica la tua connessione e riprova.
            </Text>
          </View>
        );
      }
      return (
        <NavigationContainer>
          <Tab.Navigator 
            initialRouteName={homeName}
            screenOptions={({ route }) => ({
              headerStyle: {
                backgroundColor:StileGlobale.coloreVerdeScuro,
              },
              headerTintColor: StileGlobale.coloreScritte,
              tabBarActiveTintColor: StileGlobale.coloreScritte,
              tabBarInactiveTintColor: StileGlobale.coloreScritte,
              tabBarLabelStyle:{ paddingBottom: 10, fontSize: 10 },
              tabBarStyle: { padding: 10, height: 60, backgroundColor:StileGlobale.coloreVerdeScuro },
              unmountOnBlur: true, // Questa opzione farà sì che lo schermo venga smontato quando perde il focus
              tabBarIcon: ({ focused, color, size }) => {
                // Inizializzazione delle variabili per il nome dell'icona
                let iconName;
                let rn = route.name;
            
                // Controllo della schermata corrente e assegnazione dell'icona appropriata
                if (rn === homeName) {
                  // Se la schermata è la home, l'icona sarà 'map' se la schermata è focalizzata, altrimenti 'map-outline'
                  iconName = focused ? 'map' : 'map-outline';
                } else if (rn === profileName) {
                  // Se la schermata è il profilo, l'icona sarà 'person' se la schermata è focalizzata, altrimenti 'person-outline'
                  iconName = focused ? 'person' : 'person-outline';
                } else if (rn === classificaName) {
                  iconName = focused ? 'star' : 'star-outline';
                }else if (rn === vicinanzaName) {
                  iconName = focused ? 'search-circle' : 'search-circle-outline';
                }
            
                // Restituzione di un componente Ionicons con l'icona specificata, dimensioni e colore
                // Questo componente sarà utilizzato come icona nella barra di navigazione.
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            >
            <Tab.Screen name={homeName} component={HomeScreen}   initialParams={{ canUseLocation: this.props.canUseLocation }}/>
            <Tab.Screen name={vicinanzaName} component={VicinanzaScreen} />
            <Tab.Screen name={classificaName} component={ClassificaScreen} />
            <Tab.Screen name={profileName} component={ProfileScreen}     key="ProfileScreen" // Aggiungi questa linea con una chiave unica per la schermata
 />
          </Tab.Navigator>
        </NavigationContainer>
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
}

const styles = StyleSheet.create({
  connectionErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionErrorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  // Altri stili che potresti già avere
});

export default MainContainer;