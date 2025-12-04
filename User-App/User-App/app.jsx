import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 1. IMPORTAÇÃO DO PAPER PROVIDER (O que faltava)
import { Provider as PaperProvider } from 'react-native-paper';

// Navegação
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas
import Login from './screens/Login'; 
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './screens/Inicio';
import Metas from './screens/Metas';
import Relatorios from './screens/Relatorios';
import Perfil from './screens/Perfil';
import LoadingScreen from './screens/Loading';

// Ajuste seu IP aqui
const API_URL = 'http://192.168.0.15:3334/api'; 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Adaptador do Footer
const CustomFooterAdapter = ({ state, navigation, OriginalFooter }) => {
  const currentRouteName = state.routes[state.index].name;
  return <OriginalFooter activeScreen={currentRouteName} onNavigate={(screen) => navigation.navigate(screen)} />;
};

// Telas Logadas (Com Header e Footer)
function AuthenticatedApp({ userData, onLogout, onUpdateUser }) {
  return (
    <View style={{ flex: 1 }}>
      <Header user={userData} />
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomFooterAdapter {...props} OriginalFooter={Footer} />}
      >
        <Tab.Screen name="Inicio" component={Inicio} />
        <Tab.Screen name="Metas" component={Metas} />
        <Tab.Screen name="Relatorios" component={Relatorios} />
        <Tab.Screen name="Perfil">
          {(props) => <Perfil {...props} onLogout={onLogout} onUpdateUser={onUpdateUser} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

// === APP PRINCIPAL ===
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const token = await AsyncStorage.getItem('token');
      const userString = await AsyncStorage.getItem('user');
      
      if (token && userString) {
        setUserData(JSON.parse(userString));
        setIsLoggedIn(true);
        handleUpdateUser(); 
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { checkAuthStatus(); }, [checkAuthStatus]);

  const handleLogin = (user) => { setUserData(user); setIsLoggedIn(true); };
  
  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setIsLoggedIn(false);
    setUserData(null);
  };

  const handleUpdateUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data) {
        setUserData(res.data);
        await AsyncStorage.setItem('user', JSON.stringify(res.data));
      }
    } catch (error) { console.error(error); }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <SafeAreaProvider>
      {/* 2. ENVOLVENDO TUDO COM PAPER PROVIDER */}
      <PaperProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {isLoggedIn && userData ? (
                <Stack.Screen name="MainApp">
                  {() => <AuthenticatedApp userData={userData} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />}
                </Stack.Screen>
              ) : (
                <Stack.Screen name="Login">
                  {props => <Login {...props} onLogin={handleLogin} />}
                </Stack.Screen>
              )}
            </Stack.Navigator>
          </NavigationContainer>

        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}