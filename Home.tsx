import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Lancamento, Conta } from './types';
import { getLancamentos, getContas } from './database';
import { PieChart } from 'react-native-chart-kit';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const screenWidth = Dimensions.get('window').width;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();
  const [receitasData, setReceitasData] = useState<any[]>([]);
  const [despesasData, setDespesasData] = useState<any[]>([]);
  const [saldoAtual, setSaldoAtual] = useState<number>(0);

  const fetchData = async () => {
    // Obter lançamentos
    await getLancamentos((lancamentosData: Lancamento[]) => {
      console.log('Lançamentos obtidos:', lancamentosData);

      const receitas = lancamentosData
        .filter((lanc: Lancamento) => lanc.tipo === 'receita' && lanc.status === 'pago')
        .reduce((acc: any, lanc: Lancamento) => {
          const existing = acc.find((item: any) => item.name === lanc.categoria);
          if (existing) {
            existing.value += lanc.valor;
          } else {
            acc.push({ name: lanc.categoria, value: lanc.valor });
          }
          return acc;
        }, []);

      const despesas = lancamentosData
        .filter((lanc: Lancamento) => lanc.tipo === 'despesa' && lanc.status === 'pago')
        .reduce((acc: any, lanc: Lancamento) => {
          const existing = acc.find((item: any) => item.name === lanc.categoria);
          if (existing) {
            existing.value += lanc.valor;
          } else {
            acc.push({ name: lanc.categoria, value: lanc.valor });
          }
          return acc;
        }, []);

      const totalReceitasChart = receitas.reduce((sum: number, item: any) => sum + item.value, 0);
      const receitasChartData = receitas.map((item: any, index: number) => ({
        name: `${item.name} (${totalReceitasChart > 0 ? ((item.value / totalReceitasChart) * 100).toFixed(1) : '0.0'}%)`,
        value: item.value,
        color: ['#4CAF50', '#81C784', '#A5D6A7'][index % 3],
        legendFontColor: '#fff',
        legendFontSize: 14,
      }));

      const totalDespesasChart = despesas.reduce((sum: number, item: any) => sum + item.value, 0);
      const despesasChartData = despesas.map((item: any, index: number) => ({
        name: `${item.name} (${totalDespesasChart > 0 ? ((item.value / totalDespesasChart) * 100).toFixed(1) : '0.0'}%)`,
        value: item.value,
        color: ['#F44336', '#EF5350', '#E57373'][index % 3],
        legendFontColor: '#fff',
        legendFontSize: 14,
      }));

      console.log('Receitas para o gráfico:', receitasChartData);
      console.log('Despesas para o gráfico:', despesasChartData);

      setReceitasData(receitasChartData);
      setDespesasData(despesasChartData);
    });

    // Obter o saldo das contas
    await getContas((contasData: Conta[]) => {
      console.log('Contas obtidas:', contasData);
      const saldoTotal = contasData.reduce((sum: number, conta: Conta) => {
        const totalReceitas = conta.lancamentos
          .filter((lanc: Lancamento) => lanc.tipo === 'receita' && lanc.status === 'pago')
          .reduce((sum: number, lanc: Lancamento) => sum + lanc.valor, 0);

        const totalDespesas = conta.lancamentos
          .filter((lanc: Lancamento) => lanc.tipo === 'despesa' && lanc.status === 'pago')
          .reduce((sum: number, lanc: Lancamento) => sum + lanc.valor, 0);

        return sum + (totalReceitas - totalDespesas);
      }, 0);
      setSaldoAtual(saldoTotal);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const chartConfig = {
    backgroundGradientFrom: '#1C2526',
    backgroundGradientTo: '#1C2526',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.headerText}>Visão Geral</Text>

      {/* Container do Saldo Atual com navegação */}
      <Pressable
        style={styles.saldoContainer}
        onPress={() => navigation.navigate('DetalhesContas')}
      >
        <Text style={styles.saldoLabel}>Saldo Atual:</Text>
        <Text style={[styles.saldoValue, { color: saldoAtual >= 0 ? '#4CAF50' : '#F44336' }]}>
          R$ {saldoAtual.toFixed(2)}
        </Text>
      </Pressable>

      {/* Caixas para Lançamento de Receita e Despesa */}
      <View style={styles.lancamentoContainer}>
        <Pressable
          style={[styles.lancamentoBox, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('LancamentoReceita')}
        >
          <Text style={styles.lancamentoText}>Lançar Receita</Text>
        </Pressable>
        <Pressable
          style={[styles.lancamentoBox, { backgroundColor: '#F44336' }]}
          onPress={() => navigation.navigate('LancamentoDespesa')}
        >
          <Text style={styles.lancamentoText}>Lançar Despesa</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionText}>Receitas</Text>
      {receitasData.length > 0 ? (
        <Pressable onPress={() => navigation.navigate('DetalhesGraficos', { tipo: 'receita' })}>
          <View style={styles.chartContainer}>
            <PieChart
              data={receitasData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </Pressable>
      ) : (
        <Text style={styles.noDataText}>Nenhuma receita encontrada.</Text>
      )}

      <Text style={styles.sectionText}>Despesas</Text>
      {despesasData.length > 0 ? (
        <Pressable onPress={() => navigation.navigate('DetalhesGraficos', { tipo: 'despesa' })}>
          <View style={styles.chartContainer}>
            <PieChart
              data={despesasData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </Pressable>
      ) : (
        <Text style={styles.noDataText}>Nenhuma despesa encontrada.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2526',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  saldoContainer: {
    backgroundColor: '#2D3A3A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    width: screenWidth - 32,
  },
  saldoLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  saldoValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  lancamentoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: screenWidth - 32,
  },
  lancamentoBox: {
    flex: 1,
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  lancamentoText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default Home;