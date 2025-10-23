import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Perfil() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CONTEÚDO DA TELA DE PERFIL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E0', // Fundo laranja claro para diferenciar
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E65100', // Cor laranja escuro
  },
});