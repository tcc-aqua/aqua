import React, { useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { Video } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-web-linear-gradient';
import { Svg, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const shakeRef = useRef(null);

  const onLoginFail = () => {
    if (shakeRef.current) shakeRef.current.shake(800);
  };

  return (
    <View style={styles.container}>
      {/* GIF/Video de fundo */}
      <Video
        source={require('./assets/water_bg.mp4')} // GIF convertido pra mp4 ou lottie water animation
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />

      {/* Floating geometric shapes (spheres/cubes) */}
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        <Circle cx={50} cy={100} r={20} fill="rgba(0, 200, 255, 0.3)" />
        <Circle cx={200} cy={300} r={30} fill="rgba(120, 0, 255, 0.2)" />
        {/* Pode animar isso usando Animated API */}
      </Svg>

      {/* Logo com partículas */}
      <Animatable.Text animation="fadeInDown" style={styles.logo}>
        AQUA APP
      </Animatable.Text>

      {/* Formulário */}
      <Animatable.View ref={shakeRef} style={styles.formContainer} animation="fadeInUp">
        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={onLoginFail} // só pra demo shake
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00f0ff', '#8000ff']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradientButton}
          >
            <Text style={styles.loginText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0ff',
    letterSpacing: 2,
    marginBottom: 50,
    textShadowColor: '#0ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  formContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    backdropFilter: 'blur(10px)', // glassmorphism
    shadowColor: '#0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.3)',
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#fff',
  },
  loginButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
  },
});
