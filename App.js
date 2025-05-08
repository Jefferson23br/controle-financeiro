// DashboardLayout.js
import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;

export default function DashboardLayout() {
  const dataDespesas = [
    { name: "Alimentação", population: 250, color: "#FF6384", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Transporte", population: 150, color: "#36A2EB", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Moradia", population: 100, color: "#FFCE56", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  ];

  const dataReceitas = [
    { name: "Salário", population: 800, color: "#4BC0C0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Freelancer", population: 200, color: "#9966FF", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  ];

  return (
    <ScrollView style={{ padding: 16, backgroundColor: '#fff' }}>
      {/* Botões de ação */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button title="+ Receita" onPress={() => {}} />
        <Button title="+ Despesa" onPress={() => {}} />
      </View>

      {/* Saldos */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Saldo Total de Contas: R$ 1.500,00</Text>
        <Text style={{ fontSize: 16, color: 'red' }}>Contas a Pagar (7 dias): R$ 350,00</Text>
      </View>

      {/* Gráfico Despesas */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Despesas por Categoria</Text>
      <PieChart
        data={dataDespesas}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />

      {/* Gráfico Receitas */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 8 }}>Receitas por Categoria</Text>
      <PieChart
        data={dataReceitas}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />
    </ScrollView>
  );
}
