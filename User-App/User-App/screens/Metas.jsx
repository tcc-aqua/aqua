import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
// 1. Limpei as importações não utilizadas (ProgressBar, MD3Colors)
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper'; 
import { LinearGradient } from 'expo-linear-gradient';

const MetasScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Card de Progresso Geral - VERSÃO OTIMIZADA */}
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#C8A2C8']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradientCard}
      >
        {/* 2. Substituí Card.Title por um View e um Title padrão */}
        <View style={styles.cardHeader}>
          <Title style={styles.cardTitleWhite}>Progresso Geral</Title>
        </View>

        {/* 3. Substituí Card.Content por um View padrão */}
        <View style={styles.cardContent}>
          {/* Seção da mensagem de rendimento com ícone */}
          <View style={styles.rendimentoContainer}>
            <Paragraph style={styles.textoBranco}>
              Seu rendimento este mês está ótimo!
            </Paragraph>
            <Avatar.Icon 
              size={40} 
              icon="rocket-launch" 
              style={styles.rendimentoIcon} 
              color="#4c669f"
              backgroundColor="#FFF"
            />
          </View>

          {/* Seção das 3 informações lado a lado */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Title style={styles.statNumeroBranco}>5</Title>
              <Paragraph style={styles.statLabelBranco}>Ativas</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumeroBranco}>10</Title>
              <Paragraph style={styles.statLabelBranco}>Concluídas</Paragraph>
            </View>
            <View style={styles.statItem}>
              <Title style={styles.statNumeroBranco}>1500</Title>
              <Paragraph style={styles.statLabelBranco}>Pontos</Paragraph>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* O resto do seu código permanece exatamente o mesmo */}
      <Card style={styles.card}>
        <Card.Title title="Minhas Metas" />
        <Card.Content>
          <Paragraph>Meta 1: Correr 5km - Em andamento</Paragraph>
          <Paragraph>Meta 2: Ler 1 livro por mês - Concluída</Paragraph>
        </Card.Content>
      </Card>
      {/* ... outros cards e botões ... */}
       <Card style={styles.card}>
        <Card.Title title="Desafio da Comunidade" />
        <Card.Content>
          <Paragraph>Participe do desafio de economizar R$100 neste mês e ganhe pontos extras!</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Ranking do Condomínio" />
        <Card.Content>
          <Paragraph>1. Vizinho 1 - 2000 pontos</Paragraph>
          <Paragraph>2. Você - 1500 pontos</Paragraph>
          <Paragraph>3. Vizinho 2 - 1200 pontos</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button icon="plus" mode="contained" onPress={() => console.log('Criar nova meta')} style={styles.button}>
          Criar Meta
        </Button>
        <Button icon="gift" mode="contained" onPress={() => console.log('Resgatar recompensas')} style={styles.button}>
          Recompensas
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ... (container, contentContainer, card)
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
  },
  gradientCard: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  // 4. Adicionei estilos para o header e content customizados
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    fontSize: 20, // Tamanho padrão do Card.Title
  },
  textoBranco: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  statNumeroBranco: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabelBranco: {
    fontSize: 12,
    color: '#E0E0E0',
  },
  rendimentoIcon: {},
  rendimentoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  // 5. Removi os estilos não utilizados (statNumero, statLabel)
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default MetasScreen;