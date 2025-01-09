import React from 'react';
import { View, Text, Button } from 'react-native';
import Utente from './Utente';

class SchermataProfilo extends React.Component {
  render() {
    console.log(this.props);
    return (
      <View>
        <Text>Il mio profilo</Text>
        {this.props.utentebase && (
          <View>
            <Utente data={this.props.utentebase} />
            <Button title="Torna Indietro" onPress={() => this.props.handleTornaIndietro()} />
          </View>
        )}
      </View>
    );
  }
}

export default SchermataProfilo;
