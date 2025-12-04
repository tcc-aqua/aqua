import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Text, Surface, ActivityIndicator, Avatar, Button, ProgressBar, Portal, Dialog, TextInput, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// ==========================================
// ⚠️ CONFIRA SE O IP ESTÁ CORRETO
// ==========================================
const API_URL = 'http://192.168.0.15:3334/api';

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
    gold: '#FFD700',
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    darkCard: '#2c3e50'
};

// Lógica auxiliar de níveis
const getLevelInfo = (points) => {
    const p = points || 0;
    if (p < 100) return { title: 'Gota Iniciante', next: 100, prev: 0, color: '#4fc3f7', icon: 'water-outline' };
    if (p < 500) return { title: 'Consciente', next: 500, prev: 100, color: '#29b6f6', icon: 'leaf' };
    if (p < 1000) return { title: 'Guardião', next: 1000, prev: 500, color: '#0288d1', icon: 'shield-check' };
    if (p < 3000) return { title: 'Mestre Eco', next: 3000, prev: 1000, color: '#01579b', icon: 'crown' };
    return { title: 'Lenda da Água', next: 10000, prev: 3000, color: '#fbc02d', icon: 'trident' };
};

export default function HomeScreen() {
    const navigation = useNavigation();

    // Estados
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    
    // Dados (Inicializados com valores seguros para evitar tela branca)
    const [userProfile, setUserProfile] = useState({});
    const [stats, setStats] = useState({ pontos: 0, ranking: 0, agua_poupada: 0 });
    const [leaderboard, setLeaderboard] = useState([]);
    
    // Modal
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [savingNick, setSavingNick] = useState(false);

    // Função de busca de dados
    const fetchData = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return; 

            const headers = { Authorization: `Bearer ${token}` };

            const [profileRes, statsRes, rankRes] = await Promise.all([
                axios.get(`${API_URL}/profile`, { headers }).catch(() => ({ data: {} })), // Evita crash se falhar
                axios.get(`${API_URL}/me/stats`, { headers }).catch(() => ({ data: { pontos: 0 } })),
                axios.get(`${API_URL}/leaderboard`, { headers }).catch(() => ({ data: [] }))
            ]);

            // Define com fallback de segurança (||)
            setUserProfile(profileRes.data || {});
            setStats(statsRes.data || { pontos: 0, ranking: 0, agua_poupada: 0 });
            setLeaderboard(rankRes.data || []);

        } catch (error) {
            console.error("Erro ao carregar Home:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleSaveNickname = async () => {
        if (!newNickname.trim()) return;
        setSavingNick(true);
        try {
            const token = await AsyncStorage.getItem('token');
            await axios.put(`${API_URL}/me`, { nickname: newNickname }, { headers: { Authorization: `Bearer ${token}` } });
            
            setVisibleDialog(false);
            onRefresh(); // Atualiza a tela
            Alert.alert("Sucesso", "Apelido criado com sucesso!");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar.");
        } finally {
            setSavingNick(false);
        }
    };

    // Cálculos de Progresso
    const currentPoints = stats.pontos || 0;
    const level = getLevelInfo(currentPoints);
    const range = level.next - level.prev;
    const currentProgress = currentPoints - level.prev;
    const progressPercent = range > 0 ? Math.min(Math.max(currentProgress / range, 0), 1) : 0;

    // Tratamento seguro do nome
    const displayName = userProfile?.nickname || (userProfile?.name ? userProfile.name.split(' ')[0] : 'Vizinho');

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={THEME.primary} />
                <Text style={{ marginTop: 10, color: THEME.subtext }}>Carregando dados...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header com Gradiente */}
            <LinearGradient colors={[THEME.primary, '#F2F2F7']} style={styles.headerBackground} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
            >
                {/* Cabeçalho */}
                <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing' }}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.pageTitle}>Olá, {displayName}</Text>
                            <Text style={styles.pageSubtitle}>
                                {userProfile?.nickname ? 'Rumo ao topo do ranking!' : 'Vamos economizar hoje?'}
                            </Text>
                        </View>
                        <Avatar.Icon size={48} icon="water" style={{ backgroundColor: 'white' }} color={THEME.primary} />
                    </View>
                </MotiView>

                {/* Card de Pontuação */}
                <MotiView from={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 100 }}>
                    <Surface style={styles.scoreCard} elevation={4}>
                        <LinearGradient
                            colors={['#2c3e50', '#4ca1af']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientContent}
                        >
                            <View style={styles.scoreHeader}>
                                <View>
                                    <View style={{flexDirection:'row', alignItems:'center', gap: 5}}>
                                        <MaterialCommunityIcons name={level.icon} size={16} color={level.color} />
                                        <Text style={[styles.levelLabel, { color: level.color }]}>{level.title}</Text>
                                    </View>
                                    <Text style={styles.pointsValue}>{currentPoints} <Text style={{fontSize:16, fontWeight:'400', color:'#ccc'}}>pts</Text></Text>
                                </View>

                                {!userProfile?.nickname ? (
                                    <Button 
                                        mode="contained" 
                                        buttonColor={THEME.gold} 
                                        textColor="#333" 
                                        labelStyle={{fontSize:11, fontWeight:'bold'}}
                                        onPress={() => setVisibleDialog(true)}
                                    >
                                        Criar Apelido
                                    </Button>
                                ) : (
                                    <View style={styles.rankBadge}>
                                        <MaterialCommunityIcons name="trophy" size={24} color={THEME.gold} />
                                        <Text style={styles.rankBadgeText}>{stats.ranking}º</Text>
                                    </View>
                                )}
                            </View>
                            
                            <View style={styles.divider} />
                            
                            <View style={styles.progressContainer}>
                                <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 5}}>
                                    <Text style={styles.progText}>Próximo Nível</Text>
                                    <Text style={styles.progText}>{level.next} pts</Text>
                                </View>
                                <ProgressBar progress={progressPercent} color={level.color} style={styles.progressBar} />
                            </View>
                        </LinearGradient>
                    </Surface>
                </MotiView>

                {/* Ranking Top 5 */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 200 }}>
                    <Text style={styles.sectionHeader}>Ranking da Comunidade 🏆</Text>
                    <Surface style={styles.listCard} elevation={2}>
                        {leaderboard && leaderboard.length === 0 ? (
                            <Text style={styles.emptyText}>Ainda sem competidores.</Text>
                        ) : (
                            leaderboard.map((item, index) => (
                                <View key={index}>
                                    <View style={styles.rankRow}>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text style={[
                                                styles.rankPos,
                                                index === 0 && {color: THEME.gold, fontSize: 18},
                                                index === 1 && {color: THEME.silver, fontSize: 16},
                                                index === 2 && {color: THEME.bronze, fontSize: 16},
                                            ]}>{item.posicao}º</Text>
                                            
                                            <Text style={[
                                                styles.rankName,
                                                item.nickname === userProfile?.nickname && {fontWeight: 'bold', color: THEME.primary}
                                            ]}>
                                                {item.nickname} {item.nickname === userProfile?.nickname && '(Você)'}
                                            </Text>
                                        </View>
                                        <Text style={styles.rankPoints}>{item.pontos}</Text>
                                    </View>
                                    {index < leaderboard.length - 1 && <Divider />}
                                </View>
                            ))
                        )}
                    </Surface>
                </MotiView>

                {/* Acesso Rápido */}
                <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 300 }}>
                    <Text style={styles.sectionHeader}>Acesso Rápido</Text>
                    <View style={styles.shortcutGrid}>
                        <ShortcutItem 
                            icon="chart-bar" color="#1976D2" bg="#E3F2FD" label="Relatórios" 
                            onPress={() => navigation.navigate('Relatorios')} 
                        />
                        <ShortcutItem 
                            icon="target" color="#388E3C" bg="#E8F5E9" label="Metas" 
                            onPress={() => navigation.navigate('Metas')} 
                        />
                         <ShortcutItem 
                            icon="account" color="#F57C00" bg="#FFF3E0" label="Perfil" 
                            onPress={() => navigation.navigate('Perfil')} 
                        />
                    </View>
                </MotiView>

                <View style={{ height: 40 }} />
            </ScrollView>

            <Portal>
                <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)} style={{borderRadius: 16}}>
                    <Dialog.Title>Escolha seu Apelido 🥸</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{marginBottom: 10, color: THEME.subtext}}>
                            Para competir no ranking sem expor seu nome, escolha um apelido criativo.
                        </Text>
                        <TextInput 
                            label="Apelido / Nickname" 
                            value={newNickname} 
                            onChangeText={setNewNickname} 
                            mode="outlined" 
                            activeOutlineColor={THEME.primary}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisibleDialog(false)} textColor={THEME.subtext}>Cancelar</Button>
                        <Button onPress={handleSaveNickname} textColor={THEME.primary}>Salvar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}

