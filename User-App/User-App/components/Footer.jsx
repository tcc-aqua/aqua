import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

// Dados dos itens do footer
const footerItems = [
  { id: 'home', icon: 'home-outline', text: 'Início', activeIcon: 'home' },
  { id: 'reports', icon: 'bar-chart-outline', text: 'Relatórios', activeIcon: 'bar-chart' },
  { id: 'devices', icon: 'trophy-outline', text: 'Metas', activeIcon: 'trophy' },
  { id: 'profile', icon: 'person-outline', text: 'Perfil', activeIcon: 'person' },
];

const Footer = ({ activeScreen, onNavigate }) => {
  // Referências para as animações de cada item
  const scaleAnimations = useRef(footerItems.reduce((acc, item) => {
    acc[item.id] = new Animated.Value(1);
    return acc;
  }, {})).current;

  // Função para iniciar a animação de "apertar"
  const animatePressIn = (itemId) => {
    Animated.spring(scaleAnimations[itemId], {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  // Função para iniciar a animação de "soltar"
  const animatePressOut = (itemId) => {
    Animated.spring(scaleAnimations[itemId], {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  return (
    <View style={styles.container}>
      {footerItems.map((item) => {
        const isActive = activeScreen === item.id;
        const iconName = isActive ? item.activeIcon : item.icon;
        const textColor = isActive ? '#2196F3' : '#777';

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.footerItem}
            onPress={() => onNavigate(item.id)}
            onPressIn={() => animatePressIn(item.id)}
            onPressOut={() => animatePressOut(item.id)}
            accessibilityRole="button"
            accessibilityLabel={item.text}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnimations[item.id] }] }}>
              <Ionicons name={iconName} size={24} color={textColor} />
            </Animated.View>
            <Text style={[styles.itemText, { color: textColor }]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: -3 },
      },
      android: { elevation: 8 },
    }),
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  itemText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default Footer;