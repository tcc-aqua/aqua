import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Modal, Alert, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { 
  Provider as PaperProvider, 
  DefaultTheme, 
  Avatar, 
  Title, 
  Text, 
  Button, 
  TextInput, 
  ActivityIndicator, 
  IconButton, 
  Surface, 
  ProgressBar
} from 'react-native-paper'; 
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://localhost:3334/api';

const { width } = Dimensions.get('window');

const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0A84FF',
    accent: '#005ecb',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#1C1C1E',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
  },
};

const MetasScreen = () => {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ active: 0, completed: 0, total_points: 0 });

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMetaId, setSelectedMetaId] = useState(null);
  const [processing, setProcessing] = useState(false);

  const [limiteConsumo, setLimiteConsumo] = useState('');
  const [periodo, setPeriodo] = useState('7 dias');

  const fetchMetasAndStats = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if(!token) return;
      const headers = { Authorization: `Bearer ${token}` };

      const resMetas = await axios.get(`${API_URL}/metas?limit=50`, { headers });
      const metasData = resMetas.data.docs || [];
      setMetas(metasData);

      const active = metasData.filter(m => m.status === 'em_andamento').length;
      const completed = metasData.filter(m => m.status === 'atingida').length;
      
      const resUser = await axios.get(`${API_URL}/user/me/stats`, { headers });
      setStats({ active, completed, total_points: resUser.data.pontos || 0 });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetasAndStats();
    const interval = setInterval(() => fetchMetasAndStats(true), 5000);
    return () => clearInterval(interval);
  }, [fetchMetasAndStats]);

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedMetaId(null);
    setLimiteConsumo('');
    setPeriodo('7 dias');
    setModalVisible(true);
  };

  const openEditModal = (meta) => {
    setIsEditing(true);
    setSelectedMetaId(meta.id);
    setLimiteConsumo(meta.limite_consumo.toString());
    setPeriodo(meta.periodo);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!limiteConsumo || isNaN(limiteConsumo) || parseFloat(limiteConsumo) <= 0) {
      Alert.alert("Inválido", "Informe um limite de consumo válido.");
      return;
    }

    setProcessing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { periodo, limite_consumo: parseFloat(limiteConsumo) };

      if (isEditing) {
        await axios.put(`${API_URL}/metas/${selectedMetaId}`, payload, { headers });
      } else {
        await axios.post(`${API_URL}/metas`, payload, { headers });
      }
      
      setModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      fetchMetasAndStats(true);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a meta.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
        "Excluir Meta",
        "Deseja realmente excluir? O progresso será perdido.",
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Excluir", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem('token');
                        await axios.delete(`${API_URL}/metas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        fetchMetasAndStats(true);
                    } catch (e) {
                        Alert.alert("Erro", "Não foi possível excluir.");
                    }
                } 
            }
        ]
    );
  };

  const getStatusConfig = (status, progress) => {
    if (status === 'excedida') return { color: theme.colors.danger, label: 'Excedida', icon: 'alert-circle-outline' };
    if (status === 'atingida') return { color: theme.colors.success, label: 'Concluída', icon: 'trophy-outline' };
    
    if (progress >= 0.9) return { color: theme.colors.warning, label: 'Crítico', icon: 'alert-outline' };
    if (progress >= 0.5) return { color: '#29B6F6', label: 'Moderado', icon: 'water-outline' };
    return { color: theme.colors.primary, label: 'Em Andamento', icon: 'water-outline' };
  };

  const formatPeriodo = (p) => {
    const map = { '7 dias': 'Semanal', '14 dias': 'Quinzenal', '30_dias': 'Mensal' };
    return map[p] || 'Semanal';
  };

  const formatData = (dateString) => {
      if (!dateString) return '';
      const d = new Date(dateString);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}`;
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchMetasAndStats()} />}
          showsVerticalScrollIndicator={false}
        >
          <MotiView 
              from={{ opacity: 0, translateY: -20 }} 
              animate={{ opacity: 1, translateY: 0 }} 
              transition={{ type: 'timing', duration: 600 }}
          >
            <LinearGradient
              colors={['#0A84FF', '#0055D4']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.statsCard}
            >
              <View style={styles.statsHeader}>
                  <View>
                      <Text style={styles.statsTitle}>Minhas Conquistas</Text>
                      <Text style={styles.statsSubtitle}>Gerencie suas economias</Text>
                  </View>
                  <View style={styles.pointsBadge}>
                    <Avatar.Icon size={24} icon="star" style={{backgroundColor: 'transparent'}} color="#FFD700" />
                    <Text style={styles.pointsText}>{stats.total_points}</Text>
                  </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.active}</Text>
                  <Text style={styles.statLabel}>Ativas</Text>
                </View>
                <View style={styles.verticalDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stats.completed}</Text>
                  <Text style={styles.statLabel}>Concluídas</Text>
                </View>
              </View>
            </LinearGradient>
          </MotiView>

          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Metas Ativas</Title>
            <Button 
              mode="text" 
              onPress={openCreateModal} 
              labelStyle={{fontWeight: 'bold', color: theme.colors.primary}}
              icon="plus"
            >
              Nova
            </Button>
          </View>

          {loading && <ActivityIndicator style={{marginTop: 40}} color={theme.colors.primary} size="large" />}

          {!loading && metas.length === 0 && (
              <View style={styles.emptyState}>
                  <Avatar.Icon size={80} icon="target" style={{backgroundColor:'#E3F2FD'}} color="#0A84FF" />
                  <Text style={styles.emptyText}>Sem metas definidas</Text>
                  <Text style={styles.emptySubtext}>Crie uma meta de consumo para começar a ganhar pontos.</Text>
                  <Button mode="contained" onPress={openCreateModal} style={styles.emptyButton}>Criar Agora</Button>
              </View>
          )}

          {metas.map((meta, index) => {
              const limit = parseFloat(meta.limite_consumo);
              const current = parseFloat(meta.consumo_atual || 0);
              const ratio = limit > 0 ? current / limit : 0;
              const displayRatio = Math.min(ratio, 1);
              const { color, label, icon } = getStatusConfig(meta.status, ratio);
              
              return (
                  <MotiView 
                      key={meta.id}
                      from={{ opacity: 0, translateY: 20 }} 
                      animate={{ opacity: 1, translateY: 0 }} 
                      transition={{ delay: index * 100 }}
                  >
                      <Surface style={styles.metaCard} elevation={2}>
                          <View style={styles.cardHeader}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                                    <IconButton icon={icon} iconColor={color} size={24} />
                                </View>
                                <View style={{marginLeft: 10}}>
                                    <Text style={styles.cardTitle}>{formatPeriodo(meta.periodo)}</Text>
                                    <Text style={styles.cardDateRange}>{formatData(meta.inicio_periodo)} a {formatData(meta.fim_periodo)}</Text>
                                </View>
                            </View>
                            <IconButton icon="dots-vertical" onPress={() => openEditModal(meta)} />
                          </View>

                          <View style={styles.progressSection}>
                             <View style={styles.progressLabels}>
                                <Text style={styles.progressLabelText}>Consumo</Text>
                                <Text style={styles.progressLabelText}>
                                    <Text style={{color: color, fontWeight:'bold'}}>{current.toFixed(0)}</Text> / {limit.toFixed(0)} L
                                </Text>
                             </View>
                             <ProgressBar progress={displayRatio} color={color} style={styles.progressBar} />
                          </View>

                          <View style={styles.cardFooter}>
                             <View style={[styles.badge, { backgroundColor: color }]}>
                                <Text style={styles.badgeText}>{label}</Text>
                             </View>
                             <Button 
                                textColor={theme.colors.danger} 
                                onPress={() => handleDelete(meta.id)}
                                compact
                             >
                                Remover
                             </Button>
                          </View>
                      </Surface>
                  </MotiView>
              );
          })}
          <View style={{height: 80}} />
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalDragIndicator} />
              <View style={styles.modalHeaderRow}>
                <Title style={styles.modalTitle}>{isEditing ? "Editar Meta" : "Nova Meta"}</Title>
                <IconButton icon="close-circle-outline" size={28} onPress={() => setModalVisible(false)} />
              </View>
              
              <Text style={styles.inputLabel}>Limite (Litros)</Text>
              <TextInput 
                mode="outlined"
                value={limiteConsumo}
                onChangeText={setLimiteConsumo}
                keyboardType="numeric"
                placeholder="Ex: 5000"
                style={styles.input}
                outlineStyle={{borderRadius: 12}}
                activeOutlineColor={theme.colors.primary}
                right={<TextInput.Affix text="L" />}
              />

              <Text style={styles.inputLabel}>Período</Text>
              <View style={styles.radioContainer}>
                {['7 dias', '14 dias', '30_dias'].map((p) => (
                    <TouchableOpacity 
                        key={p}
                        onPress={() => setPeriodo(p)}
                        style={[
                            styles.radioOption, 
                            periodo === p && styles.radioOptionSelected
                        ]}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.radioOptionText, periodo === p && styles.radioOptionTextSelected]}>
                            {formatPeriodo(p)}
                        </Text>
                    </TouchableOpacity>
                ))}
              </View>

              <Button 
                mode="contained" 
                onPress={handleSave} 
                loading={processing} 
                style={styles.saveButton}
                contentStyle={{height: 56}}
                labelStyle={{fontSize: 18, fontWeight: 'bold'}}
              >
                {isEditing ? "Atualizar" : "Criar Meta"}
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    padding: 20,
  },
  statsCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 10,
    shadowColor: '#0A84FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  statsTitle: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  statsSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20
  },
  pointsText: { color: '#FFD700', fontWeight: 'bold', fontSize: 18, marginLeft: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 4, fontWeight: '600' },
  verticalDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C1C1E' },
  metaCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconContainer: {
      width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  cardDateRange: { fontSize: 13, color: '#8A8A8E', marginTop: 2 },
  progressSection: { marginTop: 20, marginBottom: 20 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabelText: { fontSize: 14, color: '#666', fontWeight: '500' },
  progressBar: { height: 12, borderRadius: 6, backgroundColor: '#F2F2F7' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 20 },
  emptySubtext: { fontSize: 15, color: '#666', textAlign: 'center', marginTop: 10, maxWidth: '80%' },
  emptyButton: { marginTop: 25, borderRadius: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 50,
  },
  modalDragIndicator: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  modalTitle: { fontSize: 24, fontWeight: 'bold' },
  inputLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10, marginTop: 5 },
  input: { backgroundColor: '#FFF', marginBottom: 20, fontSize: 18 },
  radioContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  radioOption: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 14,
      borderWidth: 1,
      borderColor: '#E5E5EA',
      borderRadius: 12,
      marginHorizontal: 4,
      backgroundColor: '#FFF'
  },
  radioOptionSelected: {
      backgroundColor: '#0A84FF',
      borderColor: '#0A84FF',
  },
  radioOptionText: { fontWeight: '600', color: '#333' },
  radioOptionTextSelected: { color: '#FFF' },
  saveButton: { borderRadius: 16, backgroundColor: '#0A84FF' },
});

export default MetasScreen;