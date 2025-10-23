import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Componentes
import Login from './screens/Login'; // <-- seu Login.jsx
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './screens/Inicio';
import Metas from './screens/Metas';
import Relatorios from './screens/Relatorios';
import Perfil from './screens/Perfil';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('Inicio');

  const handleMenuPress = () => alert('Menu pressionado!');

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Inicio': return <Inicio />;
      case 'Metas': return <Metas />;
      case 'Relatorios': return <Relatorios />;
      case 'Perfil': return <Perfil />;
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
