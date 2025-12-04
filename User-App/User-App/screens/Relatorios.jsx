import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Surface, ActivityIndicator, IconButton, Avatar, ProgressBar } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
// Ajuste o IP se necessário (ex: http://192.168.X.X:3334/api)
const API_URL = 'http://localhost:3334/api';

const THEME = {
    primary: '#0A84FF',
    secondary: '#005ecb',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#1C1C1E',
    subtext: '#8E8E93',
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    money: '#30B0C7'
};

// --- LÓGICA DE PREÇO SABESP (CORRIGIDA) ---
const calculateSabespProjection = (avgLitersPerDay) => {
    const daysInMonth = 30;
    // Converte Litros p/ m³ (Ex: 500L/dia * 30 = 15.000L = 15m³)
    const totalM3 = (avgLitersPerDay * daysInMonth) / 1000; 

    let bill = 0;

    // Valores de referência (Tarifa Mista Água + Esgoto já somados)
    // Lógica Progressiva Acumulada:
    
    // Faixa 1: 0 a 10 m³ (Mínimo fixo)
    if (totalM3 <= 10) {
        bill = 71.70;
    } 
    // Faixa 2: 11 a 20 m³
    // Paga o fixo dos 10 primeiros + excedente * tarifa da faixa 2
    else if (totalM3 <= 20) {
        bill = 71.70 + ((totalM3 - 10) * 5.68); 
    } 
    // Faixa 3: 21 a 50 m³
    // Paga fixo faixa 1 + total da faixa 2 + excedente faixa 3
    else if (totalM3 <= 50) {
        bill = 71.70 + (10 * 5.68) + ((totalM3 - 20) * 14.14); 
    } 
    // Faixa 4: Acima de 50 m³
    // Soma tudo anterior + excedente faixa 4
    else {
        bill = 71.70 + (10 * 5.68) + (30 * 14.14) + ((totalM3 - 50) * 16.98);
    }
    
    return {
        bill: bill,
        volume: totalM3
    };
};

