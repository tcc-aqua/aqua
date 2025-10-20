import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // 1. Verifica se os campos estão vazios primeiro
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Atenção', 'Por favor, preencha o usuário e a senha.');
      return; // Para a execução da função aqui
    }

    // 2. Verifica se o usuário E a senha estão corretos
    if (email === 'Roberta' && password === '123') {
      // Se ambos estiverem corretos, exibe a mensagem de sucesso
      Alert.alert('Sucesso', `Login realizado com sucesso. Bem-vinda, ${email}!`);
      // Aqui você pode adicionar a navegação para a próxima tela do seu app
    } else {
      // Se um deles (ou ambos) estiverem errados, exibe a mensagem de erro
      Alert.alert('Erro de Login', 'Usuário ou senha inválidos.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/aqua-logo.png')} // Caminho corrigido da resposta anterior
        style={styles.logo}
      />
      <Text style={styles.title}>Aqua Services 2025</Text>

      {/* Inputs de E-mail e Senha */}
      <TextInput
        style={styles.input}
        placeholder="Usuário" // Alterado de E-mail para Usuário para corresponder à lógica
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Botão de Login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Links de "Esqueci minha senha" e "Cadastre-se" */}
      <TouchableOpacity>
        <Text style={styles.linkText}>Esqueci minha senha</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.linkText}>Novo por aqui? Aqua assinaturas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#00BFFF',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
  },
});