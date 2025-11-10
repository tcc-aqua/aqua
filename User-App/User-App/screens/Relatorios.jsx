import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text as RNText } from 'react-native';
import {
  SegmentedButtons,
  Card,
  List,
  Title,
  Paragraph,
  Icon,
} from 'react-native-paper';
// Importações do Skia
import { Canvas, Rect, Text } from "@shopify/react-native-skia";

const screenWidth = Dimensions.get('window').width;

const reportData = [
  { date: '01/11', consumption: 170, savings: 5 },
  { date: '02/11', consumption: 120, savings: 15 },
  { date: '03/11', consumption: 140, savings: 12 },
  { date: '04/11', consumption: 110, savings: 20 },
  { date: '05/11', consumption: 165, savings: 8 },
  { date: '06/11', consumption: 150, savings: 10 },
  { date: '07/11', consumption: 130, savings: 18 },
];

const LOW_CONSUMPTION_THRESHOLD = 130;
const HIGH_CONSUMPTION_THRESHOLD = 160;

// Função de cor, agora fora do componente para ser acessada pelo SkiaChart
const getBarColor = (consumption) => {
  if (consumption >= HIGH_CONSUMPTION_THRESHOLD) return '#f31212ff';
  if (consumption < LOW_CONSUMPTION_THRESHOLD) return '#2ecc71';
  return '#3498db';
};

// --- NOSSO NOVO COMPONENTE DE GRÁFICO COM SKIA ---
const SkiaBarChart = ({ data, width, height }) => {
  const PADDING = { top: 30, bottom: 30, left: 10, right: 10 };
  const BAR_WIDTH = 35;
  const VISUAL_BASE_HEIGHT = 20;

  const chartHeight = height - PADDING.top - PADDING.bottom;
  const chartWidth = width - PADDING.left - PADDING.right;

  const values = data.map(d => d.consumption);
  const minConsumption = Math.min(...values);
  const maxConsumption = Math.max(...values);
  const dataRange = maxConsumption - minConsumption;

  const totalBarWidth = data.length * BAR_WIDTH;
  const totalSpacing = chartWidth - totalBarWidth;
  const gapWidth = data.length > 1 ? totalSpacing / (data.length - 1) : 0;

  return (
    <Canvas style={{ width, height }}>
      {data.map((item, index) => {
        const barHeight = dataRange === 0 
          ? chartHeight
          : ((item.consumption - minConsumption) / dataRange) * (chartHeight - VISUAL_BASE_HEIGHT) + VISUAL_BASE_HEIGHT;
        
        const x = PADDING.left + index * (BAR_WIDTH + gapWidth);
        const y = PADDING.top + chartHeight - barHeight;

        return (
          <React.Fragment key={index}>
            <Rect x={x} y={y} width={BAR_WIDTH} height={barHeight} color={getBarColor(item.consumption)} rx={4} />
            <Text x={x + BAR_WIDTH / 2 - 15} y={y - 8} text={`${item.consumption}`} color="black" />
            <Text x={x + BAR_WIDTH / 2 - 15} y={height - 10} text={item.date} color="gray" />
          </React.Fragment>
        );
      })}
    </Canvas>
  );
};

const ReportsScreen = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [viewMode, setViewMode] = useState('graph');

  // Os cálculos de resumo continuam os mesmos
  const totalConsumption = reportData.reduce((acc, item) => acc + item.consumption, 0);
  const totalSavings = reportData.reduce((acc, item) => acc + item.savings, 0);
  const dailyAverage = Math.round(totalConsumption / reportData.length);
  const bestDay = reportData.reduce(
    (best, current) => (current.consumption < best.consumption ? current : best),
    reportData[0]
  );

  const renderContent = () => {
    if (viewMode === 'graph') {
      return (
        <Card style={styles.card}>
          <Card.Content style={styles.chartCardContent}>
            <Title style={styles.chartTitle}>Consumo Diário (Litros)</Title>
            <SkiaBarChart
              data={reportData}
              width={screenWidth - 40}
              height={250}
            />
          </Card.Content>
        </Card>
      );
    }

    return (
      <View>
        {reportData.map((item, index) => (
          <Card key={index} style={styles.card}>
            <List.Item
              title={`Consumo: ${item.consumption} L`}
              description={`Economia: ${item.savings} L`}
              left={props => <List.Icon {...props} icon="calendar" />}
              right={props => <Paragraph {...props} style={styles.reportDate}>{item.date}</Paragraph>}
            />
          </Card>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Controles do Topo */}
      <View style={styles.controlsContainer}>
        <SegmentedButtons
          value={timeframe}
          onValueChange={setTimeframe}
          buttons={[
            { value: '7d', label: '7 Dias' },
            { value: '30d', label: '30 Dias' },
            { value: '90d', label: '90 Dias' },
          ]}
          style={styles.segmentedButton}
        />
        <SegmentedButtons
          value={viewMode}
          onValueChange={setViewMode}
          buttons={[
            { value: 'graph', label: 'Gráfico', icon: 'chart-bar' },
            { value: 'list', label: 'Lista', icon: 'format-list-bulleted' },
          ]}
          style={styles.segmentedButton}
        />
      </View>
      
      {/* Área de Conteúdo Principal */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      
      {/* Grade de Resumo */}
      <View style={styles.summaryGridContainer}>
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <Icon source="water-outline" size={30} color="#3498db" />
              <View>
                <Paragraph style={styles.summaryLabel}>Consumo Total</Paragraph>
                <Title style={styles.summaryValue}>{totalConsumption} L</Title>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <Icon source="leaf-outline" size={30} color="#2ecc71" />
              <View>
                <Paragraph style={styles.summaryLabel}>Economia</Paragraph>
                <Title style={styles.summaryValue}>{totalSavings} L</Title>
              </View>
            </Card.Content>
          </Card>
        </View>
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <Icon source="chart-line" size={30} color="#9b59b6" />
              <View>
                <Paragraph style={styles.summaryLabel}>Média Diária</Paragraph>
                <Title style={styles.summaryValue}>{dailyAverage} L</Title>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryCardContent}>
              <Icon source="trophy-outline" size={30} color="#f1c40f" />
              <View>
                <Paragraph style={styles.summaryLabel}>Melhor Dia</Paragraph>
                <Title style={styles.summaryValue}>{bestDay.consumption} L</Title>
                <Paragraph style={styles.bestDayDate}>({bestDay.date})</Paragraph>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    controlsContainer: { padding: 10, backgroundColor: '#fff' },
    segmentedButton: { marginBottom: 10 },
    contentContainer: { paddingHorizontal: 10, alignItems: 'center' },
    chartTitle: { textAlign: 'center', marginBottom: 10 },
    card: { marginBottom: 10, width: screenWidth - 20 },
    reportDate: { alignSelf: 'center', marginRight: 10, color: '#666' },
    summaryGridContainer: { paddingHorizontal: 10, marginTop: 10, marginBottom: 20 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryCard: { width: '48%' },
    summaryCardContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 5, paddingVertical: 15 },
    summaryLabel: { fontSize: 12, color: '#666' },
    summaryValue: { fontSize: 18, lineHeight: 20 },
    bestDayDate: { fontSize: 11, lineHeight: 12, color: '#666' },
    chartCardContent: {
      alignItems: 'center',
      paddingHorizontal: 0,
      paddingVertical: 10,
    },
});

export default ReportsScreen;