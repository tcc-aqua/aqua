import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ATENÇÃO: Se estiver no emulador Android use 'http://10.0.2.2:3334'
// Se for dispositivo físico, use o IP da máquina.
const API_BASE_URL = 'http://localhost:3334/api';

const Header = () => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [scaleAnim] = useState(new Animated.Value(1));

  const loadData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      // Carregar Perfil
      const profileReq = axios.get(`${API_BASE_URL}/profile`, { headers });
      // Carregar Comunicados (Notificações)
      const notifReq = axios.get(`${API_BASE_URL}/comunicados`, { headers });

      const [profileRes, notifRes] = await Promise.all([profileReq, notifReq]);

      setUserInfo(profileRes.data);
      
      const allNotifs = notifRes.data;
      setNotifications(allNotifs);
      setUnreadCount(allNotifs.filter(n => !n.lido).length);

    } catch (error) {
      console.error("Erro header:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // CORREÇÃO: Usamos useEffect padrão em vez de useFocusEffect
  useEffect(() => {
    loadData();
    
    // Opcional: Atualizar a cada 30 segundos para checar novas notificações
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const getFormattedLocation = () => {
    if (!userInfo) return "";
    if (userInfo.residencia_type === 'casa') return `${userInfo.cidade || ''} • Casa`;
    if (userInfo.residencia_type === 'apartamento') return `${userInfo.bairro || ''} • Apto ${userInfo.numero || ''}`;
    return "Aqua User";
  };

  const markAsRead = async (item) => {
    if (item.lido) return;

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/comunicados/${item.id}/lido`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualiza localmente
      const updatedList = notifications.map(n => 
        n.id === item.id ? { ...n, lido: true } : n
      );
      setNotifications(updatedList);
      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (error) {
      console.error("Erro ao marcar como lido", error);
    }
  };

  const toggleNotifications = () => {
    setNotificationsVisible(prev => !prev);
    if (!notificationsVisible) {
        // Recarregar dados ao abrir o modal para garantir frescor
        loadData();
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start(() => {
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
        });
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
        style={[styles.notificationCard, !item.lido && styles.unreadCard]} 
        onPress={() => markAsRead(item)}
        activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, !item.lido ? styles.unreadIconBg : styles.readIconBg]}>
        <Ionicons 
            name={item.lido ? "mail-open-outline" : "mail-unread"} 
            size={20} 
            color={!item.lido ? "#0A84FF" : "#8A8A8E"} 
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.lido && styles.unreadText]}>{item.title}</Text>
        <Text style={styles.notificationSubject} numberOfLines={2}>{item.subject}</Text>
        <Text style={styles.notificationTime}>
            {new Date(item.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
        </Text>
      </View>
      {!item.lido && <View style={styles.blueDot} />}
    </TouchableOpacity>
  );

  const userImage = userInfo?.img_url 
    ? { uri: userInfo.img_url.startsWith('http') ? userInfo.img_url : `${API_BASE_URL.replace('/api', '')}${userInfo.img_url}` } 
    : require('../assets/logo.png');

  if (isLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator color="#0A84FF" /></View>;
  }

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            
            <View style={styles.profileSection}>
                <View style={styles.imageBorder}>
                    <Image source={userImage} style={styles.profileImage} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.greeting}>Olá, {userInfo?.user_name?.split(' ')[0] || 'Usuário'}</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-sharp" size={12} color="#0A84FF" style={{marginRight: 2}} />
                        <Text style={styles.location}>{getFormattedLocation()}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.bellButton} 
                onPress={toggleNotifications}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="notifications-outline" size={24} color="#1C1C1E" />
                {unreadCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                    </View>
                )}
            </TouchableOpacity>

        </View>
      </SafeAreaView>

      <Modal 
        visible={notificationsVisible} 
        animationType="fade" 
        transparent 
        onRequestClose={toggleNotifications}
      >
        <TouchableWithoutFeedback onPress={toggleNotifications}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Notificações</Text>
                  <TouchableOpacity onPress={toggleNotifications} style={styles.closeBtn}>
                    <Ionicons name="close" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {notifications.length > 0 ? (
                  <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderNotificationItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="notifications-off-outline" size={48} color="#D1D1D6" />
                    <Text style={styles.emptyText}>Tudo limpo por aqui!</Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  loadingContainer: {
    height: 80, 
    justifyContent: 'center', 
    backgroundColor:'#fff'
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageBorder: {
    padding: 2,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E3F2FD', // Azul bem claro
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  textContainer: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: '#8A8A8E',
    fontWeight: '500',
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 105 : 75,
    paddingRight: 16,
  },
  modalContent: {
    width: '85%',
    maxWidth: 350,
    backgroundColor: '#fff',
    borderRadius: 20,
    maxHeight: '60%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  closeBtn: {
    padding: 4,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
    alignItems: 'flex-start',
  },
  unreadCard: {
    backgroundColor: '#F0F9FF', // Azul muito leve para não lidos
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  readIconBg: { backgroundColor: '#F2F2F7' },
  unreadIconBg: { backgroundColor: '#E3F2FD' },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 2,
  },
  unreadText: {
    color: '#1C1C1E',
    fontWeight: '700',
  },
  notificationSubject: {
    fontSize: 13,
    color: '#8A8A8E',
    lineHeight: 18,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#AEAEB2',
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0A84FF',
    marginTop: 6,
    marginLeft: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#8A8A8E',
  },
});

export default Header;