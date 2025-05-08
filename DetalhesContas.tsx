import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Button, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { getContas, addConta } from './database';

type NavigationProp = StackNavigationProp<RootStackParamList, 'DetalhesContas'>;

const screenWidth = Dimensions.get('window').width;

const DetalhesContas = () => {
  const navigation = useNavigation<NavigationProp>();
  const [contas, setContas] = useState<any[]>([]);

  const fetchContas = async () => {
    await getContas((contasData: any[]) => {
      setContas(contasData);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchContas();
    }, [])
  );

  const handleNovaConta = async () => {
    const nomeNovaConta = `Conta ${contas.length + 1}`;
    await addConta(nomeNovaConta, (success: boolean) => {
      if (success) {
        fetchContas();
      }
    });
  };

  const renderConta = ({ item }: { item: any }) => {
    const saldo = item.lancamentos.reduce((sum: number, lanc: any) => {
      return lanc.tipo === 'receita' ? sum + lanc.valor : sum - lanc.valor;
    }, 0);

    return (
      <View style={styles.contaContainer}>
        <View style={styles.contaHeader}>
          <Text style={styles.contaTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.nome}
          </Text>
          <Pressable onPress={() => navigation.navigate('EditarConta', { contaId: item.id })}>
            <Text style={styles.editButton}>Editar</Text>
          </Pressable>
        </View>
        <Text style={[styles.saldoText, { color: saldo >= 0 ? '#4CAF50' : '#F44336' }]}>
          Saldo: R$ {saldo.toFixed(2)}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Contas</Text>
        <Button title="Nova Conta" onPress={handleNovaConta} color="#4CAF50" />
      </View>
      <FlatList
        data={contas}
        renderItem={renderConta}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noDataText}>Nenhuma conta encontrada.</Text>}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: screenWidth - 32,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  contaContainer: {
    backgroundColor: '#2D3A3A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: screenWidth - 32,
  },
  contaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contaTitle: {
    fontSize: 20,
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
  saldoText: {
    fontSize: 16,
    color: '#fff',
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default DetalhesContas;