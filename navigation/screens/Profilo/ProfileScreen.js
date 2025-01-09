import * as React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Switch, TextInput,ActivityIndicator } from 'react-native';
import ProfileViewModel from '../../../viewModels/ProfileViewModel';
import DettagliOggettoProfilo from './DettagliOggettoProfilo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { StileGlobale } from '../../../styles/StileGlobale';
import { PermissionsAndroid } from 'react-native';
import Dialog from "react-native-dialog";
import * as FileSystem from 'expo-file-system';




class ProfileScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        datiUtente: {
          name: '',
          picture: null,
        },
        isEditingName: false, // Nuovo stato per la modalità di modifica
        isDialogVisible: false,
        originalName: '',
        artifactsDetails: {},
        loading:false,
        isEditingNameCount:0,
        PaginaOggetto: false,
        idSelezionato: null,
        positionShare:false,
      };
      this.profileViewModel = new ProfileViewModel();
    }

    //Avvio telecamera
    async launchCamera() {
      try {
        if (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA) === "granted") {
          const result = await ImagePicker.launchCameraAsync({
            mediaType: 'photo',
            quality: 0.8,
          });
    
          if (!result.canceled) {
            const selectedAsset = result.assets[0]; // Modifica qui
            const uri = selectedAsset.uri;
    
            // Carica l'immagine in modo asincrono per ottenere il base64
            const base64Image = await this.loadImageAsync(uri);
    
            const imageSizeInKB = base64Image.length / 4 * 3 / 1024;
    
            if (imageSizeInKB < 100) {
              // L'immagine è inferiore a 100 KB, puoi gestire la base64Image qui
              this.setState({
                datiUtente: {
                  ...this.state.datiUtente,
                  picture: base64Image,
                },
              });
            } else {
              alert('Errore: L\'immagine deve essere inferiore a 100 KB.');
            }
          }
        } else {
          console.log('Permission denied for camera');
          alert('Errore: Permesso negato per la fotocamera.');
        }
      } catch (err) {
        console.error('Error checking camera permission:', err);
      }
    };
    
  
    launchGallery = async () => {
   
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          aspect: [4, 3],
          quality: 1,
        });    
        if (!result.canceled) {
          const selectedAsset = result.assets[0]; // Modifica qui
          const uri = selectedAsset.uri;
    
          try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            const fileUri = fileInfo.uri;
    
            // Carica l'immagine in modo asincrono per ottenere il base64
            const base64Image = await this.loadImageAsync(fileUri);
    
            const imageSizeInKB = base64Image.length / 4 * 3 / 1024;
    
            if (imageSizeInKB < 100) {
              this.setState({
                datiUtente: {
                  ...this.state.datiUtente,
                  picture: base64Image,
                },
              });
            } else {
              alert('Errore: L\'immagine deve essere inferiore a 100 KB.');
            }
          } catch (error) {
            console.error('Errore durante il recupero del percorso del file:', error);
          }
        }
      
    };
    
    // Function to convert 'content' URI to 'file' URI
    convertContentUriToFileUri = async (contentUri) => {
      try {
        const fileInfo = await FileSystem.getInfoAsync(contentUri);
        return fileInfo.uri;
      } catch (error) {
        console.error('Error converting content URI to file URI:', error);
        throw error;
      }
    };
    //caricamento immagini
    loadImageAsync = async (uri) => {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const base64Image = await this.convertBlobToBase64(blob);
        this.setState({ loading:false });

        return base64Image;
      } catch (error) {
        console.error('Error loading image:', error);
        throw error;
      }
    };
    
    convertBlobToBase64 = (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result.split(',')[1]);
        };
        reader.readAsDataURL(blob);
      });
    };

    async componentDidMount() {
      this.setState({ loading: true });

      //prende il mio utente, i dettagli degli artefatti
      const datiUtente= await this.profileViewModel.getUserDataFromDatabase();
      const artifactsDetails= await this.profileViewModel.getUserArtifacts(datiUtente.weapon,datiUtente.armor,datiUtente.amulet);
      const daConvertire=await AsyncStorage.getItem("positionShare");
      let positionShare;
      if(daConvertire == "false"){
        positionShare = false; 
      }else{
        positionShare = true;
      }
      console.log("datiutente:"+datiUtente.picture);
      this.setState({ datiUtente, artifactsDetails, positionShare, originalName: datiUtente.name ,loading:false});
    }

    async componentDidUpdate(prevProps, prevState) {
      // Verifica se l'oggetto è stato modificato rispetto allo stato precedente così vedo se aggiornare l'utente
      if (!this.state.isEditingName && (this.state.datiUtente.name != prevState.datiUtente.name || this.state.positionShare!= prevState.positionShare || this.state.datiUtente.picture != prevState.datiUtente.picture)) {
        this.handleNameChange(this.state.datiUtente.name);
        this.setState({ loading: true });
        
        await this.profileViewModel.modifyUser(
          this.state.datiUtente.name,
          this.state.datiUtente.picture,
          this.state.positionShare
        );
        
        this.setState({ loading: false });
      }
      
      // Altre azioni o logiche necessarie qui
    }
    handleNameChange = (newName) => {
      // Esegui le azioni desiderate qui
      console.log('Il nome utente è stato modificato:', newName);
      // Aggiungi altre azioni che desideri eseguire dopo la modifica del nome utente
      // Puoi chiamare una funzione, inviare una richiesta API, ecc.
      
    };
  
    async componentWillUnmount() {
      // Questo metodo viene chiamato prima che il componente venga smontato

      // Aggiungi altre azioni che desideri eseguire prima di smontare la schermata
    }
    showImagePickerDialog = async () => {
     
      this.setState({ isDialogVisible: true });
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    };
  
    handleDialogOptionPress = async (option) => {


      this.setState({ isDialogVisible: false });
      if (option === 'camera') {
        this.launchCamera();
      } else if (option === 'gallery') {
        this.launchGallery();
      }
    };
  
    
    handlePaginaOggetto(idOggetto){
      //prendo prevstate e lo inverto
      this.setState((prevState) => ({ PaginaOggetto: !prevState.PaginaOggetto , idSelezionato: idOggetto}));
    };

    handlePositionShareChange = () => {
      this.cambiapositionAsync();
      this.setState(
        (prevState) => ({ positionShare: !prevState.positionShare }),
        
      );
    };

    async cambiapositionAsync(){
      await AsyncStorage.setItem("positionShare", (!this.state.positionShare).toString());
      
    }

    render(){
      
      
      if (this.state.loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }

      let imageUrl;
      if(this.state.datiUtente.picture === null){
        imageUrl = require("../../../assets/profile_pic.png");
      }
      console.log(this.state.datiUtente.name);
      const add = require("../../../assets/aggiungi.png");

      if(this.state.PaginaOggetto == true){
        return(
        <DettagliOggettoProfilo 
          idSelectedObject={this.state.idSelezionato}
          onCancel={() => this.setState({ PaginaOggetto: false })}>

        </DettagliOggettoProfilo>
        );

      }else{
        return (
          <View style={styles.container}>
            <View style={styles.circleContainer}>
            <TouchableOpacity onPress={this.showImagePickerDialog}>
              <View style={styles.circleContainer2}>
                <Image
                  source={this.state.datiUtente.picture
                    ? { uri: `data:image/png;base64,${this.state.datiUtente.picture}` }
                    : require("../../../assets/profile_menu.png")
                  }
                  style={styles.circleImage}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            <Dialog.Container visible={this.state.isDialogVisible}>
              <Dialog.Title>Seleziona un'opzione</Dialog.Title>
              <Dialog.Description>Scegli da dove vuoi selezionare l'immagine</Dialog.Description>
              <Dialog.Button label="Fotocamera" onPress={() => this.handleDialogOptionPress('camera')} />
              <Dialog.Button label="Galleria" onPress={() => this.handleDialogOptionPress('gallery')} />
            </Dialog.Container>
            </View>
            {this.state.isEditingName ? (
                <TextInput
                style={styles.labelCenter}
                value={this.state.datiUtente.name}
                onChangeText={(newName) => this.setState((prevState) => ({
                  datiUtente: { ...prevState.datiUtente, name: newName },
                }))}
                onBlur={() => {
                  if (this.state.datiUtente.name.trim() === '') {
                    // Se il nuovo nome è vuoto, reimposta il nome originale
                    this.setState((prevState) => ({
                      datiUtente: { ...prevState.datiUtente, name: prevState.originalName },
                    }));
                    alert('Errore: Il nome non può essere vuoto.');
                  }else {
                    const trimmedName = this.state.datiUtente.name.trim();
                    this.setState({
                      datiUtente: { ...this.state.datiUtente, name: trimmedName },
                      originalName: trimmedName,isEditingNameCount:1
                    });
                  }
                  this.setState({ isEditingName: false });
                }}
                autoFocus // Per far iniziare direttamente l'editing
                maxLength={15} // Imposta la lunghezza massima consentita
              />
              
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.labelCenter}>{this.state.datiUtente.name}</Text>
                  <TouchableOpacity onPress={() => this.setState({ isEditingName: true })}>
                    <Image
                      source={require('../../../assets/icona_matita.png')} // Sostituisci con il percorso corretto dell'immagine
                      style={{ width: 15, height: 15, marginLeft: 10, marginTop:10 }} // Imposta larghezza, altezza e colore desiderati
                    />
                  </TouchableOpacity>
                </View>
              )}    
            <View style={styles.line} />

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.column}>
                  <Text style={styles.labelLeft}>Punti vita:</Text>
                </View>
                <View style={styles.column}>
                <Text style={styles.labelLeft}>{this.state.datiUtente.life}</Text>          
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.column}>
                  <Text style={styles.labelLeft}>XP:</Text>
                </View>

                <View style={styles.column}>
                  <Text style={styles.labelLeft}>
                  {this.state.datiUtente.experience}</Text>       
                </View>
              </View>
              
            <Text style={styles.labelArtifacts}>Artefatti equipaggiati</Text>
            <View style={styles.smallCirclesContainer}>
            
            {(this.state.artifactsDetails.weaponId) && (
              <TouchableOpacity
                style={{ ...styles.smallCircle, borderWidth: 2, borderColor: '#483D8B' }}
                onPress={() => this.handlePaginaOggetto(this.state.datiUtente.weapon)}
              >
                <Image
                  source={
                    this.state.artifactsDetails.weaponImage
                      ? { uri: `data:image/png;base64,${this.state.artifactsDetails.weaponImage}` }
                      : require("../../../assets/icona_spada.png")
                  }
                  style={styles.smallCircleImageWeapon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {(this.state.artifactsDetails.armorId)  && (
              <TouchableOpacity
                style={{ ...styles.smallCircle, borderWidth: 2, borderColor: 'green' }}
                onPress={() => this.handlePaginaOggetto(this.state.datiUtente.armor)}
              >
               <Image
                  source={
                    this.state.artifactsDetails.armorImage
                      ? { uri: `data:image/png;base64,${this.state.artifactsDetails.armorImage}` }
                      : require("../../../assets/icona_armatura.png")
                  }
                  style={styles.smallCircleImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {(this.state.artifactsDetails.amuletId) && (
              <TouchableOpacity
                style={{ ...styles.smallCircle, borderWidth: 2, borderColor: 'purple' }}
                onPress={() => this.handlePaginaOggetto(this.state.datiUtente.amulet)}
              >
                 <Image
                  source={
                    this.state.artifactsDetails.amuletImage
                      ? { uri: `data:image/png;base64,${this.state.artifactsDetails.amuletImage}` }
                      : require("../../../assets/icona_amuleto.png")
                  }
                  style={styles.smallCircleImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.positionShareContainer}>
            <Text style={styles.labelPositionShare}>Condividi posizione:</Text>
            <Switch
              value={this.state.positionShare}
              onValueChange={this.handlePositionShareChange}
            />
            </View>
          </View>
        );
      }
    }
  }

  

const styles = StyleSheet.create({
  container: {
    flex: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: StileGlobale.coloreScritte,
  },
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  circleContainer2: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 0,
  },
  circleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 50,
  },
  column: {
    flex: 1,
    marginRight: 10,
    // Aggiungi altri stili necessari per il contenuto della colonna
  },
  line: {
    height: 2,
    backgroundColor: 'black',
    width: '100%',
    marginTop: 20,
  },
  labelLeft: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 30,
    fontSize: 25,
    fontWeight: 'bold',
  },
  labelCenter: {
    marginTop: 10,
    marginLeft: 7,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelArtifacts: {
    marginTop: 80,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  smallCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15, // Aggiunto margine orizzontale
  },
  smallCircleImage: {
    width: '80%', // Regola la larghezza dell'immagine
    height: '80%', // Regola l'altezza dell'immagine
    resizeMode: 'cover',
    borderRadius: 30,
  },
  smallCircleImageWeapon: {
    width: '65%', // Regola la larghezza dell'immagine
    height: '65%', // Regola l'altezza dell'immagine
    resizeMode: 'cover',
    borderRadius: 0,
  },
  positionShareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  labelPositionShare: {
    fontSize: 16,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: StileGlobale.coloreScritte,

  }
  
});

export default ProfileScreen;

