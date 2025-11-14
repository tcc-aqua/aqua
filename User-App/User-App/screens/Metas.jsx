import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { 
  Provider as PaperProvider, 
  DefaultTheme, 
  Avatar, 
  Button, 
  Card, 
  Title, 
  Paragraph,
  Text,
  List,
  ProgressBar,
} from 'react-native-paper'; 
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { MotiPressable } from 'moti/interactions';
import * as Haptics from 'expo-haptics';

const theme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0A84FF',
    accent: '#005ecb',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#1C1C1E',
    placeholder: '#8A8A8E',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    gold: '#FFD700',
  },
};

const generalProgress = {
  active: 5,
  completed: 10,
  points: 1500,
};

const myGoals = [
  { id: '1', title: 'Economizar 100L de água esta semana', progress: 0.75, status: 'Em andamento', icon: 'water-percent' },
  { id: '2', title: 'Reduzir o tempo de banho para 5 minutos', progress: 1, status: 'Concluída', icon: 'clock-check-outline' },
  { id: '3', title: 'Consertar o vazamento da torneira', progress: 0, status: 'Pendente', icon: 'wrench-outline' },
];

const communityChallenge = {
  title: 'Desafio Coletivo de Dezembro',
  description: 'Todo o condomínio unido para reduzir o consumo em 15% e ganhar uma recompensa especial!',
  progress: 0.6,
};

const ranking = [
  { id: '1', name: 'Apto 12B', points: 2000, avatar: 'numeric-1-circle' },
  { id: '2', name: 'Você', points: 1500, avatar: 'account-circle' },
  { id: '3', name: 'Apto 8A', points: 1200, avatar: 'numeric-3-circle' },
];

const MetasScreen = () => {
  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 500 }}>
          <LinearGradient
            colors={['#4A00E0', '#8E2DE2']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.gradientCard}
          >
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitleWhite}>Seu Progresso</Title>
              <Avatar.Icon size={40} icon="trophy-award" color={theme.colors.gold} style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Title style={styles.statNumeroBranco}>{generalProgress.active}</Title>
                <Paragraph style={styles.statLabelBranco}>Ativas</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumeroBranco}>{generalProgress.completed}</Title>
                <Paragraph style={styles.statLabelBranco}>Concluídas</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumeroBranco}>{generalProgress.points}</Title>
                <Paragraph style={styles.statLabelBranco}>Pontos</Paragraph>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 100 }} style={styles.actionsContainer}>
            <MotiPressable 
              style={styles.actionButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })}
            >
                <List.Icon icon="plus-circle-outline" color={theme.colors.primary} />
                <Text style={styles.actionText}>Criar Nova Meta</Text>
            </MotiPressable>
            <MotiPressable 
              style={[styles.actionButton, { backgroundColor: '#FFFBE6' }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })}
            >
                <List.Icon icon="gift-outline" color={theme.colors.gold} />
                <Text style={[styles.actionText, { color: theme.colors.gold }]}>Recompensas</Text>
            </MotiPressable>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 200 }}>
          <Card style={styles.card} elevation={2}>
            <Card.Title title="Minhas Metas Atuais" titleStyle={styles.cardTitle} />
            <Card.Content>
              {myGoals.map((meta, index) => (
                <View key={meta.id} style={styles.goalItem}>
                  <List.Icon icon={meta.icon} color={meta.progress === 1 ? theme.colors.success : theme.colors.primary} style={{ marginLeft: -10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.goalTitle}>{meta.title}</Text>
                    <ProgressBar progress={meta.progress} color={meta.progress === 1 ? theme.colors.success : theme.colors.primary} style={styles.goalProgressBar} />
                  </View>
                  <Text style={[styles.goalStatus, { color: meta.progress === 1 ? theme.colors.success : theme.colors.placeholder }]}>
                    {meta.status}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </MotiView>
        
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 300 }}>
          <Card style={styles.card} elevation={2}>
            <Card.Title title={communityChallenge.title} subtitle="Participe com seus vizinhos!" titleStyle={styles.cardTitle} />
            <Card.Content>
              <Paragraph style={styles.challengeDescription}>{communityChallenge.description}</Paragraph>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.goalText}>Progresso do Condomínio:</Text>
                <ProgressBar progress={communityChallenge.progress} color={theme.colors.success} style={styles.goalProgressBar} />
              </View>
            </Card.Content>
          </Card>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 400 }}>
          <Card style={styles.card} elevation={2}>
            <Card.Title title="Ranking de Pontos" titleStyle={styles.cardTitle} />
            <Card.Content>
              {ranking.map((item, index) => (
                <List.Item
                  key={item.id}
                  title={item.name}
                  titleStyle={item.name === 'Você' ? styles.rankingYou : styles.rankingOthers}
                  left={() => <Avatar.Icon size={40} icon={item.avatar} color={item.name === 'Você' ? theme.colors.primary : theme.colors.placeholder} style={{backgroundColor: 'transparent'}} />}
                  right={() => <Text style={styles.rankingPoints}>{item.points} pts</Text>}
                />
              ))}
            </Card.Content>
          </Card>
        </MotiView>
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 48,
  },
  card: {
    marginBottom: 20,
    borderRadius: theme.roundness * 1.5,
    backgroundColor: theme.colors.surface,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  gradientCard: {
    marginBottom: 20,
    borderRadius: theme.roundness * 1.5,
    elevation: 8,
    shadowColor: '#4A00E0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumeroBranco: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabelBranco: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    paddingVertical: 10,
    elevation: 2,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: 6,
  },
  goalProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  goalStatus: {
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 14,
  },
  challengeDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.placeholder,
  },
  goalText: {
    marginBottom: 8,
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  rankingYou: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  rankingOthers: {
    color: theme.colors.text,
  },
  rankingPoints: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.gold,
  }
});

export default MetasScreen;