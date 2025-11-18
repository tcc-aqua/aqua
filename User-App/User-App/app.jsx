// Arquivo: User-App/App.js (VERSÃO CORRIGIDA E COMPLETA)

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componentes e Telas
import Login from './screens/Login'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './screens/Inicio';
import Metas from './screens/Metas';
import Relatorios from './screens/Relatorios';
import Perfil from './screens/Perfil';

export default function App() {
  // Estados principais da aplicação
  const [isLoading, setIsLoading] = useState(true);      // Controla a tela de loading inicial
  const [isLoggedIn, setIsLoggedIn] = useState(false);    // Controla se o usuário está logado ou não
  const [activeScreen, setActiveScreen] = useState('Inicio'); // Controla qual tela é exibida
  const [userData, setUserData] = useState(null);         // Armazena os dados do usuário logado

  // 1. LÓGICA DE VERIFICAÇÃO DE AUTENTICAÇÃO (RODA APENAS UMA VEZ)
  // Usamos o useCallback para memoizar a função e evitar recriações desnecessárias.
  const checkAuthStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      
      // A verificação crucial: PRECISAMOS DO TOKEN E DOS DADOS DO USUÁRIO
      if (token && userString) {
        setUserData(JSON.parse(userString));
        setIsLoggedIn(true);
      } else {
        // Se faltar um dos dois, garantimos o logout
        await AsyncStorage.multiRemove(['token', 'user']);
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (e) {
      console.error("Falha ao verificar o status de autenticação", e);
      setIsLoggedIn(false); // Em caso de erro, desloga por segurança
    } finally {
      // Independente do resultado, o carregamento inicial termina aqui
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // 2. FUNÇÃO DE LOGIN
  // Recebe os dados do usuário da tela de Login e os armazena
  const handleLogin = (user) => {
    if (user) {
      setUserData(user);
      setIsLoggedIn(true);
      setActiveScreen('Inicio'); // Garante que o usuário sempre comece pela tela de Início
    }
  };

  // 3. FUNÇÃO DE LOGOUT (ASSÍNCRONA PARA GARANTIR A LIMPEZA)
  // Limpa o AsyncStorage e reseta todos os estados para o padrão
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
    } catch(e) {
      console.error("Erro ao limpar o armazenamento durante o logout", e);
    } finally {
      setIsLoggedIn(false);
      setUserData(null);
      setActiveScreen('Inicio'); // Reseta a tela ativa
    }
  };

  // 4. RENDERIZAÇÃO DA TELA ATIVA
  // Isso evita recarregar a tela a cada renderização do App.js
  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'Inicio': return <Inicio />;
      case 'Metas': return <Metas />;
      case 'Relatorios': return <Relatorios />;
      // Passa a função de logout para a tela de Perfil
      case 'Perfil': return <Perfil onLogout={handleLogout} />;
      default: return <Inicio />;
    }
  };

  // 5. TELA DE CARREGAMENTO INICIAL
  // Mostra um indicador enquanto o app verifica o token no AsyncStorage
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A84FF" />
      </View>
    );
  }

  // 6. RENDERIZAÇÃO PRINCIPAL DO APP
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        {isLoggedIn && userData ? (
          // --- VISÃO DO USUÁRIO LOGADO ---
          <>
            <Header user={userData} />
            <View style={styles.contentArea}>
              {renderActiveScreen()}
            </View>
            <Footer activeScreen={activeScreen} onNavigate={setActiveScreen} />
          </>
        ) : (
          // --- VISÃO DO USUÁRIO DESLOGADO ---
          <Login onLogin={handleLogin} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentArea: { flex: 1 },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F2F2F7' // Um fundo mais suave
  },
});