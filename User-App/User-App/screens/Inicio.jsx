import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { 
  Provider as PaperProvider, 
  DefaultTheme, 
  Card, 
  Text, 
  SegmentedButtons, 
  Title, 
  Paragraph, 
  List,
  Surface,
  ProgressBar,
  Button
} from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import 'react-native-svg';
import { MotiView, MotiText } from 'moti';
import { MotiPressable } from 'moti/interactions';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3334/api';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 80;

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
    cardBlue: '#E3F2FD', 
    cardGreen: '#E8F5E9' 
  },
};

const mockChartData = {
    hoje: [ { value: 10, label: '0h' }, { value: 12, label: '3h' }, { value: 20, label: '6h' }, { value: 18, label: '9h' }, { value: 25, label: '12h' }, { value: 15.7, label: 'Agora', dataPointText: '15.7' } ],
    semana: [ { value: 110, label: 'Seg' }, { value: 105, label: 'Ter' }, { value: 120, label: 'Qua' }, { value: 115, label: 'Qui' }, { value: 95, label: 'Sex' }, { value: 90, label: 'Sáb' }, { value: 89, label: 'Dom', dataPointText: '89' } ],
    mes: [ { value: 800, label: 'S1' }, { value: 750, label: 'S2' }, { value: 820, label: 'S3' }, { value: 790, label: 'S4', dataPointText: '790' } ]
};
const mockRecentHistory = [
    { id: '1', icon: 'shower-head', description: 'Banho (Ducha Principal)', time: '14:32', value: '-25 L', type: 'expense' },
    { id: '2', icon: 'alert-decagram', description: 'Pequeno vazamento detectado', time: '12:15', value: 'Verificar', type: 'alert' },
    { id: '3', icon: 'leaf-circle', description: 'Meta de economia diária', time: '08:00', value: '+5 L', type: 'saving' },
];

