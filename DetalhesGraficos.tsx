import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { getLancamentos } from './database';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type GraficoRouteProp = RouteProp<RootStackParamList, 'DetalhesGraficos'>;

const DetalhesGraficos = () => {
  const route = useRoute<GraficoRouteProp>();
  const { tipo } = route.params;
  const [data, setData] = useState<any[]>([]);

  const fetchLancamentos = async () => {
    await getLancamentos((lancamentos) => {
      const filteredLancamentos = lancamentos.filter((lanc: any) => lanc.tipo === tipo);

      // Agrupar lançamentos por categoria
      const groupedByCategory = filteredLancamentos.reduce((acc: any, lanc: any) => {
        const categoria = lanc.categoria || 'Sem Categoria';
        if (!acc[categoria]) {
          acc[categoria] = { valor: 0, count: 0 };
        }
        acc[categoria].valor += lanc.valor;
        acc[categoria].count += 1;
        return acc;
      }, {});

      // Converter para formato de dados do gráfico
      const chartData = Object.keys(groupedByCategory).map((categoria, index) => ({
        name: categoria,
        valor: groupedByCategory[categoria].valor,
        color: getRandomColor(index),
        legendFontColor: '#fff',
        legendFontSize: 15,
      }));

      setData(chartData);
    });
  };

  useEffect(() => {
    fetchLancamentos();
  }, [tipo]);

  // Função para gerar cores aleatórias
  const getRandomColor = (index: number) => {
    const colors = [
      '#FF6F61',
      '#6B5B95',
      '#88B04B',
      '#F7CAC9',
      '#92A8D1',
      '#955251',
      '#B565A7',
      '#009B77',
    ];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Gráfico de {tipo === 'receita' ? 'Receitas' : 'Despesas'}
      </Text>
      {data.length > 0 ? (
        <PieChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundColor: '#1C2526',
            backgroundGradientFrom: '#1C2526',
            backgroundGradientTo: '#1C2526',
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="valor"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={styles.noDataText}>Nenhum dado disponível para exibir.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2526',
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default DetalhesGraficos;