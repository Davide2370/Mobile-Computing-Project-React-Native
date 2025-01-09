// AppViewModel.js
import LocationService from '../services/LocationService';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommunicationController from '../services/CommunicationController';
import * as SQLite from 'expo-sqlite';
import UserModel from '../model/UserModel';
import ObjectModel from '../model/ObjectModel';

// HomeViewModel.js
class HomeViewModel {
    constructor() {
      this.locationWatchId = null;
      this.locationUpdateCallback = null;
      this.UserModel=new UserModel();
      this.objectModel=new ObjectModel();
    }
  
    async startLocationWatch(locationUpdateCallback) {
      this.locationUpdateCallback = locationUpdateCallback;
      const options = {
        timeInterval: 1500,
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 15,
      };
  
      this.locationWatchId =await Location.watchPositionAsync(options, (location) => {
        this.handleLocationUpdate(location);      
      });
    }
    
    //uguale alla funzione che c'è in vicinanzaViewModel per ritornare gli oggetti vicini
    async getObjects() {
      //prendo il mio uid
      const uid = await AsyncStorage.getItem("uid");
      const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
      //prendo le mie coordinate per vedere gli oggetti vicini
      const myUserCoordinates = await this.UserModel.getCoordinates(uidAsInteger);
    
      if (myUserCoordinates && myUserCoordinates.lat !== null && myUserCoordinates.lon !== null) {
        const SIDMemorizzato = await AsyncStorage.getItem("SID");
        const endPoint = "objects/";
        const verb = 'GET';
        const queryParams = { sid: SIDMemorizzato, lat: myUserCoordinates.lat, lon: myUserCoordinates.lon };
        const bodyParams = {};
        try {
          const response = await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
          return response;
        } catch (error) {
          console.error("Errore durante la ricezione dell'oggetto:", error);
          throw error; // Rilancia l'errore per gestirlo nell'interfaccia utente o in altri luoghi
        }
      } else {
        // Gestisci il caso in cui le coordinate sono nulle
        console.error("Coordinate utente mancanti o nulle.");
        return null;
      }
    }

    async handleLocationUpdate(location) {
      console.log(
        'Posizione aggiornata: ' +
          location.coords.latitude +
          ' - ' +
          location.coords.longitude
      );
      const uid = await AsyncStorage.getItem("uid");
      const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero

      this.UserModel.insertCoordinates(uidAsInteger, location.coords.latitude, location.coords.longitude);
      // Chiamare la callback con le nuove coordinate
      if (this.locationUpdateCallback) {
        this.locationUpdateCallback(location.coords.latitude, location.coords.longitude);
      }
    }

    async getUserDet(uid){
      const response = await this.UserModel.getUserDetailsFromDatabase(uid);
      if(response&& response!=null){
        return response;
      } else {
        return null;
      }
    }

    async getUsersWithPosition()
    {
      const uid = await AsyncStorage.getItem("uid");
      const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
      //prendo le mie coordinate per vedere gli oggetti vicini
      const myUserCoordinates = await this.UserModel.getCoordinates(uidAsInteger);
    
      if (myUserCoordinates && myUserCoordinates.lat !== null && myUserCoordinates.lon !== null) {
        const SIDMemorizzato = await AsyncStorage.getItem("SID");
        const endPoint = "users/";
        const verb = 'GET';
        const queryParams = { sid: SIDMemorizzato, lat: myUserCoordinates.lat, lon: myUserCoordinates.lon };
        const bodyParams = {};
        try {
          const response = await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
          //tolgo me stesso
          const filteredResponse = response.filter(utente => utente.uid !== uidAsInteger);

          return filteredResponse;
        } catch (error) {
          console.error("Errore durante la ricezione dell'oggetto:", error);
          throw error; // Rilancia l'errore per gestirlo nell'interfaccia utente o in altri luoghi
        }
      } else {
        // Gestisci il caso in cui le coordinate sono nulle
        console.error("Coordinate utente mancanti o nulle.");
        return null;
      }
    }

    /*async getObjectDetails(id) {
      try {
        
          const localObjectDetails = await this.objectModel.getObjectDetailsFromDatabase(id);
  
          if (localObjectDetails) {
              // I dettagli dell'utente sono presenti e la versione del profilo è aggiornata
              return localObjectDetails;
          }else{
          const SIDMemorizzato = await AsyncStorage.getItem("SID");

          const endPoint = `objects/${id}`;
          const verb = 'GET';
          const queryParams = { sid: SIDMemorizzato };
          const bodyParams = {};
          const objectDetails = await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
          await this.objectModel.insertObject(objectDetails);
  
          return objectDetails;
        }
        }catch (error) {
        throw error;
      }
   }*/
}
  
  export default HomeViewModel;
  
  