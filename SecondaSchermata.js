import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import Utente from './Utente';

class SecondaSchermata extends React.Component {
  render() {
    console.log(this.props);
    return (
      <View>
        <Text>Dettagli Utente</Text>
        {this.props.utenteSelezionato && (
          <View>
            <Utente data={this.props.utenteSelezionato} />
            <Text>{this.props.calcolaStatoUtente(this.props.utenteSelezionato)}</Text>
            <Button title="Torna Indietro" onPress={() => this.props.handleTornaIndietro()} />
          </View>
        )}
      </View>
    );
  }
}

export default SecondaSchermata;
