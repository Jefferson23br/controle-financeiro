import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Lancamento } from './types';
import { getLancamentos } from './database'; // Ajustado de ../database para ./database

type DetalhesGraficosRouteProp = RouteProp<RootStackParamList, 'DetalhesGraficos'>;

type Props = {
  route: DetalhesGraficosRouteProp;
};

const DetalhesGraficos = ({ route }: Props) => {
  const tipo = route.params?.tipo;
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  const fetchLancamentos = async () => {
    if (!tipo) {
      setLancamentos([]);
      return;
    }

    await getLancamentos((lancamentosData: Lancamento[]) => {
      const filtered = lancamentosData.filter(
        (lanc: Lancamento) => lanc.tipo === tipo && lanc.status === 'pago'
      );
      setLancamentos(filtered);
    });
  };

  useEffect(() => {
    fetchLancamentos();
  }, [tipo]);

  const renderLancamento = ({ item }: { item: Lancamento }) => (
    <View style={styles.lancamentoItem}>
      <Text style={styles.lancamentoText}>{item.tipo === 'receita' ? 'Receita' : 'Despesa'}</Text>
      <Text style={styles.lancamentoText}>Categoria: {item.categoria}</Text>
      <Text style={styles.lancamentoText}>Conta: {item.conta}</Text>
      <Text style={styles.lancamentoText}>Valor: R$ {item.valor.toFixed(2)}</Text>
      <Text style={styles.lancamentoText}>Data: {item.data}</Text>
      <Text style={styles.lancamentoText}>Descrição: {item.descricao || 'N/A'}</Text>
      <Text style={styles.lancamentoText}>Status: {item.status === 'pago' ? 'Pago' : 'Não Pago'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {tipo === 'receita' ? 'Detalhes das Receitas' : tipo === 'despesa' ? 'Detalhes das Despesas' : 'Detalhes'}
      </Text>
      <FlatList
        data={lancamentos}
        renderItem={renderLancamento}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.noDataText}>Nenhum lançamento encontrado.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C2526',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  lancamentoItem: {
    backgroundColor: '#2D3A3A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  lancamentoText: {
    fontSize: 16,
    color: '#fff',
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default DetalhesGraficos;