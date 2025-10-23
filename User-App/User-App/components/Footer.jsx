import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const footerItems = [
  { id: 'App', icon: 'home-outline', text: 'Início', activeIcon: 'home' },
  { id: 'Relatorios', icon: 'bar-chart-outline', text: 'Relatórios', activeIcon: 'bar-chart' },
  { id: 'Metas', icon: 'trophy-outline', text: 'Metas', activeIcon: 'trophy' },
  { id: 'Perfil', icon: 'person-outline', text: 'Perfil', activeIcon: 'person' },
];

const Footer = ({ activeScreen, onNavigate }) => {
  const [scaleAnimations] = useState(() =>
    footerItems.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(1);
      return acc;
    }, {})
  );

  const animatePress = (animation, toValue) => {
    if (animation) {
      Animated.spring(animation, {
        toValue: toValue,
        useNativeDriver: true,
        speed: 20,
        bounciness: 10,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {footerItems.map((item) => {
        const isActive = activeScreen === item.id;
        const iconName = isActive ? item.activeIcon : item.icon;
        const textColor = isActive ? '#2196F3' : '#777';
        const itemAnimation = scaleAnimations[item.id];

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.footerItem}
            onPress={() => onNavigate(item.id)}
            onPressIn={() => animatePress(itemAnimation, 0.9)}
            onPressOut={() => animatePress(itemAnimation, 1)}
            accessibilityRole="button"
            accessibilityLabel={item.text}
          >
            <Animated.View style={{ transform: [{ scale: itemAnimation }] }}>
              <Ionicons name={iconName} size={24} color={textColor} />
            </Animated.View>
            <Text style={[styles.itemText, { color: textColor }]}>{item.text}</Text>
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
    paddingBottom: Platform.OS === 'ios' ? 25 : 10, // Ajuste para iPhone
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