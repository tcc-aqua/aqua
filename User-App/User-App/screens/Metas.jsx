import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Metas() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CONTEÚDO DA TELA DE METAS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD', // Fundo azul claro para diferenciar
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D47A1', // Cor azul escuro
  },
});