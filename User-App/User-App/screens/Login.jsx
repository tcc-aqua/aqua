// ARQUIVO: screens/Login.jsx (COPIE E COLE ISTO)

import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';

// A mudança principal está aqui: recebemos a propriedade "onLogin" que o app.jsx nos deu.
export default function Login({ onLogin }) {

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/aqua-logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Aqua Services 2025</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
      />

      {/* AGORA, O BOTÃO EXECUTA A FUNÇÃO "onLogin" QUE VEIO DO APP.JSX */}
      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.linkText}>Esqueci minha senha</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.linkText}>Novo por aqui? Aqua assinaturas</Text>
      </TouchableOpacity>
    </View>
  );
}

// Seus estilos (não mudam)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', padding: 20 },
    logo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 },
    title: { fontSize: 16, color: '#888', marginBottom: 40 },
    input: { width: '100%', height: 50, backgroundColor: '#f2f2f2', borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 15 },
    loginButton: { width: '100%', height: 50, backgroundColor: '#00BFFF', borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    loginButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
    linkText: { color: '#888', fontSize: 14, marginTop: 10, },
});