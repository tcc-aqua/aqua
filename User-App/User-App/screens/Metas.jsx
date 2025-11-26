import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Alert } from 'react-native';
import { 
  Provider as PaperProvider, 
  DefaultTheme, 
  Avatar, 
  Card, 
  Title, 
  Paragraph,
  Text,
  List,
  ProgressBar,
  Portal,
  Modal,
  Button,
  TextInput,
  RadioButton
} from 'react-native-paper'; 
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MotiPressable } from 'moti/interactions';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3334/api'; 

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
    gold: '#FFD700',
  },
};

const MetasScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dados do Backend
  const [progressStats, setProgressStats] = useState({ active: 0, completed: 0, points: 0 });
  const [myGoals, setMyGoals] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [communityChallenge, setCommunityChallenge] = useState({ title: '', description: '', progresso: 0 });
  
  // Modal de Criação
  const [modalVisible, setModalVisible] = useState(false);
  const [newMetaLimit, setNewMetaLimit] = useState('');
  const [newMetaPeriod, setNewMetaPeriod] = useState('7 dias');
  const [creating, setCreating] = useState(false);

  // Carregar dados
  const fetchData = useCallback(async () => {
    try {
      const authToken = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${authToken}` };

      const [statsRes, metasRes, rankingRes, desafioRes] = await Promise.all([
        axios.get(`${API_URL}/metas/stats`, { headers }),
        axios.get(`${API_URL}/metas?limit=5`, { headers }), // Pega as 5 mais recentes
        axios.get(`${API_URL}/gamification/ranking`, { headers }),
        axios.get(`${API_URL}/gamification/desafio`, { headers })
      ]);

      setProgressStats(statsRes.data);
      setMyGoals(metasRes.data.docs || []);
      setRanking(rankingRes.data);
      setCommunityChallenge(desafioRes.data);

    } catch (error) {
      console.error("Erro ao carregar metas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCreateMeta = async () => {
    if (!newMetaLimit) {
        Alert.alert("Erro", "Defina um limite de consumo (Litros).");
        return;
    }
    
    setCreating(true);
    try {
        const authToken = await AsyncStorage.getItem('token');
        await axios.post(`${API_URL}/metas`, {
            periodo: newMetaPeriod,
            limite_consumo: parseFloat(newMetaLimit)
        }, { headers: { Authorization: `Bearer ${authToken}` }});
        
        Alert.alert("Sucesso", "Nova meta criada! Ela aparecerá no início.");
        setModalVisible(false);
        setNewMetaLimit('');
        fetchData(); // Recarrega para atualizar a lista e o Início
    } catch (error) {
        Alert.alert("Erro", "Não foi possível criar a meta.");
    } finally {
        setCreating(false);
    }
  };

  // Helper para renderizar ícone de ranking
  const getRankingIcon = (index) => {
    if (index === 0) return 'trophy';
    if (index === 1) return 'medal';
    if (index === 2) return 'medal-outline';
    return 'numeric-' + (index + 1) + '-circle';
  };
  
  const getRankingColor = (index) => {
      if (index === 0) return '#FFD700'; // Ouro
      if (index === 1) return '#C0C0C0'; // Prata
      if (index === 2) return '#CD7F32'; // Bronze
      return theme.colors.placeholder;
  };

  return (
    <PaperProvider theme={theme}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        
        {/* SEU PROGRESSO (DADOS REAIS) */}
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
                <Title style={styles.statNumeroBranco}>{progressStats.active}</Title>
                <Paragraph style={styles.statLabelBranco}>Ativas</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumeroBranco}>{progressStats.completed}</Title>
                <Paragraph style={styles.statLabelBranco}>Concluídas</Paragraph>
              </View>
              <View style={styles.statItem}>
                <Title style={styles.statNumeroBranco}>{progressStats.points}</Title>
                <Paragraph style={styles.statLabelBranco}>Pontos</Paragraph>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* BOTÃO CRIAR NOVA META */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 100 }} style={styles.actionsContainer}>
            <MotiPressable 
              style={styles.actionButton}
              onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setModalVisible(true);
              }}
              animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })}
            >
                <List.Icon icon="plus-circle-outline" color="#FFF" />
                <Text style={styles.actionText}>Criar Nova Meta</Text>
            </MotiPressable>
        </MotiView>

        {/* LISTA DE METAS */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
          <Card style={styles.card} elevation={2}>
            <Card.Title title="Minhas Metas Recentes" titleStyle={styles.cardTitle} />
            <Card.Content>
              {myGoals.length === 0 ? (
                  <Text style={{textAlign: 'center', color: '#999', marginVertical: 10}}>Você não possui metas ativas.</Text>
              ) : (
                  myGoals.map((meta) => {
                    // Cálculo simples de progresso visual (mockado pois depende de leitura sensor vs data)
                    // No futuro, o backend retornará "consumo_atual" preenchido
                    const progresso = meta.status === 'atingida' ? 1 : 0.5; 
                    
                    return (
                        <View key={meta.id} style={styles.goalItem}>
                        <List.Icon icon="water-percent" color={theme.colors.primary} style={{ marginLeft: -10 }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.goalTitle}>
                                {meta.limite_consumo}L em {meta.periodo.replace('_', ' ')}
                            </Text>
                            <ProgressBar progress={progresso} color={meta.status === 'atingida' ? theme.colors.success : theme.colors.primary} style={styles.goalProgressBar} />
                        </View>
                        <Text style={[styles.goalStatus, { color: meta.status === 'atingida' ? theme.colors.success : theme.colors.placeholder }]}>
                            {meta.status === 'em_andamento' ? 'Ativa' : 'Fim'}
                        </Text>
                        </View>
                    );
                  })
              )}
            </Card.Content>
          </Card>
        </MotiView>
        
        {/* DESAFIO COLETIVO (DADOS REAIS) */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
          <Card style={styles.card} elevation={2}>
            <Card.Title title={communityChallenge.title || "Desafio da Comunidade"} subtitle="Meta coletiva do mês" titleStyle={styles.cardTitle} />
            <Card.Content>
              <Paragraph style={styles.challengeDescription}>
                  {communityChallenge.description || "Carregando desafio..."}
              </Paragraph>
              <View style={{ marginTop: 10 }}>
                <Text style={styles.goalText}>
                    Progresso: {Math.round((communityChallenge.progresso || 0) * 100)}%
                </Text>
                <ProgressBar progress={communityChallenge.progresso || 0} color={theme.colors.success} style={styles.goalProgressBar} />
              </View>
            </Card.Content>
          </Card>
        </MotiView>

        {/* RANKING (DADOS REAIS) */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 400 }}>
          <Card style={styles.card} elevation={2}>
            <Card.Title title="Ranking de Pontos" titleStyle={styles.cardTitle} />
            <Card.Content>
              {ranking.map((item, index) => (
                <List.Item
                  key={item.user_id}
                  title={item.User?.name || "Usuário"}
                  description={`${item.User?.residencia_type === 'casa' ? 'Casa' : 'Apto'} - ${index+1}º Lugar`}
                  left={() => <Avatar.Icon size={40} icon={getRankingIcon(index)} color={getRankingColor(index)} style={{backgroundColor: 'transparent'}} />}
                  right={() => <Text style={styles.rankingPoints}>{item.total_points} pts</Text>}
                />
              ))}
              {ranking.length === 0 && <Text style={{textAlign: 'center', color: '#999'}}>Sem dados de ranking.</Text>}
            </Card.Content>
          </Card>
        </MotiView>
      </ScrollView>

      {/* MODAL DE CRIAÇÃO */}
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <Title style={{marginBottom: 15, textAlign: 'center'}}>Nova Meta de Economia</Title>
            
            <Text style={{marginBottom: 5}}>Qual o limite de consumo?</Text>
            <TextInput 
                label="Litros (ex: 1500)" 
                mode="outlined" 
                keyboardType="numeric"
                value={newMetaLimit}
                onChangeText={setNewMetaLimit}
                style={{marginBottom: 15, backgroundColor: '#FFF'}}
            />

            <Text style={{marginBottom: 5}}>Por quanto tempo?</Text>
            <RadioButton.Group onValueChange={newValue => setNewMetaPeriod(newValue)} value={newMetaPeriod}>
                <View style={styles.radioRow}><RadioButton value="7 dias" /><Text>7 Dias</Text></View>
                <View style={styles.radioRow}><RadioButton value="14 dias" /><Text>14 Dias</Text></View>
                <View style={styles.radioRow}><RadioButton value="30_dias" /><Text>30 Dias</Text></View>
            </RadioButton.Group>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20}}>
                <Button onPress={() => setModalVisible(false)} style={{marginRight: 10}}>Cancelar</Button>
                <Button mode="contained" onPress={handleCreateMeta} loading={creating}>Criar Meta</Button>
            </View>
        </Modal>
      </Portal>

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
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness,
    paddingVertical: 12,
    elevation: 4,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    textTransform: 'capitalize'
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
  rankingPoints: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.gold,
  },
  modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      margin: 20,
      borderRadius: 16,
  },
  radioRow: {
      flexDirection: 'row',
      alignItems: 'center'
  }
});

export default MetasScreen;