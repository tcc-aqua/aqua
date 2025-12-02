import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Login from './screens/Login'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './screens/Inicio';
import Metas from './screens/Metas';
import Relatorios from './screens/Relatorios';
import Perfil from './screens/Perfil';
import LoadingScreen from './screens/Loading';

// Ajuste o IP conforme necessário
const API_URL = 'http://localhost:3334/api';

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
        // Atualiza dados frescos do servidor ao abrir
        handleUpdateUser(); 
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

  // Função para forçar a atualização dos dados do usuário globalmente
  const handleUpdateUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setUserData(response.data);
        await AsyncStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário no App.jsx:", error);
    }
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Inicio': return <Inicio />;
      case 'Metas': return <Metas />;
      case 'Relatorios': return <Relatorios />;
      case 'Perfil': 
        return <Perfil onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
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
            {/* O Header recebe o userData atualizado automaticamente */}
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