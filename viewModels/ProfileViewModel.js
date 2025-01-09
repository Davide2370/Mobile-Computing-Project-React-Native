import LocationService from '../services/LocationService';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommunicationController from '../services/CommunicationController';
import UserModel from '../model/UserModel';
import ObjectModel from '../model/ObjectModel';

class ProfileViewModel {
    constructor() {
      this.UserModel=new UserModel();
      this.ObjectModel=new ObjectModel()
    }
  
    async getUserDataFromDatabase(){
        const uid = await AsyncStorage.getItem("uid");
        const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
        console.log(uid);
        const localUserDetails = await this.UserModel.getUserDetailsFromDatabase(uidAsInteger);
        return localUserDetails;
    }

    async getUserArtifacts(idWeapon, idArmor, idAmulet) {
      let artifactsDetails = {};

      //se trovo un armatura metto armorId e armorImage
      if (idArmor != null) {
        const armor = await this.ObjectModel.getObjectDetailsFromDatabase(idArmor);
        armor && (artifactsDetails = { ...artifactsDetails,armorId:armor.id, armorImage: armor.image });
      }

      if (idWeapon != null) {
        const weapon = await this.ObjectModel.getObjectDetailsFromDatabase(idWeapon);
        weapon && (artifactsDetails = { ...artifactsDetails, weaponId: weapon.id,weaponImage: weapon.image});
      }

      if (idAmulet != null) {
        const amulet = await this.ObjectModel.getObjectDetailsFromDatabase(idAmulet);
        amulet && (artifactsDetails = { ...artifactsDetails,amuletId:amulet.id, amuletImage: amulet.image });
      }

      return artifactsDetails;
    }
    
    async getArtifactDetails(id){
        try {
        
            const localObjectDetails = await this.ObjectModel.getObjectDetailsFromDatabase(id);
    
            return localObjectDetails;
            
          }catch (error) {
          throw error;
        }
      }

    async modifyUser(name,image,sharePosition){
      if(!image){
        image=null;
      }
      const uid = await AsyncStorage.getItem("uid");
      const uidAsInteger = parseInt(uid, 10); // Converti l'UID a numero
      await this.UserModel.updateUserProfile(image,name,sharePosition,uidAsInteger);  

        const SIDMemorizzato = await AsyncStorage.getItem("SID");
        const endPoint = "users/"+uid;
        const verb = 'PATCH';
        const queryParams = { };
        const bodyParams = {sid: SIDMemorizzato, name: name, picture: image, positionshare: sharePosition};
        try {
          const response = await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
          return response;
        } catch (error) {
          console.error("Errore durante la ricezione dell'oggetto:", error);
          throw error; // Rilancia l'errore per gestirlo nell'interfaccia utente o in altri luoghi
        }
    }
}

export default ProfileViewModel;
  
  