export default function Relatorios() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [metasHistory, setMetasHistory] = useState([]);
    const [timeframe, setTimeframe] = useState('semana');
    const [selectedBar, setSelectedBar] = useState(null);

    const fetchReportData = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;
            const headers = { Authorization: `Bearer ${token}` };

            // 1. Consumo Gráfico (Semanal)
            const respConsumo = await axios.get(`${API_URL}/user/me/consumo-semanal`, { headers });
            if (respConsumo.data) {
                const formatted = respConsumo.data.map(item => ({
                    value: Number(item.consumo),
                    label: item.data.split('/')[0], // Apenas o dia
                    frontColor: getBarColor(Number(item.consumo)),
                    gradientColor: getGradientColor(Number(item.consumo)),
                    topLabelComponent: () => (
                        <Text style={{ color: THEME.subtext, fontSize: 10, marginBottom: 4, fontWeight: 'bold' }}>
                            {Number(item.consumo).toFixed(0)}
                        </Text>
                    ),
                }));
                setChartData(formatted);
            }

            // 2. Histórico de Metas (Simulado via endpoint de listagem)
            const respMetas = await axios.get(`${API_URL}/metas?limit=5`, { headers });
            if (respMetas.data?.docs) {
                setMetasHistory(respMetas.data.docs);
            }

        } catch (error) {
            console.error("Erro ao buscar relatórios:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchReportData();
    }, [fetchReportData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchReportData();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // --- HELPERS VISUAIS ---
    const getBarColor = (val) => val > 200 ? THEME.danger : val > 150 ? THEME.warning : THEME.primary;
    const getGradientColor = (val) => val > 200 ? '#FF6B6B' : val > 150 ? '#FFD54F' : '#60efff';

    const statistics = useMemo(() => {
        if (!chartData.length) return { total: 0, avg: 0, max: 0, projection: { bill: 0, volume: 0 } };
        
        const values = chartData.map(d => d.value);
        const total = values.reduce((a, b) => a + b, 0);
        const avg = total / values.length;
        
        return {
            total,
            avg: Math.round(avg),
            max: Math.max(...values),
            // Passa a média diária para a projeção mensal
            projection: calculateSabespProjection(avg)
        };
    }, [chartData]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={THEME.primary} />
                <Text style={{ marginTop: 10, color: THEME.subtext }}>Calculando projeções...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={[THEME.primary, '#F2F2F7']} style={styles.headerBackground} />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff"/>}
            >
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing' }}>
                    <Text style={styles.pageTitle}>Inteligência</Text>
                    <Text style={styles.pageSubtitle}>Relatórios e Projeções</Text>
                </MotiView>

                {/* === SEÇÃO DE PROJEÇÃO FINANCEIRA === */}
                <MotiView from={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 100 }}>
                    <Surface style={styles.projectionCard} elevation={4}>
                        <LinearGradient
                            colors={['#30B0C7', '#0083B0']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.projectionGradient}
                        >
                            <View style={styles.projectionRow}>
                                <View>
                                    <Text style={styles.projLabel}>Fatura Estimada (Fim do Mês)</Text>
                                    <Text style={styles.projValue}>
                                        R$ {statistics.projection.bill.toFixed(2).replace('.', ',')}
                                    </Text>
                                    <Text style={styles.projSub}>Estimativa SABESP (Água + Esgoto)</Text>
                                </View>
                                <View style={styles.iconCircle}>
                                    <IconButton icon="cash-multiple" iconColor="#FFF" size={28} />
                                </View>
                            </View>

                            <View style={styles.projDivider} />

                            <View style={styles.projDetailsRow}>
                                <View style={styles.projDetailItem}>
                                    <Text style={styles.projDetailLabel}>Volume Est.</Text>
                                    <Text style={styles.projDetailValue}>{statistics.projection.volume.toFixed(1)} m³</Text>
                                </View>
                                <View style={styles.verticalLine} />
                                <View style={styles.projDetailItem}>
                                    <Text style={styles.projDetailLabel}>Média Diária</Text>
                                    <Text style={styles.projDetailValue}>{statistics.avg} L</Text>
                                </View>
                                <View style={styles.verticalLine} />
                                <View style={styles.projDetailItem}>
                                    <Text style={styles.projDetailLabel}>Status</Text>
                                    <Text style={[styles.projDetailValue, { color: '#FFF', fontWeight:'bold' }]}>
                                        {statistics.projection.volume <= 10 ? 'Mínimo' : 'Excedente'}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </Surface>
                </MotiView>

                {/* === GRÁFICO DE BARRAS === */}
                <View style={styles.sectionSpacer}>
                    <Text style={styles.sectionHeader}>Consumo Semanal</Text>
                </View>

                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
                    <Surface style={styles.chartCard} elevation={2}>
                        {chartData.length > 0 ? (
                            <BarChart
                                data={chartData}
                                barWidth={22}
                                spacing={20}
                                roundedTop
                                hideRules
                                xAxisThickness={0}
                                yAxisThickness={0}
                                yAxisTextStyle={{ color: THEME.subtext, fontSize: 10 }}
                                noOfSections={3}
                                maxValue={statistics.max * 1.2 || 100}
                                isAnimated
                                showGradient
                                animationDuration={800}
                                renderTooltip={(item) => (
                                    <View style={styles.tooltip}>
                                        <Text style={styles.tooltipText}>{item.value} L</Text>
                                    </View>
                                )}
                                leftShiftForTooltip={5}
                                autoCenterTooltip
                            />
                        ) : (
                            <Text style={styles.emptyText}>Sem dados recentes para exibir.</Text>
                        )}
                    </Surface>
                </MotiView>

                {/* === HISTÓRICO DE METAS (GAMIFICAÇÃO) === */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
                    <Text style={styles.sectionHeader}>Histórico de Metas</Text>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, overflow: 'visible' }}>
                        {metasHistory.length > 0 ? metasHistory.map((meta, index) => {
                            const isSuccess = meta.status === 'atingida';
                            const isFail = meta.status === 'excedida';
                            const isActive = meta.status === 'em_andamento';

                            let statusColor = THEME.primary;
                            let icon = 'progress-clock';
                            
                            if (isSuccess) { statusColor = THEME.success; icon = 'trophy'; }
                            if (isFail) { statusColor = THEME.danger; icon = 'alert-circle'; }

                            // Cálculo do progresso (evita divisão por zero)
                            const limite = Number(meta.limite_consumo) || 1;
                            const atual = Number(meta.consumo_atual) || 0;
                            const progresso = Math.min(atual / limite, 1);

                            return (
                                <Surface key={meta.id} style={[styles.historyCard, { marginLeft: index === 0 ? 0 : 12 }]} elevation={2}>
                                    <View style={[styles.historyIcon, { backgroundColor: statusColor + '20' }]}>
                                        <IconButton icon={icon} iconColor={statusColor} size={20} style={{margin:0}} />
                                    </View>
                                    <Text style={styles.historyLabel} numberOfLines={1}>{meta.periodo}</Text>
                                    <Text style={[styles.historyStatus, { color: statusColor }]}>
                                        {isActive ? 'Ativa' : isSuccess ? 'Conquista' : 'Excedeu'}
                                    </Text>
                                    <View style={styles.miniProgress}>
                                        <ProgressBar 
                                            progress={progresso} 
                                            color={statusColor} 
                                            style={{height: 4, borderRadius: 2}} 
                                        />
                                    </View>
                                </Surface>
                            );
                        }) : (
                            <View style={styles.emptyHistory}>
                                <Text style={{color: THEME.subtext}}>Nenhuma meta registrada no histórico.</Text>
                            </View>
                        )}
                        <View style={{width: 20}}/>
                    </ScrollView>
                </MotiView>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 140,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    pageSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 20,
    },
    
    // PROJECTION CARD
    projectionCard: {
        borderRadius: 24,
        marginBottom: 24,
        overflow: 'hidden',
    },
    projectionGradient: {
        padding: 20,
    },
    projectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    projLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    projValue: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    projSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        marginTop: 2,
    },
    iconCircle: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    projDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 16,
    },
    projDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projDetailItem: {
        alignItems: 'center',
        flex: 1,
    },
    projDetailLabel: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        marginBottom: 2,
    },
    projDetailValue: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    verticalLine: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },

    // CHART SECTION
    sectionSpacer: {
        marginBottom: 12,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: THEME.text,
    },
    chartCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        paddingBottom: 24,
        marginBottom: 24,
        alignItems: 'center',
    },
    tooltip: {
        backgroundColor: '#1C1C1E',
        padding: 6,
        borderRadius: 6,
    },
    tooltipText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    emptyText: {
        color: THEME.subtext,
        padding: 20,
    },

    // HISTORY SECTION
    historyCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        width: 110,
        marginRight: 4,
        marginBottom: 10, // shadow space
    },
    historyIcon: {
        alignSelf: 'flex-start',
        borderRadius: 10,
        marginBottom: 8,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    historyLabel: {
        fontSize: 12,
        color: THEME.text,
        fontWeight: '600',
        marginBottom: 2,
    },
    historyStatus: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    miniProgress: {
        width: '100%',
    },
    emptyHistory: {
        padding: 10,
    }
});

