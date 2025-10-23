import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Platform, Dimensions } from 'react-native';
import { 
  Provider as PaperProvider, 
  DefaultTheme, 
  Card, 
  Text, 
  SegmentedButtons, 
  Title, 
  Paragraph, 
  List,
  Surface
} from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts/dist/LineChart';
import 'react-native-svg';
import { MotiView, MotiText } from 'moti';
import { MotiPressable } from 'moti/interactions';

// --- CÁLCULO DE LARGURA RESPONSIVA ---
const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 32 - 32 - 40; 

// --- TEMA VISUAL COM COR CORRIGIDA ---
const theme = {
  ...DefaultTheme,
  roundness: 16,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF',
    accent: '#0056b3',
    background: '#F0F4F8',
    surface: '#FFFFFF',
    text: '#212529',
    placeholder: '#6c757d',
    success: '#198754',
    danger: '#D32F2F', // <-- COR CORRIGIDA: Vermelho mais puro, menos rosado
    cardBlue: '#E3F2FD',
    cardGreen: '#E0F2F1',
  },
};

const useAnimatedCounter = (targetValue, duration = 800) => {
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const value = Math.min((progress / duration) * targetValue, targetValue);
      setCurrentValue(value);
      if (progress < duration) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [targetValue, duration]);
  return currentValue;
};

const consumptionData = { current: 15.7, comparison: -12.5, todayConsumption: 89.4, todaySavings: 11.2 };
const chartData = {
    hoje: [ { value: 10, label: '0h' }, { value: 12, label: '3h' }, { value: 20, label: '6h' }, { value: 18, label: '9h' }, { value: 25, label: '12h' }, { value: 15.7, label: 'Agora' }, ],
    semana: [ { value: 110, label: 'Seg' }, { value: 105, label: 'Ter' }, { value: 120, label: 'Qua' }, { value: 115, label: 'Qui' }, { value: 95, label: 'Sex' }, { value: 90, label: 'Sáb' }, { value: 89, label: 'Dom' }, ],
    mes: [ { value: 800, label: 'S1' }, { value: 750, label: 'S2' }, { value: 820, label: 'S3' }, { value: 790, label: 'S4' }, ]
};
const recentHistory = [
    { id: '1', icon: 'shower-head', description: 'Banho (Chuveiro)', time: '14:32', value: '-25 L', type: 'expense' },
    { id: '2', icon: 'water-boiler', description: 'Aquecedor de água', time: '12:15', value: '-12 L', type: 'expense' },
    { id: '3', icon: 'leaf', description: 'Meta de economia diária', time: '08:00', value: '+5 L', type: 'saving' },
    { id: '4', icon: 'washing-machine', description: 'Máquina de Lavar', time: '07:45', value: '-40 L', type: 'expense' },
];

