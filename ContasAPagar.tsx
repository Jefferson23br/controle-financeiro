import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { getLancamentos } from './database';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ContasAPagar'>;

const screenWidth = Dimensions.get('window').width;

const ContasAPagar = () => {
  const navigation = useNavigation<NavigationProp>();
  const [lancamentos, setLancamentos] = useState<any[]>([]);

  const fetchLancamentos = async () => {
    await getLancamentos((lancamentosData: any[]) => {
      setLancamentos(lancamentosData);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLancamentos();
    }, [])
  );

  const renderLancamento = ({ item }: { item: any }) => {
    const dataFormatada = item.data.split('-').reverse().join('/');

    return (
      <View style={styles.lancamentoContainer}>
        <View style={styles.lancamentoHeader}>
          <Text style={styles.lancamentoTitle}>
            {item.conta} - {item.categoria}
          </Text>
          <Pressable onPress={() => navigation.navigate('EditarLancamento', { lancamento: item })}>
            <Text style={styles.editButton}>Editar</Text>
          </Pressable>
        </View>
        <Text style={styles.descricaoText}>{item.descricao || 'Sem descrição'}</Text>
        <Text style={[styles.valorText, { color: item.tipo === 'receita' ? '#4CAF50' : '#F44336' }]}>
          {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
        </Text>
        <Text style={styles.dataText}>Data: {dataFormatada}</Text>
        <Text style={styles.statusText}>Status: {item.status === 'pago' ? 'Pago' : 'Não Pago'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Movimentações</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('LancamentoReceita')}
        >
          <Text style={styles.buttonText}>Lançar Receita</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('LancamentoDespesa')}
        >
          <Text style={styles.buttonText}>Lançar Despesa</Text>
        </Pressable>
      </View>
      <FlatList
        data={lancamentos}
        renderItem={renderLancamento}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noDataText}>Nenhum lançamento encontrado.</Text>}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: screenWidth - 32,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 16,
    width: (screenWidth - 48) / 2,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  lancamentoContainer: {
    backgroundColor: '#2D3A3A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: screenWidth - 32,
  },
  lancamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lancamentoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
  editButton: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descricaoText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  valorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dataText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#fff',
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default ContasAPagar;