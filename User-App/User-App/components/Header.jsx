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
  TouchableWithoutFeedback, // Adicionado
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

// --- Exemplo de lista de notificações (placeholder)
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
  logoUri = 'https://via.placeholder.com/40/2196F3/FFFFFF?text=AM', // Logo com fundo azul
  notificationsCount = mockNotifications.length, // Usando o tamanho do mock
  onMenuPress,
}) => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const toggleNotifications = () => {
    setNotificationsVisible((prev) => !prev);
  };

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
            <Text style={styles.appName} numberOfLines={1}>
              {appName}
            </Text>
            <Text style={styles.appLocation} numberOfLines={1}>
              {appLocation}
            </Text>
          </View>
        </View>

        {/* Direita: Notificações + Menu */}
        <View style={styles.rightContent}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleNotifications}
            accessibilityLabel="Notificações"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="notifications-outline" size={24} color="#555" />
            {notificationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>
                  {notificationsCount > 99 ? '99+' : notificationsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMenuPress}
            accessibilityLabel="Abrir Menu"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="menu" size={26} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de notificações Flutuante */}
      <Modal
        visible={notificationsVisible}
        animationType="fade" // Alterado para fade
        transparent
        onRequestClose={toggleNotifications}
      >
        <TouchableWithoutFeedback onPress={toggleNotifications}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Notificações</Text>
                  <TouchableOpacity onPress={toggleNotifications} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#555" />
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
                    <Ionicons name="checkmark-circle-outline" size={40} color="#bbb" />
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
  // --- Header ---
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12, // Mais padding no iOS
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee', // Borda mais clara
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08, // Sombra mais sutil
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 4 }, // Elevação maior para Android
    }),
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  logo: {
    width: 44, // Levemente maior
    height: 44,
    borderRadius: 12, // Bordas mais suaves
    marginRight: 12,
    backgroundColor: '#e0f7fa', // Cor de fundo mais fria
  },
  textInfoWrapper: {
    flexShrink: 1,
  },
  appName: {
    fontSize: Platform.OS === 'ios' ? 19 : 18,
    fontWeight: '700',
    color: '#333',
  },
  appLocation: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20, // Mais espaço entre os ícones
    position: 'relative',
    padding: 4,
  },

  // --- Badge ---
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30', // Vermelho padrão do iOS para notificações
    borderRadius: 10,
    minWidth: 20, // Levemente maior
    paddingHorizontal: 5,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Adiciona uma borda sutil
    borderColor: '#fff', // Cor da borda
  },
  badgeText: {
    color: '#fff',
    fontSize: 11, // Levemente maior
    fontWeight: '700',
  },

  // --- Modal de Notificações ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Fundo mais escuro
    justifyContent: 'flex-start', // Começa do topo
    paddingTop: Platform.OS === 'ios' ? 80 : 60, // Ajusta a posição do modal para ficar abaixo do header
    alignItems: 'center', // Centraliza o modal horizontalmente
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12, // Bordas arredondadas para o card do modal
    width: '90%', // Ocupa a maior parte da largura
    maxHeight: '70%', // Limita a altura
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
      },
      android: { elevation: 8 },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4, // Área de toque maior
  },
  notificationListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Alinha o ícone ao topo
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8', // Fundo levemente cinza para o card
    borderRadius: 8,
    marginBottom: 8, // Espaço entre os cards
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 1 },
    }),
  },
  notificationContent: {
    marginLeft: 12,
    flex: 1,
  },
  notificationText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    lineHeight: 20, // Melhor leitura
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  separator: {
    height: 1, // Separador mais robusto
    backgroundColor: '#f0f0f0', // Cor mais clara
    marginVertical: 4, // Espaço vertical
  },
  emptyNotifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyNotificationsText: {
    marginTop: 15,
    fontSize: 16,
    color: '#888',
  },
});

export default Header;