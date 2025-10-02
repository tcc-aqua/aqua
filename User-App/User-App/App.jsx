// App.jsx (ou sua tela principal, como HomeScreen.jsx)

import React, { useState } from 'react'; // Importe useState para gerenciar o estado
import { View, Text, SafeAreaView, Alert, StyleSheet } from 'react-native';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx'; // Importe o componente Footer

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

  // Função para lidar com a navegação do footer
  const handleFooterNavigate = (screenId) => {
    setActiveScreen(screenId); // Atualiza qual item do footer está ativo
    // === Lógica de Navegação Real (Exemplo com Alert) ===
    Alert.alert('Navegação', `Você foi para a tela: ${screenId.toUpperCase()}`);
    // No futuro, aqui você usaria seu sistema de navegação (ex: React Navigation)
    // Ex: navigation.navigate(screenId);
    // ===================================================
  };

  return (
    // O SafeAreaView garante que o conteúdo não se sobreponha à barra de status/notch
    <SafeAreaView style={styles.fullScreen}>
      <Header
        appName="AquaMonitor Pro"
        appLocation="Apto 1502 • Bloco A"
        logoUri="https://img.icons8.com/plasticine/100/water.png"
        notificationsCount={7}
        // onNotificationsPress={handleNotificationsPress} // O Header agora gerencia seu próprio modal de notificações
        onMenuPress={handleMenuPress}
      />

      <View style={styles.content}>
        <Text style={styles.mainContentText}>Conteúdo da sua tela aqui!</Text>
        <Text style={styles.subContentText}>
          A tela ativa atualmente no footer é: <Text style={styles.activeScreenDisplay}>{activeScreen.toUpperCase()}</Text>
        </Text>
      </View>

      {/* Renderiza o Footer, passando a tela ativa e a função de navegação */}
      <Footer activeScreen={activeScreen} onNavigate={handleFooterNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Um fundo claro para a tela
  },
  content: {
    flex: 1, // Faz o conteúdo ocupar todo o espaço disponível entre Header e Footer
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