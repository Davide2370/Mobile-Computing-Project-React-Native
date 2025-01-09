import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { StileGlobale } from '../../../styles/StileGlobale';

class UtenteClassifica extends React.Component {
  render() {
    const { userDetails, handlePaginaUtente } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Dettagli Utente</Text>
        <Image
          source={
            userDetails.picture
              ? { uri: `data:image/png;base64,${userDetails.picture}` }
              : require("../../../assets/profile_menu.png")
          }
          style={[styles.image, styles.imageBorder]}
        />
        <Text style={[styles.detailText]}><Text style={styles.boldText}>Nome:</Text> {userDetails.name}</Text>
        <Text style={[styles.detailText]}><Text style={styles.boldText}>Esperienza:</Text>  {userDetails.experience}</Text>
        <Text style={[styles.detailText]}><Text style={styles.boldText}>Vita: </Text> {userDetails.life}</Text>
        <Text style={[styles.detailText]}>
        <Text style={styles.boldText}> Condivisione posizione : </Text> {userDetails.positionshare ? 'Attiva' : 'Disattiva'}
        </Text>
        {userDetails.positionshare && (
          <View style={styles.mapContainer}>
            {/* Minimappa */}
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: userDetails.lat,
                longitude: userDetails.lon,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: userDetails.lat,
                  longitude: userDetails.lon,
                }}
                title={userDetails.name}
              />
            </MapView>
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={handlePaginaUtente}>
          <Text style={styles.backButtonText}>Indietro</Text>
        </TouchableOpacity>
      </View>
    );
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
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageBorder: {
    borderWidth: 2,
    borderColor: 'black',
  },
  image: {
    width: 100,
    height: 100,
    aspectRatio: 1,
  },
  mapContainer: {
    width: '80%',
    height: 150,
    marginTop: 10,
    overflow: 'hidden',
    borderWidth: 1, // Aggiungi un bordo alla mappa
    borderColor: 'black', // Colore del bordo
    borderRadius: 5
  },
  map: {
    width: '100%', // Modifica la larghezza della mappa
    height: '100%', // Modifica l'altezza della mappa
    borderWidth: 1, // Aggiungi un bordo alla mappa
    borderColor: 'black', // Colore del bordo
    borderRadius: 5, // Arrotonda gli angoli del bordo
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default UtenteClassifica;
