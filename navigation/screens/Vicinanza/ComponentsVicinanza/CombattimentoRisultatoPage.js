import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,ActivityIndicator } from 'react-native';
import VicinanzaViewModel from '../../../../viewModels/VicinanzaViewModel';
import { StileGlobale } from '../../../../styles/StileGlobale';
class CombattimentoRisultatoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vitaFinale: 0,
      loading: true,
      xp:0
    };
  }

  async componentDidMount() {
    const vitaFinale = await this.props.vicinanzaModel.ritornaVitaUtente();
    const xp = await this.props.vicinanzaModel.getXpDopoAttivazione();

    this.setState({ vitaFinale ,loading:false,xp});
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: StileGlobale.coloreScritte,
      },
      content: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
      },
      vitaText: {
        fontWeight: 'bold',
        fontSize:18,
        marginTop: 10,
      },
      backButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'tomato',
        borderRadius: 5,
      },
      backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center', // Aggiunto per centrare il testo
    
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: StileGlobale.coloreScritte,

      }
    });

    if (this.state.loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    if(this.props.vicinanzaModel.getDied() == true){
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.vitaText}>Sei morto, hai perso tutti i tuoi artefatti e ricomincerai da 100 punti vita.</Text>
            <TouchableOpacity style={styles.backButton} onPress={this.props.handlePaginaOggetto}>
              <Text style={styles.backButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.vitaText}>Ti rimangono {this.state.vitaFinale} punti vita e hai guadagnato {this.state.xp} punti esperienza</Text>
          <TouchableOpacity style={styles.backButton} onPress={this.props.handlePaginaOggetto}>
            <Text style={styles.backButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default CombattimentoRisultatoPage;
