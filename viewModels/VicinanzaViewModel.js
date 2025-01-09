import ObjectModel from '../model/ObjectModel';
import UserModel from '../model/UserModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommunicationController from '../services/CommunicationController';
import * as geolib from 'geolib';

class VicinanzaViewModel {
  constructor() {
    this.objectModel = new ObjectModel();
    this.userModel = new UserModel();
    this.died=false;
    this.xpDopoAttivazione=0;
  }

  //non penso venga usato
 async getObjects() {

  //prendo il mio uid
  const uid = await AsyncStorage.getItem("uid");
  const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
  //prendo le mie coordinate per vedere gli oggetti vicini
  const myUserCoordinates = await this.userModel.getCoordinates(uidAsInteger);

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

  async getObjectDetails(id,objLat,objLon) {
    try {
        const uid = await AsyncStorage.getItem("uid");
        const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
        //prendo le mie coordinate per vedere gli oggetti vicini
        const myUserCoordinates = await this.userModel.getCoordinates(uidAsInteger);
        const roundedPoint1 = { latitude: myUserCoordinates.lat.toFixed(5), longitude: myUserCoordinates.lon.toFixed(5) };
        let vicino = false;

        const localObjectDetails = await this.objectModel.getObjectDetailsFromDatabase(id);

        const idAmulet=await this.userModel.getUserAmuletDetails(uidAsInteger);
        let distanzaMax=100;
        if(idAmulet.amulet != null){
          const amuletLevel=await this.objectModel.getObjectDetailsFromDatabase(idAmulet.amulet);
          distanzaMax=100+amuletLevel.level;
        }

        if (localObjectDetails) {
          // Coordinate dell'oggetto
          const roundedPoint2 = { latitude: objLat.toFixed(5), longitude: objLon.toFixed(5) };

          const distance = geolib.getDistance(roundedPoint1, roundedPoint2);
          // Verifica se la distanza è inferiore a 100 metri
          if(distance<distanzaMax){
            vicino = true;
          }
          const modifiedLocalObjectDetails = {
            ...localObjectDetails,
            vicino: vicino,
          };
            // I dettagli dell'utente sono presenti e la versione del profilo è aggiornata
            return modifiedLocalObjectDetails;
        }else{
        const SIDMemorizzato = await AsyncStorage.getItem("SID");
        const endPoint = `objects/${id}`;
        const verb = 'GET';
        const queryParams = { sid: SIDMemorizzato };
        const bodyParams = {};
        const objectDetails = await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
        await this.objectModel.insertObject(objectDetails);

        const roundedPoint2 = { latitude: objLat.toFixed(5), longitude: objLon.toFixed(5) };

        const distance = geolib.getDistance(roundedPoint1, roundedPoint2);
        
        // Verifica se la distanza è inferiore a 100 metri
        if(distance<100){
          vicino = true;
        }
        const modifiedObjectDetails = {
          ...objectDetails,
          vicino: vicino,
        };
        return modifiedObjectDetails;
      }
      }catch (error) {
      throw error;
    }
  }
  
  async attivaOggetto(id) {
    const SIDMemorizzato = await AsyncStorage.getItem("SID");
    console.log(SIDMemorizzato);
    const endPoint = `objects/${id}/activate`;
    const verb = 'POST';
    const queryParams = { };
    const bodyParams = { sid : SIDMemorizzato }; 
    try {
      const response = await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
      const uid = await AsyncStorage.getItem("uid");
      const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
      const userData = {
        uid: uidAsInteger,
        response: response,
      };
      this.died=response.died;
      this.xpDopoAttivazione=response.experience;
      //aggiornamento non funziona
      await this.userModel.updateUserAfterObject(userData);

    } catch (error) {
      console.error("Errore durante la ricezione dell'oggetto:", error);
      throw error; // Rilancia l'errore per gestirlo nell'interfaccia utente o in altri luoghi
    }
  } 
  
  async combattimentoConArmatura(minLifeLoss,maxLifeLoss){
    const uid = await AsyncStorage.getItem("uid");
    const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
    const datiUtente= await this.userModel.getUserDetailsFromDatabase(uidAsInteger);
    let minVitaDaSottrarre,maxVitaDaSottrarre;
    if(datiUtente.weapon){
      const livelloArmatura = await this.objectModel.getArmorLevel(datiUtente.weapon);
       minVitaDaSottrarre = minLifeLoss - (minLifeLoss * livelloArmatura.level / 100);
       maxVitaDaSottrarre = maxLifeLoss - (maxLifeLoss * livelloArmatura.level / 100);
    }else{
      minVitaDaSottrarre = minLifeLoss;
      maxVitaDaSottrarre = maxLifeLoss;
    }
  
  
    return {
      minVita: Math.round(minVitaDaSottrarre),
      maxVita: Math.round(maxVitaDaSottrarre)
    };
  }
  async ritornaVitaUtente() {
    const uid = await AsyncStorage.getItem("uid");
    const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
    const datiUtente= await this.userModel.getUserDetailsFromDatabase(uidAsInteger);
    
    return datiUtente.life;
  }

  getDied(){
    return this.died;
  }
  getXpDopoAttivazione(){
    return this.xpDopoAttivazione;
  }
}



export default VicinanzaViewModel;