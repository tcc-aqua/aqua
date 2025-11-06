import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Text } from 'react-native';
import {
  SegmentedButtons,
  Card,
  List,
  Title,
  Paragraph,
  Icon,
} from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';

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

const ReportsScreen = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [viewMode, setViewMode] = useState('graph');

  const LOW_CONSUMPTION_THRESHOLD = 130;
  const HIGH_CONSUMPTION_THRESHOLD = 160;

  const getBarColor = (consumption) => {
    if (consumption >= HIGH_CONSUMPTION_THRESHOLD) return '#f39c12';
    if (consumption < LOW_CONSUMPTION_THRESHOLD) return '#2ecc71';
    return '#3498db';
  };

  const minConsumption = Math.min(...reportData.map(item => item.consumption));
  const visualBaseHeight = 50; 
  const transformedData = reportData.map(item => {
    return (item.consumption - minConsumption) + visualBaseHeight;
  });

  const barChartData = {
    labels: reportData.map(item => item.date),
    datasets: [
      {
        data: transformedData,
        colors: reportData.map(item => (opacity = 1) => getBarColor(item.consumption)),
      },
    ],
  };
  
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 0.1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    // withVerticalLabels: false, // Esta propriedade falhou, então removemos.
  };

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
            <BarChart
              style={styles.chartStyle}
              data={barChartData}
              width={screenWidth - 60}
              height={250}
              chartConfig={chartConfig}
              withCustomBarColorFromData={true}
              flatColor={true}
              withInnerLines={false}
              fromZero={true}
              renderDotContent={({ x, y, index }) => (
                <Text
                  key={index}
                  style={{
                    position: 'absolute',
                    left: x - 15,
                    top: y + 5,
                    color: '#000',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  {reportData[index].consumption}
                </Text>
              )}
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
      <View style={styles.controlsContainer}>
        <SegmentedButtons
          value={timeframe}
          onValueChange={setTimeframe}
          buttons={[ { value: '7d', label: '7 Dias' }, { value: '30d', label: '30 Dias' }, { value: '90d', label: '90 Dias' } ]}
          style={styles.segmentedButton}
        />
        <SegmentedButtons
          value={viewMode}
          onValueChange={setViewMode}
          buttons={[ { value: 'graph', label: 'Gráfico', icon: 'chart-bar' }, { value: 'list', label: 'Lista', icon: 'format-list-bulleted' } ]}
          style={styles.segmentedButton}
        />
      </View>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      
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
  chartStyle: {
    borderRadius: 16,
  },
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
  },
});

export default ReportsScreen;