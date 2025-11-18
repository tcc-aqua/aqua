import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// ATENÇÃO: Substitua 'localhost' pelo IP da sua máquina se estiver testando no celular.
const API_BASE_URL = 'http://localhost:3334';

const mockNotifications = [
  { id: '1', title: 'Alerta de Vazamento detectado.', time: 'Agora mesmo' },
  { id: '2', title: 'Consumo de água acima da média.', time: 'Há 2h' },
  { id: '3', title: 'Novo relatório mensal disponível.', time: 'Ontem' },
];

const Header = () => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHeaderData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserInfo(response.data);

      } catch (error) {
        console.error("Erro ao carregar dados do header:", error);
        // Tenta carregar do cache como um fallback em caso de falha de rede
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // O objeto do login não tem todos os dados, mas é melhor que nada.
          setUserInfo({ user_name: parsedUser.name, ...parsedUser });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadHeaderData();
  }, []);

  const getFormattedLocation = () => {
    if (!userInfo) return "";
    
    // A view 'vw_users' usada pelo /api/profile retorna esses campos
    if (userInfo.residencia_type === 'casa') {
      return `Casa • ${userInfo.cidade || 'Sua Cidade'}`;
    }
    if (userInfo.residencia_type === 'apartamento') {
      return `Apto • ${userInfo.bairro || 'Seu Bairro'}`;
    }
    return "Localização não encontrada";
  };

  const toggleNotifications = () => setNotificationsVisible(prev => !prev);

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Ionicons name="information-circle-outline" size={22} color="#0A84FF" />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{item.title}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </View>
  );
  
  if (isLoading) {
    return (
        <View style={[styles.container, styles.loadingContainer]}>
            <ActivityIndicator color="#0A84FF" />
        </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftContent}>
          <View style={styles.textInfoWrapper}>
            <Text style={styles.userName} numberOfLines={1}>Olá, {userInfo?.user_name || userInfo?.name || 'Bem-vindo'}</Text>
            <Text style={styles.userLocation} numberOfLines={1}>{getFormattedLocation()}</Text>
          </View>
        </View>

        <View style={styles.rightContent}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleNotifications} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="notifications-outline" size={26} color="#555" />
            {mockNotifications.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{mockNotifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <Image
            source={userInfo?.img_url ? { uri: `${API_BASE_URL}${userInfo.img_url}` } : require('../assets/logo.png')}
            style={styles.profileImage}
          />
        </View>
      </View>

      <Modal visible={notificationsVisible} animationType="fade" transparent onRequestClose={toggleNotifications}>
        <TouchableWithoutFeedback onPress={toggleNotifications}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Notificações</Text>
                  <TouchableOpacity onPress={toggleNotifications} style={styles.closeButton}>
                    <Ionicons name="close" size={26} color="#555" />
                  </TouchableOpacity>
                </View>

                {mockNotifications.length > 0 ? (
                  <FlatList
                    data={mockNotifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNotificationItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={styles.notificationListContent}
                  />
                ) : (
                  <View style={styles.emptyNotifications}>
                    <Ionicons name="checkmark-circle-outline" size={50} color="#bbb" />
                    <Text style={styles.emptyNotificationsText}>Nenhuma notificação nova!</Text>
                  </View>
                )}
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  loadingContainer: {
    justifyContent: 'center',
    height: Platform.OS === 'ios' ? 90 : 60,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  textInfoWrapper: {},
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  userLocation: {
    fontSize: 14,
    color: '#8A8A8E',
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 16,
    position: 'relative',
    padding: 4,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingRight: 16,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '95%',
    maxWidth: 400,
    maxHeight: '70%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
      android: { elevation: 10 },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  closeButton: {
    padding: 6,
  },
  notificationListContent: {
    paddingBottom: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  notificationContent: {
    marginLeft: 12,
    flex: 1,
  },
  notificationText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 21,
  },
  notificationTime: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  emptyNotifications: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyNotificationsText: {
    marginTop: 16,
    fontSize: 16,
    color: '#aaa',
  },
});

export default Header;