export default function Inicio() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [consumptionData, setConsumptionData] = useState({ todayConsumption: 0, todaySavings: 0, comparison: 0 });
  const [dailyGoal, setDailyGoal] = useState(200);
  const [chartData, setChartData] = useState(mockChartData);
  const [recentHistory, setRecentHistory] = useState(mockRecentHistory);
  const [dicaDoPingo, setDicaDoPingo] = useState("Carregando dica...");
  const [filter, setFilter] = useState('hoje');

  const loadDashboardData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) {
      setIsLoading(true);
    }
    // Não definimos o erro como nulo aqui para que a mensagem de erro permaneça visível até que uma atualização bem-sucedida ocorra.

    try {
      const authToken = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('user');

      if (!authToken || !userDataString) {
        throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
      }
      
      const user = JSON.parse(userDataString);
      if (!user || !user.residencia_id || !user.residencia_type) {
        throw new Error("Dados da residência do usuário estão incompletos. Tente fazer login de novo.");
      }

      const headers = { 'Authorization': `Bearer ${authToken}` };
      const residenciaEndpoint = user.residencia_type === 'apartamento' ? 'apartamentos' : 'casas';
      const consumoUrl = `${API_URL}/${residenciaEndpoint}/${user.residencia_id}/consumo-total`;

      const [consumoResponse, metasResponse, dicaResponse] = await Promise.all([
        axios.get(consumoUrl, { headers }),
        axios.get(`${API_URL}/metas`, { headers }),
        axios.get(`${API_URL}/dica`, { headers }),
      ]);
      
      // Se as chamadas foram bem-sucedidas, limpamos qualquer erro anterior.
      setError(null);

      const consumoResult = consumoResponse.data;
      if (consumoResult && typeof consumoResult.consumoTotal !== 'undefined') {
        setConsumptionData(prev => ({
          ...prev,
          todayConsumption: parseFloat(consumoResult.consumoTotal) || 0,
        }));
      }

      const metasResult = metasResponse.data;
      if (metasResult?.docs?.length > 0) {
        setDailyGoal(parseFloat(metasResult.docs[0].limite_consumo));
      }
      
      const dicaResult = dicaResponse.data;
      if (dicaResult?.dica) {
        setDicaDoPingo(dicaResult.dica);
      }

    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || "Erro desconhecido ao carregar dados.";
      setError(errorMessage);
      console.error("Erro em loadDashboardData:", errorMessage);
    } finally {
      // Garante que o spinner de carregamento inicial seja desativado.
      if (!isRefresh) {
        setIsLoading(false);
      }
      // Garante que o indicador de "puxar para atualizar" seja desativado.
      setRefreshing(false);
    }
  }, []);

  // Efeito para a carga inicial dos dados
  useEffect(() => {
    loadDashboardData(false);
  }, [loadDashboardData]);


  useEffect(() => {
    const intervalId = setInterval(() => {
      loadDashboardData(true);
    }, 2000); 
    return () => clearInterval(intervalId);
  }, [loadDashboardData]);


  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData(true);
  };
  
  const comparisonColor = useMemo(() => (consumptionData.comparison <= 0 ? theme.colors.success : theme.colors.danger), [consumptionData.comparison]);
  const comparisonText = useMemo(() => { if (consumptionData.comparison == null) return ''; return consumptionData.comparison <= 0 ? `${consumptionData.comparison}% em relação a ontem` : `+${consumptionData.comparison}% em relação a ontem`; }, [consumptionData.comparison]);
  const consumptionProgress = useMemo(() => (dailyGoal > 0 ? Math.min(consumptionData.todayConsumption / dailyGoal, 1) : 0), [consumptionData.todayConsumption, dailyGoal]);

  const handleFilterChange = (newFilter) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilter(newFilter);
  };
  
  if (isLoading && !refreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  if (error && !isLoading) {
     return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Title style={{ textAlign: 'center' }}>Ocorreu um erro</Title>
        <Paragraph style={{textAlign: 'center'}}>{error}</Paragraph>
        <Button onPress={onRefresh} style={{marginTop: 10}}>Tentar Novamente</Button>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
          <>
            <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 500 }}>
              <Card style={styles.card} elevation={4}>
                  <Card.Content>
                    <View style={styles.dailyCardHeader}>
                      <Title style={styles.dailyCardTitle}>Resumo de Hoje</Title>
                      <MotiText from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 300 }} style={[styles.comparisonText, { color: comparisonColor }]}>
                        {comparisonText}
                      </MotiText>
                    </View>

                    <View style={styles.innerCardsContainer}>
                      <Surface style={[styles.innerCard, { backgroundColor: theme.colors.cardBlue }]}>
                        <List.Icon icon="water-outline" color={theme.colors.primary} style={styles.innerCardIcon} />
                        <View>
                          <MotiText style={styles.innerCardValue}>{consumptionData.todayConsumption.toFixed(1)} L</MotiText>
                          <Text style={styles.innerCardLabel}>Consumido</Text>
                        </View>
                      </Surface>
                      <Surface style={[styles.innerCard, { backgroundColor: theme.colors.cardGreen }]}>
                        <List.Icon icon="leaf-circle-outline" color={theme.colors.success} style={styles.innerCardIcon}/>
                        <View>
                          <MotiText style={styles.innerCardValue}>{consumptionData.todaySavings.toFixed(1)} L</MotiText>
                          <Text style={styles.innerCardLabel}>Economizado</Text>
                        </View>
                      </Surface>
                    </View>
                    
                    <View style={styles.goalContainer}>
                      <Text style={styles.goalText}>Meta Diária: {consumptionData.todayConsumption.toFixed(0)}L / {dailyGoal.toFixed(0)}L</Text>
                      <ProgressBar progress={consumptionProgress} color={theme.colors.primary} style={styles.progressBar} />
                    </View>

                    <View style={styles.insightContainer}>
                        <List.Icon icon="lightbulb-on-outline" color={theme.colors.warning} style={styles.innerCardIcon} />
                        <Paragraph style={styles.insightText}>
                            <Text style={{fontWeight: 'bold'}}>Dica do Pingo:</Text> {dicaDoPingo}
                        </Paragraph>
                    </View>
                  </Card.Content>
              </Card>
            </MotiView>
            
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 150 }}>
              <Card style={styles.card} elevation={2}>
                <Card.Content>
                  <SegmentedButtons value={filter} onValueChange={handleFilterChange} style={styles.filterButtons} buttons={[ { value: 'hoje', label: 'Hoje' }, { value: 'semana', label: '7d' }, { value: 'mes', label: '30d' }, ]} />
                  <MotiView key={filter} from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 300 }}>
                    <LineChart 
                      data={chartData[filter]}
                      width={chartWidth}
                      height={180}
                      color1={theme.colors.primary} 
                      dataPointsColor1={theme.colors.primary} 
                      thickness1={3} 
                      curved
                      yAxisTextStyle={{ color: theme.colors.placeholder, fontSize: 10 }} 
                      xAxisLabelTextStyle={{ color: theme.colors.placeholder, fontSize: 10, paddingTop: 5 }} 
                      startFillColor1={theme.colors.primary} 
                      endFillColor1={theme.colors.background}
                      areaChart
                      initialSpacing={15}
                      endSpacing={15}
                      noOfSections={4}
                      yAxisThickness={0}
                      rulesType="dashed"
                      rulesColor="#EAEAEA"
                      pointerConfig={{
                        pointerStripHeight: 160,
                        pointerStripColor: theme.colors.primary,
                        pointerStripWidth: 2,
                        pointerColor: theme.colors.primary,
                        radius: 6,
                        pointerLabelWidth: 100,
                        pointerLabelHeight: 90,
                        activatePointersOnLongPress: true,
                        autoAdjustPointerLabelPosition: true,
                        pointerLabelComponent: items => (
                          <View style={styles.pointerLabel}>
                            <Text style={styles.pointerLabelValue}>{items[0].value} L</Text>
                            <Text style={styles.pointerLabelDate}>{items[0].label}</Text>
                          </View>
                        ),
                      }}
                    />
                  </MotiView>
                </Card.Content>
              </Card>
            </MotiView>
            
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 300 }} style={styles.actionsContainer}>
                <MotiPressable animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })} style={styles.actionButton} onPress={() => console.log('Relatórios')}>
                    <List.Icon icon="file-chart-outline" color={theme.colors.primary} />
                    <Text style={styles.actionText}>Ver Relatórios</Text>
                </MotiPressable>
                <MotiPressable animate={({ pressed }) => ({ scale: pressed ? 0.95 : 1 })} style={styles.actionButton} onPress={() => console.log('Metas')}>
                    <List.Icon icon="bullseye-arrow" color={theme.colors.success} />
                    <Text style={styles.actionText}>Ajustar Metas</Text>
                </MotiPressable>
            </MotiView>
            
            <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 450 }}>
              <Card style={styles.card} elevation={2}>
                <Card.Content>
                  <Title>Histórico Recente</Title>
                  {recentHistory.map((item, index) => {
                    const itemColor = item.type === 'expense' ? theme.colors.danger : 
                                      item.type === 'saving' ? theme.colors.success : 
                                      theme.colors.warning;
                    return (
                      <MotiView key={item.id} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', delay: 100 + index * 100 }}>
                        <List.Item 
                          title={item.description} 
                          description={item.time} 
                          titleNumberOfLines={1} 
                          left={props => <List.Icon {...props} icon={item.icon} color={itemColor} />} 
                          right={() => <Text style={[styles.historyValue, { color: itemColor }]}>{item.value}</Text>} 
                          style={[styles.listItem, index === 0 && styles.firstListItem]} 
                        />
                      </MotiView>
                    )
                  })}
                </Card.Content>
              </Card>
            </MotiView>
          </>
      </ScrollView>
    </PaperProvider>
  );
}

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
  dailyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dailyCardTitle: {
    fontWeight: 'bold',
  },
  comparisonText: { 
    fontSize: 14, 
    fontWeight: '600',
  },
  innerCardsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 12,
  },
  innerCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: theme.roundness, 
    flex: 1,
  },
  innerCardIcon: {
    marginRight: 8,
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
  },
  innerCardValue: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  innerCardLabel: { 
    fontSize: 13, 
    color: theme.colors.placeholder,
  },
  goalContainer: {
    marginTop: 20,
  },
  goalText: {
    marginBottom: 8,
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  insightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFBE6',
      borderRadius: theme.roundness,
      padding: 12,
      marginTop: 20,
  },
  insightText: {
      flex: 1,
      fontSize: 14,
      color: '#B26E00',
      lineHeight: 20,
  },
  filterButtons: { 
    marginBottom: 16,
  },
  pointerLabel: {
    height: 60,
    width: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  pointerLabelValue: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  pointerLabelDate: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.placeholder,
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
      paddingVertical: 12,
      elevation: 2,
  },
  actionText: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.text,
  },
  listItem: {
      paddingLeft: 0,
  },
  firstListItem: {
      borderTopWidth: 1, 
      borderTopColor: '#F0F0F0', 
      paddingTop: 16, 
      marginTop: 10,
  },
  historyValue: {
      fontWeight: 'bold', 
      alignSelf: 'center',
      fontSize: 15,
  },
});