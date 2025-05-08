import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList, Conta } from './types';
import { addLancamento, getCategorias, getContas } from './database';

type NavigationProp = StackNavigationProp<RootStackParamList, 'LancamentoReceita'>;

const screenWidth = Dimensions.get('window').width;

const LancamentoReceita = () => {
  const navigation = useNavigation<NavigationProp>();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [contaId, setContaId] = useState<number | null>(null);
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState<'pago' | 'nao_pago'>('pago');

  const fetchData = async () => {
    await getCategorias((categoriasData) => {
      const filteredCategorias = categoriasData.filter((cat: any) => cat.tipo === 'receita');
      setCategorias(filteredCategorias);
    });

    await getContas((contasData: Conta[]) => {
      setContas(contasData);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!categoriaId || !contaId || !valor || !data) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      Alert.alert('Erro', 'O valor deve ser um número positivo.');
      return;
    }

    await addLancamento(
      'receita',
      categoriaId,
      contaId,
      valorNum,
      data,
      descricao,
      status,
      (success) => {
        if (success) {
          Alert.alert('Sucesso', 'Receita lançada com sucesso!');
          navigation.goBack();
        } else {
          Alert.alert('Erro', 'Falha ao lançar a receita.');
        }
      }
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.headerText}>Lançar Receita</Text>

      <Text style={styles.label}>Categoria:</Text>
      <Picker
        selectedValue={categoriaId?.toString() || ''}
        onValueChange={(itemValue) => setCategoriaId(itemValue ? parseInt(itemValue) : null)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma categoria" value="" />
        {categorias.map((cat) => (
          <Picker.Item key={cat.id} label={cat.nome} value={cat.id.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Conta:</Text>
      <Picker
        selectedValue={contaId?.toString() || ''}
        onValueChange={(itemValue) => setContaId(itemValue ? parseInt(itemValue) : null)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma conta" value="" />
        {contas.map((conta) => (
          <Picker.Item key={conta.id} label={conta.nome} value={conta.id.toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Valor:</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        placeholder="Digite o valor"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Data (DD-MM-YYYY):</Text>
      <TextInput
        style={styles.input}
        value={data}
        onChangeText={setData}
        placeholder="Ex: 26-04-2025"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Digite uma descrição (opcional)"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Status:</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Pago" value="pago" />
        <Picker.Item label="Não Pago" value="nao_pago" />
      </Picker>

      <Button title="Salvar" onPress={handleSubmit} color="#4CAF50" />
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
    paddingBottom: 80, // Espaço extra no final para garantir que o botão "Salvar" seja acessível
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2D3A3A',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    width: screenWidth - 32, // Ajustar largura para caber na tela
  },
  picker: {
    backgroundColor: '#2D3A3A',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    width: screenWidth - 32, // Ajustar largura para caber na tela
  },
});

export default LancamentoReceita;