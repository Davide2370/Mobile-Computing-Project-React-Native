import CommunicationController from '../services/CommunicationController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserModel from '../model/UserModel';

class ClassificaViewModel {
  constructor() {
    this.userModel = new UserModel();
  }

  async getRanking() {
    const SIDMemorizzato = await AsyncStorage.getItem("SID");
    const endPoint = "ranking/";
    const verb = 'GET';
    const queryParams = { sid: SIDMemorizzato };
    const bodyParams = {};

    try {
      const response = await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
      return response;
    } catch (error) {
      console.error("Errore durante la ricezione dell'oggetto:", error);
      throw error; // Rilancia l'errore per gestirlo nell'interfaccia utente o in altri luoghi
    }
  }

  async getUserDetails(item) {
    try {
      const localUserDetails = await this.userModel.getUserDetailsFromDatabase(item.uid);
      const mioUid = await AsyncStorage.getItem("uid");
      const uidAsInteger = parseInt(mioUid, 10); 

      if (localUserDetails) {

        if(localUserDetails.profile_version >= item.profileversion || item.uid == uidAsInteger){
          
          localUserDetails.life = item.life;
          localUserDetails.experience =item.experience;
          localUserDetails.positionshare =item.positionshare;
          localUserDetails.lat=item.lat;
          localUserDetails.lon=item.lon;

          // I dettagli dell'utente sono presenti e la versione del profilo è aggiornata
          return localUserDetails;
        }
       
      }

      // Effettua la chiamata API per ottenere i dettagli più recenti
      const SIDMemorizzato = await AsyncStorage.getItem("SID");
      const endPoint = `users/${item.uid}`;
      const verb = 'GET';
      const queryParams = { sid: SIDMemorizzato };
      const bodyParams = {};

      const response = await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
      if (localUserDetails) {
        // Aggiorna i dettagli dell'utente nel database locale
        await this.userModel.updateUserDetailsInDatabase(response);

      } else {
        // Inserisci i dettagli dell'utente nel database locale
        await this.userModel.insertUser(response);
      }
  
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  
}

export default ClassificaViewModel;
