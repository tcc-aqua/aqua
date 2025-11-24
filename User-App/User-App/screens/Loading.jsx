import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiImage } from 'moti';

const { width } = Dimensions.get('window');

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A84FF', '#005ecb', '#002a5c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.5, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{
            type: 'spring',
            damping: 15,
            duration: 1000,
          }}
          style={styles.logoContainer}
        >
          <MotiImage
            source={require('../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'timing', duration: 1000 }}
          />
          
          <MotiView
             from={{ opacity: 0, translateY: 10 }}
             animate={{ opacity: 1, translateY: 0 }}
             transition={{ delay: 500, duration: 800 }}
          >
             <Text style={styles.appName}>Aqua Services</Text>
          </MotiView>
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1200, duration: 500 }}
          style={styles.loaderContainer}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Iniciando o sistema...</Text>
        </MotiView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loadingText: {
    color: '#E0E0E0',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});