import React, { useState } from 'react';
import { View, Text, SafeAreaView, Alert, StyleSheet } from 'react-native';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx'; // Importe o componente Footer

export default function HomeScreen() {
  const [activeScreen, setActiveScreen] = useState('home'); // Estado para controlar a tela ativa do footer
  
  // Funções para lidar com os cliques nos ícones do cabeçalho
  const handleNotificationsPress = () => {
    Alert.alert('Notificações', 'Você clicou no ícone de notificações!');
    // A lógica de exibição do modal de notificações agora está dentro do Header,
    // então esta função pode ser usada para outras ações, se necessário.
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Você clicou no ícone de menu!');
    // Implemente sua lógica aqui, como abrir um drawer ou navegação lateral
  };

 
  const handleFooterNavigate = (screenId) => {
    setActiveScreen(screenId);

    Alert.alert('Navegação', `Você foi para a tela: ${screenId.toUpperCase()}`);

  };

  return (
    <SafeAreaView style={styles.fullScreen}>
      <Header
        appName="AquaMonitor Pro"
        appLocation="Apto 1502 • Bloco A"
        logoUri="https://img.icons8.com/plasticine/100/water.png"
        notificationsCount={7}
        onMenuPress={handleMenuPress}
      />

      <View style={styles.content}>
        <Text style={styles.mainContentText}>Conteúdo da sua tela aqui!</Text>
        <Text style={styles.subContentText}>
          A tela ativa atualmente no footer é: <Text style={styles.activeScreenDisplay}>{activeScreen.toUpperCase()}</Text>
        </Text>
      </View>


      <Footer activeScreen={activeScreen} onNavigate={handleFooterNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  content: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainContentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subContentText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  activeScreenDisplay: {
    fontWeight: 'bold',
    color: '#2196F3', // Cor do tema
  }
});
