import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from './screens/Login'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './screens/Inicio';
import Metas from './screens/Metas';
import Relatorios from './screens/Relatorios';
import Perfil from './screens/Perfil';
import LoadingScreen from './screens/Loading';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('Inicio');
  const [userData, setUserData] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      
      if (token && userString) {
        setUserData(JSON.parse(userString));
        setIsLoggedIn(true);
        setActiveScreen('Inicio');
      } else {
        await AsyncStorage.multiRemove(['token', 'user']);
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (e) {
      setIsLoggedIn(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLogin = async (user) => {
    if (user) {
      setUserData(user);
      setIsLoggedIn(true);
      setActiveScreen('Inicio');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
    } catch(e) {
      console.error(e);
    } finally {
      setIsLoggedIn(false);
      setUserData(null);
      setActiveScreen('Inicio');
    }
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
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        {isLoggedIn && userData ? (
          <>
            <Header user={userData} />
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