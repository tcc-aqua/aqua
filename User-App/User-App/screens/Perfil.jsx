import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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

const ProfileScreen = () => {
  const { colors } = useTheme(); // Para usar a cor de erro no botão

  // Estados para notificações específicas
  const [isLeakAlertsEnabled, setIsLeakAlertsEnabled] = useState(true);
  const [isConsumptionAlertsEnabled, setIsConsumptionAlertsEnabled] = useState(true);
  const [isGoalsAlertsEnabled, setIsGoalsAlertsEnabled] = useState(true);
  const [isCommunityAlertsEnabled, setIsCommunityAlertsEnabled] = useState(false);
  const [isReportsEnabled, setIsReportsEnabled] = useState(true);

  return (
    <ScrollView style={styles.container}>
      {/* Card 1: Informações Principais do Perfil */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.userInfoTopContainer}>
            <Avatar.Image
              size={80}
              source={{ uri: 'https://api.dicebear.com/8.x/initials/svg?seed=Seu+Nome' }}
              style={styles.avatar}
            />
            <View style={styles.userInfoTextContainer}>
              <Title style={styles.userName}>Seu Nome</Title>
              <View style={styles.userInfoDetailRow}>
                <Icon source="email" size={16} color="#666" />
                <Paragraph style={styles.infoText}>seu.email@exemplo.com</Paragraph>
              </View>
              <View style={styles.userInfoDetailRow}>
                <Icon source="office-building" size={16} color="#666" />
                <Paragraph style={styles.infoText}>Apt 123, Bloco A</Paragraph>
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

      {/* Card 2: Estatísticas */}
      <Card style={styles.card}>
        <Card.Title title="Minhas Estatísticas" />
        <Card.Content>
          <List.Item
            title="Tempo no app"
            left={props => <List.Icon {...props} icon="clock-time-eight-outline" color="#3498db" />}
            right={props => <Title {...props} style={styles.statListValue}>120 dias</Title>}
          />
          <Divider />
          <List.Item
            title="Economia total"
            left={props => <List.Icon {...props} icon="cash" color="#2ecc71" />}
            right={props => <Title {...props} style={styles.statListValue}>R$ 250</Title>}
          />
          <Divider />
          <List.Item
            title="Água poupada"
            left={props => <List.Icon {...props} icon="water" color="#5dade2" />}
            right={props => <Title {...props} style={styles.statListValue}>500 L</Title>}
          />
          <Divider />
          <List.Item
            title="Metas cumpridas"
            left={props => <List.Icon {...props} icon="check-circle" color="#f1c40f" />}
            right={props => <Title {...props} style={styles.statListValue}>12</Title>}
          />
        </Card.Content>
      </Card>

      {/* Card 3: Controle de Notificações Específicas */}
      <Card style={styles.card}>
        <Card.Title title="Notificações" subtitle="Escolha o que você quer receber" />
        <Card.Content>
          <List.Item
            title="Alertas de Vazamento"
            left={props => <List.Icon {...props} icon="pipe-leak" />}
            right={() => <Switch value={isLeakAlertsEnabled} onValueChange={setIsLeakAlertsEnabled} />}
          />
          <Divider />
          <List.Item
            title="Alto Consumo"
            left={props => <List.Icon {...props} icon="chart-line" />}
            right={() => <Switch value={isConsumptionAlertsEnabled} onValueChange={setIsConsumptionAlertsEnabled} />}
          />
          <Divider />
          <List.Item
            title="Metas e Objetivos"
            left={props => <List.Icon {...props} icon="flag-checkered" />}
            right={() => <Switch value={isGoalsAlertsEnabled} onValueChange={setIsGoalsAlertsEnabled} />}
          />
          <Divider />
          <List.Item
            title="Desafios da Comunidade"
            left={props => <List.Icon {...props} icon="account-group" />}
            right={() => <Switch value={isCommunityAlertsEnabled} onValueChange={setIsCommunityAlertsEnabled} />}
          />
          <Divider />
          <List.Item
            title="Relatórios de Economia"
            left={props => <List.Icon {...props} icon="file-chart" />}
            right={() => <Switch value={isReportsEnabled} onValueChange={setIsReportsEnabled} />}
          />
        </Card.Content>
      </Card>
      
      {/* Card 4: Ajuda e Suporte */}
      <Card style={styles.card}>
        <Card.Title title="Ajuda & Suporte" />
        <Card.Content>
          <List.Item
            title="Central de Ajuda"
            left={props => <List.Icon {...props} icon="help-circle-outline" />}
            onPress={() => console.log('Pressionou Central de Ajuda')}
          />
          <Divider />
          <List.Item
            title="Suporte Técnico"
            left={props => <List.Icon {...props} icon="headset" />}
            onPress={() => console.log('Pressionou Suporte Técnico')}
          />
          <Divider />
          <List.Item
            title="Privacidade"
            left={props => <List.Icon {...props} icon="shield-lock-outline" />}
            onPress={() => console.log('Pressionou Privacidade')}
          />
          <Divider />
          <List.Item
            title="Avaliar App"
            left={props => <List.Icon {...props} icon="star-outline" />}
            onPress={() => console.log('Pressionou Avaliar App')}
          />
        </Card.Content>
      </Card>
      
      {/* Botão de Logout */}
      <Button
        icon="logout"
        mode="contained"
        onPress={() => console.log('Pressionou Sair')}
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
  // --- Estilos do Card de Perfil ---
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
  // --- Estilo para o valor na lista de estatísticas ---
  statListValue: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  // --- Estilo para o Botão de Logout ---
  logoutButton: {
    marginTop: 15,
    marginBottom: 20,
    paddingVertical: 5,
  },
});

export default ProfileScreen;