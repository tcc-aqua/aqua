import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import {
  Card,
  Divider,
  List,
  Switch,
  Button,
  useTheme,
  Snackbar,
  Title,
  Paragraph,
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileHeader from '../components/Perfil/ProfileHeader';
import StatCard from '../components/Perfil/StatCard';

const API_URL = 'http://localhost:3334/api';

const ProfileScreen = ({ navigation, onLogout }) => {
  const { colors } = useTheme();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  const [notificationPrefs, setNotificationPrefs] = useState({
    notif_vazamento: true,
    notif_consumo_alto: true,
    notif_metas: true,
    notif_comunidade: false,
    notif_relatorios: true,
  });

  const fetchProfileData = useCallback(async () => {
    try {
      const authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        onLogout();
        return;
      }
      const headers = { Authorization: `Bearer ${authToken}` };
      const [profileResponse, statsResponse] = await Promise.all([
        axios.get(`${API_URL}/profile`, { headers }),
        axios.get(`${API_URL}/user/me/stats`, { headers })
      ]);

      if (profileResponse.data) {
        setUser(profileResponse.data);
        setNotificationPrefs({
          notif_vazamento: profileResponse.data.notif_vazamento,
          notif_consumo_alto: profileResponse.data.notif_consumo_alto,
          notif_metas: profileResponse.data.notif_metas,
          notif_comunidade: profileResponse.data.notif_comunidade,
          notif_relatorios: profileResponse.data.notif_relatorios,
        });
      }
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error("ERRO AO BUSCAR DADOS:", error.response?.data || error.message);
      if (error.response?.status === 401) onLogout();
      else Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setIsLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleNotificationChange = async (key, value) => {
    const originalPrefs = { ...notificationPrefs };
    setNotificationPrefs(prev => ({ ...prev, [key]: value }));

    try {
      const authToken = await AsyncStorage.getItem('token');
      await axios.put(`${API_URL}/user/me`, { [key]: value }, { headers: { Authorization: `Bearer ${authToken}` } });
      setSnackbar({ visible: true, message: 'Preferência salva!' });
    } catch (error) {
      setNotificationPrefs(originalPrefs);
      Alert.alert("Erro", "Não foi possível salvar sua preferência.");
    }
  };

  const handleLogoutPress = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    onLogout();
  };

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user || !stats) {
    return (
      <View style={styles.centeredContainer}>
        <Title>Erro ao carregar perfil.</Title>
        <Paragraph>Por favor, tente novamente.</Paragraph>
        <Button onPress={onLogout} style={{ marginTop: 20 }}>Voltar ao Login</Button>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ProfileHeader user={user} />

        <Title style={styles.sectionTitle}>Minhas Estatísticas</Title>
        <View style={styles.statsGrid}>
          <StatCard icon="trophy-award" color="#FFD700" label="Pontos" value={stats.pontos} delay={0} />
          <StatCard icon="podium" color="#C0C0C0" label="Ranking" value={stats.ranking} unit="º" delay={100} />
          <StatCard icon="water-sync" color="#5dade2" label="Água Poupada" value={stats.agua_poupada} unit=" L" delay={200} />
          <StatCard icon="cash-multiple" color="#2ecc71" label="Economia Total" value={stats.economia_total} unit=" R$" delay={300} />
          <StatCard icon="flag-checkered" color="#f1c40f" label="Metas Cumpridas" value={stats.metas_cumpridas} delay={400} />
          <StatCard icon="clock-time-eight-outline" color="#3498db" label="Dias no App" value={stats.tempo_no_app} delay={500} />
        </View>

        <Card style={styles.card}>
          <List.Accordion title="Notificações" id="1" left={props => <List.Icon {...props} icon="bell-outline" />}>
            <List.Item title="Alertas de Vazamento" right={() => <Switch value={notificationPrefs.notif_vazamento} onValueChange={(v) => handleNotificationChange('notif_vazamento', v)} />} />
            <List.Item title="Alto Consumo" right={() => <Switch value={notificationPrefs.notif_consumo_alto} onValueChange={(v) => handleNotificationChange('notif_consumo_alto', v)} />} />
            <List.Item title="Metas e Objetivos" right={() => <Switch value={notificationPrefs.notif_metas} onValueChange={(v) => handleNotificationChange('notif_metas', v)} />} />
            <List.Item title="Desafios da Comunidade" right={() => <Switch value={notificationPrefs.notif_comunidade} onValueChange={(v) => handleNotificationChange('notif_comunidade', v)} />} />
            <List.Item title="Relatórios de Economia" right={() => <Switch value={notificationPrefs.notif_relatorios} onValueChange={(v) => handleNotificationChange('notif_relatorios', v)} />} />
          </List.Accordion>
          <Divider/>
          <List.Accordion title="Ajuda & Suporte" id="2" left={props => <List.Icon {...props} icon="help-circle-outline" />}>
            <List.Item title="Central de Ajuda" onPress={() => {}} />
            <List.Item title="Suporte Técnico" onPress={() => {}} />
            <List.Item title="Termos de Serviço" onPress={() => {}} />
          </List.Accordion>
        </Card>

        <Button icon="logout" mode="contained" onPress={handleLogoutPress} style={styles.logoutButton} buttonColor={colors.error}>
          Sair da Conta
        </Button>
      </ScrollView>
      <Snackbar visible={snackbar.visible} onDismiss={() => setSnackbar({ ...snackbar, visible: false })} duration={3000}>
        {snackbar.message}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },
  card: {
    marginBottom: 15,
    borderRadius: 16,
  },
  logoutButton: {
    marginTop: 15,
    paddingVertical: 8,
    borderRadius: 16,
  },
});

export default ProfileScreen;