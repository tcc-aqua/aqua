import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

// --- Lista de notificações de exemplo
const mockNotifications = [
  { id: '1', title: 'Alerta de Vazamento detectado no Bloco C.', time: 'Agora mesmo' },
  { id: '2', title: 'Consumo de água acima da média em sua unidade.', time: 'Há 2h' },
  { id: '3', title: 'Manutenção programada para o sistema de irrigação.', time: 'Ontem às 14:00' },
  { id: '4', title: 'Novo relatório mensal de consumo disponível.', time: '2 dias atrás' },
  { id: '5', title: 'Medidor de água atualizado para a versão 2.0.', time: '3 dias atrás' },
];

const Header = ({
  appName = 'AquaMonitor',
  appLocation = 'Apto 1502 • Bloco A',
  logoUri = 'https://via.placeholder.com/40/2196F3/FFFFFF?text=AM',
  notificationsCount = mockNotifications.length,
}) => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const toggleNotifications = () => setNotificationsVisible(prev => !prev);

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Ionicons name="information-circle-outline" size={22} color="#2196f3" />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{item.title}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        {/* Esquerda: Logo + Infos */}
        <View style={styles.leftContent}>
          <Image source={{ uri: logoUri }} style={styles.logo} />
          <View style={styles.textInfoWrapper}>
            <Text style={styles.appName} numberOfLines={1}>{appName}</Text>
            <Text style={styles.appLocation} numberOfLines={1}>{appLocation}</Text>
          </View>
        </View>

        {/* Direita: Notificações + Menu */}
        <View style={styles.rightContent}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleNotifications} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="notifications-outline" size={26} color="#555" />
            {notificationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>{notificationsCount > 99 ? '99+' : notificationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>


        </View>
      </View>

      {/* Modal de notificações */}
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
    paddingVertical: Platform.OS === 'ios' ? 16 : 14,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 5 },
    }),
  },
  leftContent: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  logo: { width: 50, height: 50, borderRadius: 14, marginRight: 14, backgroundColor: '#e0f7fa' },
  textInfoWrapper: { flexShrink: 1 },
  appName: { fontSize: Platform.OS === 'ios' ? 20 : 19, fontWeight: '800', color: '#222' },
  appLocation: { fontSize: 14, color: '#777', marginTop: 2 },
  rightContent: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 22, position: 'relative', padding: 4 },

  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 22,
    paddingHorizontal: 6,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '92%',
    maxHeight: '72%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 9 },
    }),
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#222' },
  closeButton: { padding: 6 },
  notificationListContent: { paddingHorizontal: 18, paddingVertical: 10 },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: '#f4f6f8',
    borderRadius: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 1 },
    }),
  },
  notificationContent: { marginLeft: 14, flex: 1 },
  notificationText: { fontSize: 16, fontWeight: '500', color: '#333', lineHeight: 22 },
  notificationTime: { fontSize: 13, color: '#888', marginTop: 4 },
  separator: { height: 1, backgroundColor: '#e6e6e6', marginVertical: 6 },
  emptyNotifications: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  emptyNotificationsText: { marginTop: 18, fontSize: 17, color: '#aaa', fontWeight: '500' },
});

export default Header;
