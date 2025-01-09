import React, { Component } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainContainer from './navigation/MainContainer';
import AppViewModel from './viewModels/AppViewModel';
import AsyncStorage from '@react-native-async-storage/async-storage';

class App extends Component {
  state = {
    canUseLocation: false,
  };

  viewModel = new AppViewModel();

  async componentDidMount() {
    await this.viewModel.checkLocationPermission();
    await this.viewModel.registrazione();
    this.setState({ canUseLocation: this.viewModel.canUseLocation });
    
  }

  render() {
    if (!this.state.canUseLocation) {
      // Se il permesso di posizione non è concesso, mostra un messaggio di errore
      return (
        <View style={styles.container}>
          <Text>Permesso di posizione non concesso.</Text>
        </View>
      );
    }
    return (
      <MainContainer canUseLocation={this.state.canUseLocation}/>
    );
  }

  componentWillUnmount() {
    // Ferma il monitoraggio della posizione prima di smontare il componente
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
