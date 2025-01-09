// AppViewModel.js
import LocationService from '../services/LocationService';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommunicationController from '../services/CommunicationController';
import * as SQLite from 'expo-sqlite';
import UserModel from '../model/UserModel';
import { Alert } from 'react-native';

class AppViewModel {
  constructor() {
    this.canUseLocation = false;
    this.locationWatchId = null;
    this.userModel = new UserModel();
  }

  async checkLocationPermission() {
    try {
      while (true) {
        const canUseLocation = await LocationService.locationPermissionAsync();
        this.canUseLocation = canUseLocation;

        if (!canUseLocation) {
          // L'utente non ha concesso i permessi di posizione
          const userResponse = await new Promise((resolve) => {
            Alert.alert(
              'Permesso di posizione',
              'Per utilizzare l\'app, devi concedere il permesso di posizione.',
              [
                {
                  text: 'Ok',
                  onPress: () => resolve(true), // Risolvi con true se l'utente preme 'Ok'
                },
              ],
              { cancelable: false }
            );
          });

          if (!userResponse) {
            // L'utente ha scelto di non concedere il permesso
            break; // Esci dal ciclo while
          }
        } else {
          // L'utente ha concesso il permesso
          break; // Esci dal ciclo while
        }
      }
    } catch (error) {
      console.error('Errore durante la richiesta del permesso di posizione:', error);
    }
  }


  //ottiene il SID e mi registra nel db se è la prima volta che entro 
  async registrazione() {
    const secondRun = await AsyncStorage.getItem("second-run");
  
    if (secondRun) {
      console.log("Second run, SID: " + await AsyncStorage.getItem("SID"));

    } else {
      console.log("First run");
      const endPoint = "users";
      const verb = 'POST';
      const queryParams = {};
      const bodyParams = {};
  
      try {
        const response = await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
        console.log("Registrazione effettuata:", response);
        await AsyncStorage.setItem("SID", response.sid);
        await AsyncStorage.setItem("positionShare","false");

        await AsyncStorage.setItem("uid", response.uid.toString());

        await AsyncStorage.setItem("died", "false");

        const SIDMemorizzato = await AsyncStorage.getItem("SID");

        console.log("SID memorizzato in modo persistente: ", SIDMemorizzato);
      } catch (error) {
        console.error("Errore durante la registrazione:", error);
      }
      
      const uid = await AsyncStorage.getItem("uid");
      const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
      this.userModel.insertMyUser("UtenteBase", uidAsInteger);
      
      await AsyncStorage.setItem("second-run", "true");
      return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }
  }
  
}

export default AppViewModel;
