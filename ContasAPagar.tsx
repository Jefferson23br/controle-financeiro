import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Lancamento } from './types';
import { getLancamentos } from './database';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ContasAPagar'>;

const ContasAPagar = () => {
  const navigation = useNavigation<NavigationProp>();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  const fetchLancamentos = async () => {
    await getLancamentos((lancamentosData: Lancamento[]) => {
      // Exibir todos os lançamentos, independentemente do status
      setLancamentos(lancamentosData);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLancamentos();
    }, [])
  );

  const renderLancamento = ({ item }: { item: Lancamento }) => {
    // Formatar a linha no estilo "Data Descrição Conta Categoria Valor Status"
    const statusText = item.status === 'pago' ? 'Pago' : 'Não Pago';
    const lancamentoText = `${item.data} ${item.descricao || 'Sem descrição'} ${item.conta} ${item.categoria} R$${item.valor.toFixed(2)} ${statusText}`;

    return (
      <Pressable
        style={styles.lancamentoItem}
        onPress={() => navigation.navigate('EditarLancamento', { lancamento: item })}
      >
        <Text style={styles.lancamentoText}>{lancamentoText}</Text>
        <Text style={styles.editText}>Toque para editar</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Movimentações</Text>
      <FlatList
        data={lancamentos}
        renderItem={renderLancamento}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noDataText}>Nenhuma movimentação encontrada.</Text>}
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
    marginBottom: 16,
  },
  lancamentoItem: {
    backgroundColor: '#2D3A3A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  lancamentoText: {
    fontSize: 16,
    color: '#fff',
  },
  editText: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ContasAPagar;