import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Relatorios() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CONTEÚDO DA TELA DE RELATÓRIOS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // Fundo verde claro para diferenciar
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20', // Cor verde escuro
  },
});