import * as Location from 'expo-location';

//export è per rendere disponibile questa funzione altrove
export default class CommunicationController{
    
static async locationPermissionAsync() {
    let canUseLocation = false;
    const grantedPermission = await Location.getForegroundPermissionsAsync()
    if (grantedPermission.status === "granted") {
    canUseLocation = true;
    } else {
    const permissionResponse = await Location.requestForegroundPermissionsAsync()
    if (permissionResponse.status === "granted") {
    canUseLocation = true;
    }
    }
    return canUseLocation;
}
}