export default function Inicio() {
  const [filter, setFilter] = useState('hoje');
  const animatedConsumption = useAnimatedCounter(consumptionData.current);
  const animatedToday = useAnimatedCounter(consumptionData.todayConsumption);
  const animatedSavings = useAnimatedCounter(consumptionData.todaySavings);
  const comparisonColor = consumptionData.comparison <= 0 ? theme.colors.success : theme.colors.danger;
  const comparisonText = consumptionData.comparison <= 0 ? `${consumptionData.comparison}% em relação a ontem` : `+${consumptionData.comparison}% em relação a ontem`;

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500 }}>
          <Card style={[styles.card, styles.mainCard]} elevation={5}>
            <Card.Content>
              <Paragraph style={styles.cardSubtitle}>Consumo Atual</Paragraph>
              <View style={styles.mainConsumptionRow}>
                <Text style={styles.mainConsumptionText} adjustsFontSizeToFit numberOfLines={1}>
                  {animatedConsumption.toFixed(1)}
                </Text>
                <Text style={styles.consumptionUnit}> L/h</Text>
              </View>
              <MotiText from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 300 }} style={[styles.comparisonText, { color: comparisonColor }]}>
                {comparisonText}
              </MotiText>
              <View style={styles.innerCardsContainer}>
                <Surface style={[styles.innerCard, { backgroundColor: theme.colors.cardBlue, marginRight: 8 }]}>
                  <List.Icon icon="water" color={theme.colors.primary} />
                  <View style={{flex: 1}}>
                    <Paragraph style={styles.innerCardValue} adjustsFontSizeToFit numberOfLines={1}>{animatedToday.toFixed(1)} L</Paragraph>
                    <Paragraph style={styles.innerCardLabel} numberOfLines={1}>Gastos Hoje</Paragraph>
                  </View>
                </Surface>
                <Surface style={[styles.innerCard, { backgroundColor: theme.colors.cardGreen, marginLeft: 8 }]}>
                  <List.Icon icon="leaf" color={theme.colors.success} />
                  <View style={{flex: 1}}>
                    <Paragraph style={styles.innerCardValue} adjustsFontSizeToFit numberOfLines={1}>{animatedSavings.toFixed(1)} L</Paragraph>
                    <Paragraph style={styles.innerCardLabel} numberOfLines={1}>Economia Hoje</Paragraph>
                  </View>
                </Surface>
              </View>
            </Card.Content>
          </Card>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 200 }}>
          <SegmentedButtons value={filter} onValueChange={setFilter} style={styles.filterButtons} buttons={[ { value: 'hoje', label: 'Hoje' }, { value: 'semana', label: '7d' }, { value: 'mes', label: '30d' }, ]} />
          <MotiView key={filter} from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing', duration: 400 }}>
            <Card style={styles.card} elevation={2}>
              <Card.Content style={{alignItems: 'center'}}>
                <Title style={{alignSelf: 'flex-start'}}>Consumo por Período</Title>
                <View style={{paddingTop: 16, width: '100%', alignItems: 'center'}}>
                  <LineChart 
                    width={chartWidth}
                    data={chartData[filter]} 
                    color1={theme.colors.primary} 
                    dataPointsColor1={theme.colors.primary} 
                    curved 
                    thickness1={3} 
                    yAxisTextStyle={{color: theme.colors.placeholder, fontSize: 10}} 
                    xAxisLabelTextStyle={{color: theme.colors.placeholder, fontSize: 10}} 
                    startFillColor1={theme.colors.cardBlue} 
                    endFillColor1={theme.colors.cardBlue} 
                    initialSpacing={10}
                  />
                </View>
              </Card.Content>
            </Card>
          </MotiView>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 300 }}>
          <View style={styles.navigationCardsContainer}>
            <MotiPressable animate={({ pressed }) => ({ scale: pressed ? 0.96 : 1 })} style={{flex: 1}} onPress={() => console.log('Relatório Pressionado')}>
              <Card style={styles.navCard} elevation={2}>
                <Card.Content style={{paddingHorizontal: 4}}>
                    <List.Item title="Relatórios" description="Detalhes" left={props => <List.Icon {...props} icon="file-chart" />} titleStyle={{fontSize: 14, fontWeight: 'bold'}} descriptionStyle={{fontSize: 12}} />
                </Card.Content>
              </Card>
            </MotiPressable>
            <View style={{width: 16}} />
            <MotiPressable animate={({ pressed }) => ({ scale: pressed ? 0.96 : 1 })} style={{flex: 1}} onPress={() => console.log('Metas Pressionado')}>
              <Card style={[styles.navCard, { backgroundColor: theme.colors.cardGreen }]} elevation={2}>
                <Card.Content style={{paddingHorizontal: 4}}>
                    <List.Item title="Metas" description="Objetivos" left={props => <List.Icon {...props} icon="target" color={theme.colors.success} />} titleStyle={{color: theme.colors.success, fontSize: 14, fontWeight: 'bold'}} descriptionStyle={{fontSize: 12}} />
                </Card.Content>
              </Card>
            </MotiPressable>
          </View>
        </MotiView>

        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500, delay: 400 }}>
          <Card style={styles.card} elevation={2}>
            <Card.Content>
              <Title>Histórico Recente</Title>
              {recentHistory.map((item, index) => (
                <MotiView key={item.id} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ type: 'timing', delay: 100 + index * 100 }}>
                  <List.Item title={item.description} description={item.time} titleNumberOfLines={1} left={props => <List.Icon {...props} icon={item.icon} />} right={() => <Text style={{ color: item.type === 'expense' ? theme.colors.danger : theme.colors.success, fontWeight: '500', alignSelf: 'center' }}>{item.value}</Text>} style={index === 0 && { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16, marginTop: 10}} />
                </MotiView>
              ))}
            </Card.Content>
          </Card>
        </MotiView>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 48 },
  card: { marginBottom: 20, borderRadius: theme.roundness },
  mainCard: { backgroundColor: theme.colors.surface, ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } }, android: { elevation: 8 } }) },
  cardSubtitle: { color: theme.colors.placeholder, marginBottom: 4, fontSize: 15, fontWeight: '500' },
  mainConsumptionRow: { flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap' },
  mainConsumptionText: { fontSize: 52, fontWeight: '800', color: theme.colors.primary, lineHeight: 60 },
  consumptionUnit: { fontSize: 22, fontWeight: '500', color: theme.colors.placeholder, paddingBottom: 8, marginLeft: 6 },
  comparisonText: { fontSize: 15, fontWeight: '600', marginTop: 6 },
  innerCardsContainer: { flexDirection: 'row', marginTop: 24 },
  innerCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 12, flex: 1 },
  innerCardValue: { fontSize: 18, fontWeight: 'bold' },
  innerCardLabel: { fontSize: 13, color: theme.colors.placeholder },
  filterButtons: { marginBottom: 20, alignSelf: 'center', width: '100%', maxWidth: 400 },
  navigationCardsContainer: { flexDirection: 'row', marginBottom: 20 },
  navCard: { flex: 1, borderRadius: theme.roundness, justifyContent: 'center' },
});