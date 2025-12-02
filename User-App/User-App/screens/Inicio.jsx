import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import { 
  Provider as PaperProvider, 
  Text, 
  Surface,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3334/api';

const theme = {
  colors: { 
    primary: '#0A84FF', 
    background: '#F5F7FA',
    surface: '#FFFFFF', 
    text: '#1C1C1E', 
    success: '#34C759', 
    danger: '#FF3B30', 
    warning: '#FF9500', 
  },
};

export default function Inicio() {
  const [isLoading, setIsLoading] = useState(true);
  const [consumptionData, setConsumptionData] = useState({ 
    todayConsumption: 0, 
    yesterdayConsumption: 0, 
    comparison: 0 
  });
  const [dailyGoal, setDailyGoal] = useState(200);
  const [dicaDoPingo, setDicaDoPingo] = useState("Economize água!");

  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);

    try {
      const authToken = await AsyncStorage.getItem('token');
      const userDataString = await AsyncStorage.getItem('user');

      if (!authToken || !userDataString) return;
      
      const user = JSON.parse(userDataString);

      if (!user.residencia_id) return;

      const headers = { 'Authorization': `Bearer ${authToken}` };
      const residenciaEndpoint = user.residencia_type === 'apartamento' ? 'apartamentos' : 'casas';
      const consumoUrl = `${API_URL}/${residenciaEndpoint}/${user.residencia_id}/consumo-total`;

      const [consumoResponse, metasResponse, dicaResponse] = await Promise.all([
        axios.get(consumoUrl, { headers }),
        axios.get(`${API_URL}/metas`, { headers }),
        axios.get(`${API_URL}/dica`, { headers }),
      ]);
      
      const consumoResult = consumoResponse.data;
      if (consumoResult) {
        setConsumptionData({
          todayConsumption: Number(consumoResult.consumoHoje) || 0,
          yesterdayConsumption: Number(consumoResult.consumoOntem) || 0, 
          comparison: Number(consumoResult.comparacaoPorcentagem) || 0,
        });
      }

      const metas = metasResponse.data?.docs || [];
      const metaPrincipal = metas.find(m => m.is_principal);
      
      if (metaPrincipal) {
        setDailyGoal(parseFloat(metaPrincipal.limite_consumo));
      } else if (metas.length > 0) {
        setDailyGoal(parseFloat(metas[0].limite_consumo));
      } else {
        setDailyGoal(200);
      }
      
      if (dicaResponse.data?.dica) {
        setDicaDoPingo(dicaResponse.data.dica);
      }

    } catch (err) {
      console.error("Erro Dashboard:", err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData(false);

    const intervalId = setInterval(() => {
        loadDashboardData(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loadDashboardData]);

  const percentageUsed = useMemo(() => {
      if(dailyGoal <= 0) return 0;
      return (consumptionData.todayConsumption / dailyGoal) * 100;
  }, [consumptionData.todayConsumption, dailyGoal]);

  const statusColor = percentageUsed > 100 ? '#FF3B30' : percentageUsed > 75 ? '#FF9500' : '#34C759';
  const statusIcon = percentageUsed > 100 ? 'alert-circle' : percentageUsed > 75 ? 'water-alert' : 'leaf';
  
  const getNivelConsumo = () => {
      if (percentageUsed > 100) return "Crítico";
      if (percentageUsed > 80) return "Alto";
      if (percentageUsed > 50) return "Moderado";
      return "Econômico";
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <PaperProvider>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        
        <MotiView 
            from={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ type: 'spring' }}
            style={styles.heroContainer}
        >
            <LinearGradient
                colors={percentageUsed > 100 ? ['#FF3B30', '#FF9500'] : ['#0061ff', '#60efff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
            >
                <View style={styles.heroHeader}>
                    <View style={styles.heroIconBox}>
                        <MaterialCommunityIcons name="water" size={24} color="#FFF" />
                    </View>
                    <View style={styles.heroTag}>
                        <Text style={styles.heroTagText}>{percentageUsed.toFixed(0)}% da Meta</Text>
                    </View>
                </View>

                <View style={styles.heroContent}>
                    <Text style={styles.heroLabel}>Consumo Hoje</Text>
                    <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                        <Text style={styles.heroValue}>{consumptionData.todayConsumption.toFixed(0)}</Text>
                        <Text style={styles.heroUnit}>Litros</Text>
                    </View>
                </View>
                
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${Math.min(percentageUsed, 100)}%`, backgroundColor: '#FFF' }]} />
                </View>
                
                <Text style={styles.heroFooter}>Meta: {dailyGoal} L</Text>
            </LinearGradient>
        </MotiView>

        <View style={styles.gridContainer}>
            
            <MotiView from={{ translateX: -20, opacity: 0 }} animate={{ translateX: 0, opacity: 1 }} transition={{ delay: 100 }} style={styles.gridItem}>
                <Surface style={styles.statCard} elevation={2}>
                    <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                        <MaterialCommunityIcons name="history" size={22} color="#0A84FF" />
                    </View>
                    <Text style={styles.statLabel}>Ontem</Text>
                    <Text style={styles.statValue}>{consumptionData.yesterdayConsumption.toFixed(0)} L</Text>
                    
                    <View style={styles.trendContainer}>
                        <MaterialCommunityIcons 
                            name={consumptionData.comparison > 0 ? "arrow-up" : "arrow-down"} 
                            size={16} 
                            color={consumptionData.comparison > 0 ? '#FF3B30' : '#34C759'} 
                        />
                        <Text style={[styles.statSub, { color: consumptionData.comparison > 0 ? '#FF3B30' : '#34C759' }]}>
                            {Math.abs(consumptionData.comparison).toFixed(0)}%
                        </Text>
                    </View>
                </Surface>
            </MotiView>

            <MotiView from={{ translateX: 20, opacity: 0 }} animate={{ translateX: 0, opacity: 1 }} transition={{ delay: 200 }} style={styles.gridItem}>
                <Surface style={styles.statCard} elevation={2}>
                    <View style={[styles.iconCircle, { backgroundColor: statusColor + '20' }]}>
                        <MaterialCommunityIcons name={statusIcon} size={22} color={statusColor} />
                    </View>
                    <Text style={styles.statLabel}>Nível</Text>
                    <Text style={[styles.statValue, { color: statusColor, fontSize: 18 }]}>{getNivelConsumo()}</Text>
                    <Text style={styles.statSub}>Eficiência</Text>
                </Surface>
            </MotiView>
        </View>

        <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ delay: 300 }}>
            <Surface style={styles.infoRowCard} elevation={1}>
                <View style={styles.infoRowLeft}>
                    <View style={[styles.iconCircle, {backgroundColor: '#F3E5F5', marginRight: 15}]}>
                        <MaterialCommunityIcons name="target" size={24} color="#9C27B0" />
                    </View>
                    <View>
                        <Text style={styles.infoRowTitle}>Restante</Text>
                        <Text style={styles.infoRowSubtitle}>Disponível na meta</Text>
                    </View>
                </View>
                <Text style={[styles.infoRowValue, { color: (dailyGoal - consumptionData.todayConsumption) < 0 ? '#FF3B30' : '#9C27B0' }]}>
                    {Math.max(0, dailyGoal - consumptionData.todayConsumption).toFixed(0)} L
                </Text>
            </Surface>
        </MotiView>

        <MotiView from={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 400 }} style={styles.tipContainer}>
            <View style={styles.mascotContainer}>
                <View style={styles.mascotCircle}>
                    <MaterialCommunityIcons name="water-outline" size={28} color="#FFF" />
                </View>
            </View>
            <View style={styles.tipBubble}>
                <Text style={styles.tipTitle}>Dica do Dia</Text>
                <Text style={styles.tipText}>{dicaDoPingo}</Text>
            </View>
        </MotiView>

        <View style={{height: 30}} />
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10, 
    paddingBottom: 40,
  },
  heroContainer: {
    shadowColor: "#0A84FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    height: 190,
    justifyContent: 'space-between',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroIconBox: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 12,
      padding: 6
  },
  heroTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroTagText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 11,
  },
  heroContent: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  heroLabel: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: 14,
      marginBottom: 0
  },
  heroValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -1,
  },
  heroUnit: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginLeft: 6,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 3,
    marginTop: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  heroFooter: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'flex-start',
    height: 130,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  iconCircle: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#8A8A8E',
    fontWeight: '600',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statSub: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 2
  },
  trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2
  },
  infoRowCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  infoRowSubtitle: {
    fontSize: 12,
    color: '#8A8A8E',
  },
  infoRowValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 5,
  },
  mascotContainer: {
    marginRight: 10,
    marginBottom: 5,
  },
  mascotCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipBubble: {
    flex: 1,
    backgroundColor: '#FFF', 
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0A84FF',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
});