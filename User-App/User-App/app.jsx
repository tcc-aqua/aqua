import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Falha ao verificar autenticação", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setIsLoggedIn(false);
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Inicio': return <Inicio />;
      case 'Metas': return <Metas />;
      case 'Relatorios': return <Relatorios />;
      case 'Perfil': return <Perfil onLogout={handleLogout} />;
      default: return <Inicio />;
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        {isLoggedIn ? (
          <>
            <Header />
            <View style={styles.contentArea}>
              {renderActiveScreen()}
            </View>
            <Footer activeScreen={activeScreen} onNavigate={setActiveScreen} />
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentArea: { flex: 1 },
});