// Subcomponente de Atalho
const ShortcutItem = ({ icon, color, bg, label, onPress }) => (
    <Surface style={styles.shortcutCard} elevation={2}>
        <TouchableOpacity style={styles.touchableShortcut} onPress={onPress}>
            <Avatar.Icon size={46} icon={icon} style={{backgroundColor: bg, marginBottom: 8}} color={color} />
            <Text style={styles.shortcutLabel}>{label}</Text>
        </TouchableOpacity>
    </Surface>
);

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
        top: 0, left: 0, right: 0,
        height: 140,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pageTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
    },
    pageSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },

    // SCORE CARD
    scoreCard: {
        borderRadius: 24,
        marginBottom: 24,
        overflow: 'hidden',
    },
    gradientContent: {
        padding: 20,
    },
    scoreHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    levelLabel: {
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    pointsValue: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 5,
    },
    rankBadge: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 14,
    },
    rankBadgeText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginVertical: 15,
    },
    progText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
        fontWeight: '600'
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },

    // RANKING LIST
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: THEME.text,
        marginBottom: 12,
        marginTop: 5,
    },
    listCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 24,
    },
    rankRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    rankPos: {
        width: 35,
        fontSize: 15,
        fontWeight: 'bold',
        color: THEME.subtext,
        textAlign: 'center',
    },
    rankName: {
        fontSize: 14,
        color: THEME.text,
        marginLeft: 5,
    },
    rankPoints: {
        fontWeight: 'bold',
        color: THEME.subtext,
    },
    emptyText: {
        padding: 20,
        textAlign: 'center',
        color: THEME.subtext
    },

    // SHORTCUTS
    shortcutGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    shortcutCard: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: '#FFF',
    },
    touchableShortcut: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 5,
    },
    shortcutLabel: {
        fontWeight: '600',
        fontSize: 12,
        color: THEME.text,
    }
});