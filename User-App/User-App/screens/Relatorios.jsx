import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Surface, ActivityIndicator, IconButton, Avatar } from 'react-native-paper';
import { BarChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Haptics from 'expo-haptics';

// Configurações de Tela e Tema
const { width } = Dimensions.get('window');
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
};

export default function Relatorios() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [timeframe, setTimeframe] = useState('semana'); // semana, mes
    const [selectedBar, setSelectedBar] = useState(null);

    // --- BUSCA DE DADOS ---
    const fetchConsumptionData = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            // Chama a rota real do backend que retorna [{ data: 'dd/mm', consumo: 123 }]
            const response = await axios.get(`${API_URL}/user/me/consumo-semanal`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                // Formata para o Gifted Charts
                const formatted = response.data.map(item => ({
                    value: Number(item.consumo),
                    label: item.data,
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
        } catch (error) {
            console.error("Erro ao buscar relatórios:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchConsumptionData();
    }, [fetchConsumptionData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchConsumptionData();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // --- LÓGICA DE CORES E CÁLCULOS ---
    const getBarColor = (val) => val > 200 ? THEME.danger : val > 150 ? THEME.warning : THEME.primary;
    const getGradientColor = (val) => val > 200 ? '#FF6B6B' : val > 150 ? '#FFD54F' : '#60efff';

    const statistics = useMemo(() => {
        if (!chartData.length) return { total: 0, avg: 0, max: 0, min: 0 };
        const values = chartData.map(d => d.value);
        const total = values.reduce((a, b) => a + b, 0);
        return {
            total,
            avg: Math.round(total / values.length),
            max: Math.max(...values),
            min: Math.min(...values)
        };
    }, [chartData]);

    // --- RENDERIZAÇÃO ---
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={THEME.primary} />
                <Text style={{ marginTop: 10, color: THEME.subtext }}>Carregando dados de consumo...</Text>
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
                {/* HEADER DA TELA */}
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing' }}>
                    <Text style={styles.pageTitle}>Relatório de Consumo</Text>
                    <Text style={styles.pageSubtitle}>Análise detalhada do uso de água</Text>
                </MotiView>

                {/* SELETOR DE PERÍODO */}
                <View style={styles.toggleContainer}>
                    {['semana', 'mes'].map((t) => (
                        <TouchableOpacity 
                            key={t} 
                            style={[styles.toggleBtn, timeframe === t && styles.toggleBtnActive]}
                            onPress={() => { setTimeframe(t); Haptics.selectionAsync(); }}
                        >
                            <Text style={[styles.toggleText, timeframe === t && styles.toggleTextActive]}>
                                {t === 'semana' ? 'Últimos 7 Dias' : 'Mensal'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* GRÁFICO PRINCIPAL */}
                <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 100 }}>
                    <Surface style={styles.chartCard} elevation={4}>
                        <View style={styles.chartHeader}>
                            <View>
                                <Text style={styles.chartTitle}>Consumo Diário</Text>
                                <Text style={styles.chartSubtitle}>Litros por dia</Text>
                            </View>
                            <View style={styles.totalBadge}>
                                <Text style={styles.totalBadgeLabel}>TOTAL</Text>
                                <Text style={styles.totalBadgeValue}>{statistics.total} L</Text>
                            </View>
                        </View>

                        {chartData.length > 0 ? (
                            <View style={{ alignItems: 'center', overflow: 'hidden' }}>
                                <BarChart
                                    data={chartData}
                                    barWidth={28}
                                    spacing={24}
                                    roundedTop
                                    roundedBottom
                                    hideRules
                                    xAxisThickness={0}
                                    yAxisThickness={0}
                                    yAxisTextStyle={{ color: THEME.subtext, fontSize: 10 }}
                                    noOfSections={4}
                                    maxValue={statistics.max * 1.2 || 100} // Dá um respiro no topo
                                    isAnimated
                                    showGradient
                                    animationDuration={1000}
                                    onPress={(item) => {
                                        setSelectedBar(item);
                                        Haptics.selectionAsync();
                                    }}
                                    renderTooltip={(item) => {
                                        return (
                                            <View style={styles.tooltip}>
                                                <Text style={styles.tooltipText}>{item.value} Litros</Text>
                                                <Text style={styles.tooltipDate}>{item.label}</Text>
                                            </View>
                                        );
                                    }}
                                    leftShiftForTooltip={10}
                                    autoCenterTooltip
                                />
                            </View>
                        ) : (
                            <View style={styles.emptyChart}>
                                <IconButton icon="chart-bar" size={40} iconColor={THEME.subtext} />
                                <Text style={{ color: THEME.subtext }}>Sem dados registrados ainda.</Text>
                            </View>
                        )}
                    </Surface>
                </MotiView>

                {/* CARDS DE ESTATÍSTICAS (GRID) */}
                <View style={styles.statsGrid}>
                    <MotiView from={{ translateX: -20, opacity: 0 }} animate={{ translateX: 0, opacity: 1 }} transition={{ delay: 200 }} style={styles.statCardWrapper}>
                        <Surface style={styles.statCard} elevation={2}>
                            <Avatar.Icon size={40} icon="chart-line" style={{backgroundColor: '#E3F2FD'}} color={THEME.primary} />
                            <View style={{marginLeft: 12}}>
                                <Text style={styles.statLabel}>Média Diária</Text>
                                <Text style={styles.statValue}>{statistics.avg} <Text style={styles.unit}>L</Text></Text>
                            </View>
                        </Surface>
                    </MotiView>

                    <MotiView from={{ translateX: 20, opacity: 0 }} animate={{ translateX: 0, opacity: 1 }} transition={{ delay: 300 }} style={styles.statCardWrapper}>
                        <Surface style={styles.statCard} elevation={2}>
                            <Avatar.Icon size={40} icon="water-alert" style={{backgroundColor: '#FFEBEE'}} color={THEME.danger} />
                            <View style={{marginLeft: 12}}>
                                <Text style={styles.statLabel}>Pico de Uso</Text>
                                <Text style={[styles.statValue, {color: THEME.danger}]}>{statistics.max} <Text style={[styles.unit, {color: THEME.danger}]}>L</Text></Text>
                            </View>
                        </Surface>
                    </MotiView>
                </View>

                {/* LISTA DETALHADA */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 400 }}>
                    <Text style={styles.sectionHeader}>Histórico Detalhado</Text>
                    {chartData.map((item, index) => (
                        <Surface key={index} style={styles.listItem} elevation={1}>
                            <View style={styles.listRow}>
                                <View style={styles.dateBox}>
                                    <Text style={styles.dateText}>{item.label.split('/')[0]}</Text>
                                    <Text style={styles.monthText}>{getMonthName(item.label.split('/')[1])}</Text>
                                </View>
                                <View style={{ flex: 1, paddingHorizontal: 15 }}>
                                    <View style={styles.barBackground}>
                                        <View style={[
                                            styles.barFill, 
                                            { width: `${(item.value / statistics.max) * 100}%`, backgroundColor: item.frontColor }
                                        ]} />
                                    </View>
                                </View>
                                <Text style={styles.listValue}>{item.value} L</Text>
                            </View>
                        </Surface>
                    ))}
                </MotiView>

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

// Helper para nome do mês
const getMonthName = (monthNum) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months[parseInt(monthNum) - 1] || '';
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THEME.background
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 150,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 60,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    pageSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 24,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)'
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    toggleBtnActive: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleText: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        fontSize: 13
    },
    toggleTextActive: {
        color: THEME.primary,
        fontWeight: 'bold',
    },
    chartCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        paddingBottom: 30
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: THEME.text,
    },
    chartSubtitle: {
        fontSize: 12,
        color: THEME.subtext,
    },
    totalBadge: {
        alignItems: 'flex-end',
    },
    totalBadgeLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: THEME.subtext,
        letterSpacing: 1,
    },
    totalBadgeValue: {
        fontSize: 20,
        fontWeight: '800',
        color: THEME.primary,
    },
    tooltip: {
        backgroundColor: '#1C1C1E',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 5,
        alignItems: 'center',
    },
    tooltipText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    tooltipDate: {
        color: '#CCC',
        fontSize: 10,
    },
    emptyChart: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCardWrapper: {
        width: '48%',
    },
    statCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: THEME.subtext,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: THEME.text,
    },
    unit: {
        fontSize: 12,
        fontWeight: 'normal',
        color: THEME.subtext,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: THEME.text,
        marginBottom: 12,
        marginLeft: 4,
    },
    listItem: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
    },
    listRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateBox: {
        width: 45,
        height: 45,
        backgroundColor: '#F2F2F7',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: THEME.text,
    },
    monthText: {
        fontSize: 10,
        color: THEME.subtext,
        textTransform: 'uppercase',
    },
    barBackground: {
        height: 8,
        backgroundColor: '#F2F2F7',
        borderRadius: 4,
        width: '100%',
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
    listValue: {
        width: 60,
        textAlign: 'right',
        fontWeight: 'bold',
        color: THEME.text,
        fontSize: 14,
    },
});