import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  Icon,
  Divider,
  List,
  Switch,
  Button,
  useTheme,
} from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL padronizada para localhost, compatível com adb reverse.
const API_URL = 'http://localhost:3334/api';

const ProfileScreen = ({ navigation, onLogout }) => {
  const { colors } = useTheme();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeakAlertsEnabled, setIsLeakAlertsEnabled] = useState(true);
  const [isConsumptionAlertsEnabled, setIsConsumptionAlertsEnabled] = useState(true);
  const [isGoalsAlertsEnabled, setIsGoalsAlertsEnabled] = useState(true);
  const [isCommunityAlertsEnabled, setIsCommunityAlertsEnabled] = useState(false);
  const [isReportsEnabled, setIsReportsEnabled] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('token');
        
        if (!authToken) {
          setUser(null); 
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/profile`, {
          headers: { 'Authorization': `Bearer ${authToken}` }
        });

        setUser(response.data);

      } catch (error) {
        console.error("ERRO AO BUSCAR PERFIL:", error.response?.data || error.message);
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem('token');
            onLogout();
        } else {
            setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileData();
  }, [onLogout]);

  const handleLogoutPress = async () => {
    await AsyncStorage.removeItem('token');
    onLogout();
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Title style={{textAlign: 'center'}}>Não foi possível carregar o perfil.</Title>
        <Paragraph style={{textAlign: 'center'}}>Por favor, faça o login novamente.</Paragraph>
        <Button onPress={onLogout} style={{marginTop: 20}}>Voltar ao Login</Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.userInfoTopContainer}>
            <Avatar.Image
              size={80}
              source={{ uri: `https://api.dicebear.com/8.x/initials/svg?seed=${user.user_name}` }}
              style={styles.avatar}
            />
            <View style={styles.userInfoTextContainer}>
              <Title style={styles.userName}>{user.user_name}</Title>
              <View style={styles.userInfoDetailRow}>
                <Icon source="email" size={16} color="#666" />
                <Paragraph style={styles.infoText}>{user.user_email}</Paragraph>
              </View>
              <View style={styles.userInfoDetailRow}>
                <Icon source="office-building" size={16} color="#666" />
                <Paragraph style={styles.infoText}>{user.logradouro}, {user.numero}</Paragraph>
              </View>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.userStatsContainer}>
            <View style={styles.statItem}>
              <Title style={styles.statValue}>1500</Title>
              <Paragraph style={styles.statLabel}>Pontos</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statValue}>#2</Title>
              <Paragraph style={styles.statLabel}>Ranking</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Minhas Estatísticas" />
        <Card.Content>
          <List.Item title="Tempo no app" left={props => <List.Icon {...props} icon="clock-time-eight-outline" color="#3498db" />} right={props => <Title {...props} style={styles.statListValue}>120 dias</Title>} />
          <Divider />
          <List.Item title="Economia total" left={props => <List.Icon {...props} icon="cash" color="#2ecc71" />} right={props => <Title {...props} style={styles.statListValue}>R$ 250</Title>} />
          <Divider />
          <List.Item title="Água poupada" left={props => <List.Icon {...props} icon="water" color="#5dade2" />} right={props => <Title {...props} style={styles.statListValue}>500 L</Title>} />
          <Divider />
          <List.Item title="Metas cumpridas" left={props => <List.Icon {...props} icon="check-circle" color="#f1c40f" />} right={props => <Title {...props} style={styles.statListValue}>12</Title>} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Notificações" subtitle="Escolha o que você quer receber" />
        <Card.Content>
          <List.Item title="Alertas de Vazamento" left={props => <List.Icon {...props} icon="pipe-leak" />} right={() => <Switch value={isLeakAlertsEnabled} onValueChange={setIsLeakAlertsEnabled} />} />
          <Divider />
          <List.Item title="Alto Consumo" left={props => <List.Icon {...props} icon="chart-line" />} right={() => <Switch value={isConsumptionAlertsEnabled} onValueChange={setIsConsumptionAlertsEnabled} />} />
          <Divider />
          <List.Item title="Metas e Objetivos" left={props => <List.Icon {...props} icon="flag-checkered" />} right={() => <Switch value={isGoalsAlertsEnabled} onValueChange={setIsGoalsAlertsEnabled} />} />
          <Divider />
          <List.Item title="Desafios da Comunidade" left={props => <List.Icon {...props} icon="account-group" />} right={() => <Switch value={isCommunityAlertsEnabled} onValueChange={setIsCommunityAlertsEnabled} />} />
          <Divider />
          <List.Item title="Relatórios de Economia" left={props => <List.Icon {...props} icon="file-chart" />} right={() => <Switch value={isReportsEnabled} onValueChange={setIsReportsEnabled} />} />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Title title="Ajuda & Suporte" />
        <Card.Content>
          <List.Item title="Central de Ajuda" left={props => <List.Icon {...props} icon="help-circle-outline" />} onPress={() => navigation.navigate('HelpCenter')} />
          <Divider />
          <List.Item title="Suporte Técnico" left={props => <List.Icon {...props} icon="headset" />} onPress={() => navigation.navigate('Support')} />
          <Divider />
          <List.Item title="Privacidade" left={props => <List.Icon {...props} icon="shield-lock-outline" />} onPress={() => navigation.navigate('PrivacyPolicy')} />
          <Divider />
          <List.Item title="Avaliar App" left={props => <List.Icon {...props} icon="star-outline" />} onPress={() => {}} />
        </Card.Content>
      </Card>
      
      <Button
        icon="logout"
        mode="contained"
        onPress={handleLogoutPress}
        style={styles.logoutButton}
        buttonColor={colors.error}
      >
        Sair da Conta
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    marginBottom: 15,
  },
  userInfoTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 15,
  },
  userInfoTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userInfoDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginVertical: 15,
  },
  userStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
  },
  statListValue: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  logoutButton: {
    marginTop: 15,
    marginBottom: 20,
    paddingVertical: 5,
  },
});

export default ProfileScreen;