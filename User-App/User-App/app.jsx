// App.jsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// COMPONENTES
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './screens/Inicio';
import Metas from './screens/Metas';
import Relatorios from './screens/Relatorios';
import Perfil from './screens/Perfil';

export default function App() {

  const [activeScreen, setActiveScreen] = useState('App');

  // Clique no botão do Header
  const handleMenuPress = () => {
    Alert.alert('Menu', 'O botão de menu foi pressionado!');
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'App':
        return <Inicio />;
      case 'Metas':
        return <Metas />;
      case 'Relatorios':
        return <Relatorios />;
      case 'Perfil':
        return <Perfil />;
      default:
        return <Inicio />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        {/* APLIQUEI SEU HEADER AQUI */}
        <Header
          appName="Aqua"
          appLocation="Apto 1502 • Bloco A"
          logoUri="https://img.icons8.com/plasticine/100/water.png"
          onMenuPress={handleMenuPress}
        />

        {/* ÁREA DE CONTEÚDO */}
        <View style={styles.contentArea}>
          {renderActiveScreen()}
        </View>

        {/* FOOTER */}
        <Footer
          activeScreen={activeScreen}
          onNavigate={setActiveScreen}
        />

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contentArea: {
    flex: 1,
  },
});
