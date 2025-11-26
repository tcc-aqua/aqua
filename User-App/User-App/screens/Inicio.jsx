import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, RefreshControl, StatusBar } from 'react-native';
import { 
  Provider as PaperProvider, 
  DefaultTheme, 
  Card, 
  Text, 
  Title, 
  Surface,
  ProgressBar,
  Avatar,
  IconButton
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-gifted-charts';
import { MotiView } from 'moti';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const API_URL = 'http://localhost:3334/api'; 
const { width: screenWidth } = Dimensions.get('window');

const theme = {
  ...DefaultTheme,
  roundness: 20,
  colors: { 
    ...DefaultTheme.colors, 
    primary: '#0A84FF', 
    background: '#F5F7FA', 
    surface: '#FFFFFF', 
    text: '#1C1C1E', 
    success: '#34C759', 
    warning: '#FF9500', 
    error: '#FF3B30',
  },
};

export default function Inicio({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('Usuário');
  
  // Dados
  const [consumoHoje, setConsumoHoje] = useState(0);
  const [metaDiaria, setMetaDiaria] = useState(0); 
  const [metaTotal, setMetaTotal] = useState(0); 
  const [dicaDoDia, setDicaDoDia] = useState("Carregando dica...");
  const [loading, setLoading] = useState(true);

  // Dados para o gráfico (pode ser substituído por dados reais futuramente)
  const chartData = [
    { value: 10, label: '0h' }, 
    { value: 12, label: '4h' }, 
    { value: 25, label: '8h' }, 
    { value: 30, label: '12h' }, 
    { value: consumoHoje > 30 ? consumoHoje : 35, label: 'Agora' }
  ];

  const loadDashboardData = useCallback(async () => {
    try {
      const authToken = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('user');
      if (!authToken || !userDataString) return;

      const user = JSON.parse(userDataString);
      setUserName(user.name.split(' ')[0]);

      const headers = { 'Authorization': `Bearer ${authToken}` };
      const endpointResidencia = user.residencia_type === 'apartamento' ? 'apartamentos' : 'casas';
      
      // 1. Busca Dica (Prioridade Visual)
      axios.get(`${API_URL}/dica`, { headers }).then(res => {
         if (res.data?.dica) setDicaDoDia(res.data.dica);
      }).catch(err => console.log("Erro dica", err));

      // 2. Busca Consumo
      const resConsumo = await axios.get(`${API_URL}/${endpointResidencia}/${user.residencia_id}/consumo-total`, { headers });
      const atual = parseFloat(resConsumo.data.consumoHoje || 0);
      setConsumoHoje(atual);

      // 3. Busca Meta Ativa para calcular a média diária
      const resMetas = await axios.get(`${API_URL}/metas`, { headers });
      if (resMetas.data?.docs?.length > 0) {
          // Pega a meta mais recente
          const metaAtiva = resMetas.data.docs[0];
          
          if (metaAtiva.status === 'em_andamento') {
             const limiteTotal = parseFloat(metaAtiva.limite_consumo);
             let divisor = 1;
             
             if (metaAtiva.periodo === '30_dias' || metaAtiva.periodo === '30 dias') divisor = 30;
             else if (metaAtiva.periodo === '14 dias') divisor = 14;
             else if (metaAtiva.periodo === '7 dias') divisor = 7;

             setMetaTotal(limiteTotal);
             setMetaDiaria(limiteTotal / divisor);
          } else {
             // Se a última meta já acabou, define 0 ou um padrão
             setMetaDiaria(0); 
          }
      } else {
          setMetaDiaria(0); // Sem metas
      }

    } catch (error) {
      console.error("Erro dashboard:", error);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboardData(); }, [loadDashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Lógica de visualização
  const temMeta = metaDiaria > 0;
  const progresso = temMeta ? Math.min(consumoHoje / metaDiaria, 1) : 0;
  const restante = temMeta ? Math.max(metaDiaria - consumoHoje, 0) : 0;
  
  // Cor dinâmica
  let statusColor = '#4CAF50'; // Verde
  if (progresso > 0.7) statusColor = '#FFC107'; // Amarelo
  if (progresso >= 1) statusColor = '#FF5252'; // Vermelho

  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View style={styles.container}>
        


        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          
          {/* 1. DICA DO PINGO (NO TOPO) */}
          <MotiView from={{ opacity: 0, translateY: -10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ duration: 600 }}>
             <Surface style={styles.tipCard} elevation={2}>
                <View style={styles.tipIconContainer}>
                    <Avatar.Icon size={40} icon="water-outline" color="#FFF" style={{backgroundColor: theme.colors.primary}} />
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.tipTitle}>Dica do Dia</Text>
                    <Text style={styles.tipText} numberOfLines={3}>{dicaDoDia}</Text>
                </View>
             </Surface>
          </MotiView>

          {/* 2. CARD PRINCIPAL (CONSUMO HOJE) */}
          <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 100, duration: 500 }}>
            <LinearGradient
                colors={['#7c8df0ff', '#1e1bf1ff']}
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
                style={styles.mainCard}
            >
                <View style={styles.mainCardTop}>
                    <View>
                        <Text style={styles.mainLabel}>Consumo Hoje</Text>
                        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                             <Text style={styles.mainValue}>{consumoHoje.toFixed(0)}</Text>
                             <Text style={styles.mainUnit}> Litros</Text>
                        </View>
                    </View>
                    <View style={styles.percentBadge}>
                         <Text style={styles.percentText}>
                            {temMeta ? `${Math.round(progresso * 100)}%` : '--%'}
                         </Text>
                    </View>
                </View>

                {temMeta ? (
                    <View>
                        <View style={styles.progressLabelRow}>
                            <Text style={styles.progressLabel}>Meta diária: {metaDiaria.toFixed(0)} L</Text>
                            <Text style={styles.progressLabel}>{restante.toFixed(0)} L restantes</Text>
                        </View>
                        <ProgressBar progress={progresso} color={progresso >= 1 ? '#FF5252' : '#FFF'} style={styles.progressBar} />
                    </View>
                ) : (
                    <Text style={styles.noMetaText}>Sem meta ativa. Crie uma na aba Metas!</Text>
                )}
            </LinearGradient>
          </MotiView>

          {/* 3. GRÁFICO (CLEAN) */}
          <MotiView delay={200} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}>
             <Text style={styles.sectionTitle}>Tendência de Consumo</Text>
             <Card style={styles.chartCard}>
                <Card.Content>
                    <LineChart 
                        data={chartData}
                        height={160}
                        width={screenWidth - 70}
                        color={theme.colors.primary}
                        thickness={3}
                        curved
                        hideDataPoints={false}
                        dataPointsColor={theme.colors.primary}
                        startFillColor={theme.colors.primary}
                        endFillColor="#FFFFFF"
                        startOpacity={0.2}
                        endOpacity={0.0}
                        areaChart
                        yAxisThickness={0}
                        xAxisThickness={0}
                        hideRules
                        hideYAxisText
                        xAxisLabelTextStyle={{color: '#999', fontSize: 10}}
                    />
                </Card.Content>
             </Card>
          </MotiView>

          {/* 4. ATALHOS / RESUMO */}
          <View style={styles.row}>
             <Surface style={[styles.statBox, {borderLeftColor: theme.colors.success}]}>
                 <Text style={styles.statLabel}>Economia (Mês)</Text>
                 <Text style={styles.statValue}>1.2k L</Text> 
                 {/* Valor mockado ou vindo de endpoint futuro */}
             </Surface>
             <View style={{width: 10}} />
             <Surface style={[styles.statBox, {borderLeftColor: theme.colors.warning}]}>
                 <Text style={styles.statLabel}>Meta Total</Text>
                 <Text style={styles.statValue}>{temMeta ? `${metaTotal.toFixed(0)} L` : 'N/A'}</Text>
             </Surface>
          </View>

        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F7FA' },
  dateText: { fontSize: 12, textTransform: 'uppercase', color: '#8A8A8E', fontWeight: '600' },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  // Dica do Pingo
  tipCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 15, marginBottom: 20 },
  tipIconContainer: { marginRight: 15 },
  tipTitle: { fontSize: 14, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 2 },
  tipText: { fontSize: 13, color: '#555', lineHeight: 18 },

  // Card Principal
  mainCard: { borderRadius: 24, padding: 25, marginBottom: 25, elevation: 5 },
  mainCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  mainLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 5 },
  mainValue: { color: '#FFF', fontSize: 42, fontWeight: 'bold' },
  mainUnit: { color: 'rgba(255,255,255,0.9)', fontSize: 18, paddingBottom: 6 },
  percentBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  percentText: { color: '#FFF', fontWeight: 'bold' },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  progressBar: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  noMetaText: { color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', fontSize: 13 },

  // Gráfico e Stats
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, marginLeft: 5 },
  chartCard: { borderRadius: 16, backgroundColor: '#FFF', elevation: 2, marginBottom: 20 },
  row: { flexDirection: 'row' },
  statBox: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 15, elevation: 2, borderLeftWidth: 4 },
  statLabel: { fontSize: 12, color: '#888', marginBottom: 5 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});