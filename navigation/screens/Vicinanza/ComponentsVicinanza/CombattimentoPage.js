import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import VicinanzaViewModel from '../../../../viewModels/VicinanzaViewModel';
import { StileGlobale } from '../../../../styles/StileGlobale';
class CombattimentoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calcoloVitaPersa: [],
    };
  }

  async componentDidMount() {
    const { minLifeLoss, maxLifeLoss } = this.props;

    const calcoloVitaPersa = await this.props.vicinanzaModel.combattimentoConArmatura(
      minLifeLoss,
      maxLifeLoss
    );
    console.log(calcoloVitaPersa.maxVita);
    this.setState({ calcoloVitaPersa });
  }

  render() {
    const { onConfirm, onCancel } = this.props;

    return (
      <View style={styles.container}>
        <View style={{ padding: 20, borderRadius: 10, alignItems: 'center' }}>
          <Text style={styles.boldText}>
            Perderai tra i {this.state.calcoloVitaPersa.minVita} e{' '}
            {this.state.calcoloVitaPersa.maxVita} punti vita
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onCancel}>
            <Text style={styles.backButtonText}>Indietro</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.combatButton} onPress={onConfirm}>
            <Text style={styles.backButtonText}>Combatti</Text>
          </TouchableOpacity>
        </View>
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
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    flex: 1, // Utilizza flex per distribuire dinamicamente la larghezza
    marginRight: 6, // Aggiunto un margine per separare i pulsanti
    marginLeft: 65, // Aggiunto un margine per separare i pulsanti
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  combatButton: {
    flex: 1,
    marginRight: 65,
    marginLeft: 6, 
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'tomato',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Ridotto il padding orizzontale
  },
});

export default CombattimentoPage;
