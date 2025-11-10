// Este é o seu app.jsx do FRONT-END

import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Componentes
import Login from './screens/Login'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './screens/Inicio';
import Metas from './screens/Metas';
import Relatorios from './screens/Relatorios';
import Perfil from './screens/Perfil';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('Inicio');

  // ==================================================================
  // 1. ADICIONE ESSA FUNÇÃO DE LOGOUT AQUI
  // ==================================================================
  const handleLogout = () => {
    setIsLoggedIn(false); // Desliga o "interruptor" que mostra o app
  };

  const handleMenuPress = () => alert('Menu pressionado!');

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Inicio': return <Inicio />;
      case 'Metas': return <Metas />;
      case 'Relatorios': return <Relatorios />;
      // ==================================================================
      // 2. PASSE A FUNÇÃO DE LOGOUT PARA O PERFIL AQUI
      // ==================================================================
      case 'Perfil': return <Perfil onLogout={handleLogout} />;
      default: return <Inicio />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        {isLoggedIn ? (
          <>
            <Header
              appName="Aqua"
              appLocation="Apto 1502 • Bloco A"
              logoUri="https://img.icons8.com/plasticine/100/water.png"
              onMenuPress={handleMenuPress}
            />
            <View style={styles.contentArea}>
              {renderActiveScreen()}
            </View>
            <Footer activeScreen={activeScreen} onNavigate={setActiveScreen} />
          </>
        ) : (
          <Login onLogin={() => setIsLoggedIn(true)} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentArea: { flex: 1 },
});