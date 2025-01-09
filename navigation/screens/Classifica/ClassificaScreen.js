import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image,ActivityIndicator} from 'react-native';
import ClassificaViewModel from '../../../viewModels/ClassificaViewModel';
import { useNavigation } from '@react-navigation/native';
import UtenteClassifica from './UtenteClassifica';
import { StileGlobale } from '../../../styles/StileGlobale';

class ClassificaScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rankingData: [],
      detailedData: [],
      selectedUser: null, 
      loading:true,
    };
    this.viewModel = new ClassificaViewModel();
  }
  
    async componentDidMount() {
      try {
        // Ottieni la classifica dalla funzione del view model
        const rankingData = await this.viewModel.getRanking();
        this.setState({ rankingData });
        // Per ogni uid nella classifica, ottieni i dettagli promise.all attende la risposta di tute le promise
        const detailedData = await Promise.all(
          rankingData.map(async (item) => {
            //questo item è il ritorno della chiamata quindi il parametro è profileversion
            const details = await this.viewModel.getUserDetails(item);
            this.setState({ loading:false });

            return details;
          })
        );
        this.setState({ detailedData });

      } catch (error) {
        console.error('Errore durante il recupero della classifica:', error);
      }
    }

    handlePaginaUtente = () => {
      this.setState({ selectedUser:null });
    }

    render() {
      const { rankingData, detailedData, selectedUser } = this.state;

      if (this.state.loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
      if (selectedUser) {
        // Se un utente è stato selezionato, mostra i dettagli dell'utente
        return (
          <UtenteClassifica userDetails={selectedUser} handlePaginaUtente={this.handlePaginaUtente}  />
          );
      }

      // Altrimenti, mostra la lista di classifica
      return (
        
        <View style={styles.container}>
  
          {/*<View style={styles.headerRow}>
            <Text style={[styles.headerText]}>Immagine profilo</Text>
            <Text style={[styles.headerText]}>Nome</Text>
            <Text style={[styles.headerText]}>Esperienza</Text>
      </View>*/}
  
          <FlatList
            data={detailedData}
            keyExtractor={(item) => item.uid.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.setState({ selectedUser: item })}
              >
                <View style={styles.row}>
                <View style={styles.imageContainer}>
                  <Image
                    source={item.picture ? { uri: `data:image/png;base64,${item.picture}` } : require("../../../assets/profile_menu.png")}
                    style={[styles.image, styles.imageBorder]}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.cell, styles.name]}>{item.name}</Text>
                  <Text style={[styles.cell, styles.experience]}>XP: {item.experience}</Text>
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
        width: '33%',
        textAlign: 'center',
      },
      experience: {
        width: '33%', 
        textAlign: 'center',
      },
      imageContainer: {
        width: '33%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {
        width: '100%', // La larghezza dell'immagine occupa il 100% del contenitore
        height: 35, // Altezza desiderata
        aspectRatio: 1, // Imposta il rapporto di aspetto per mantenere le proporzioni originali
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
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }
});

export default ClassificaScreen;
