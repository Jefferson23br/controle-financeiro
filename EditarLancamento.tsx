import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList, Conta } from './types';
import { updateLancamento, getCategorias, getContas } from './database';

type NavigationProp = StackNavigationProp<RootStackParamList, 'EditarLancamento'>;
type RoutePropType = RouteProp<RootStackParamList, 'EditarLancamento'>;

const screenWidth = Dimensions.get('window').width;

const EditarLancamento = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const lancamento = route.params.lancamento;

  const [categorias, setCategorias] = useState<any[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [tipo, setTipo] = useState<'receita' | 'despesa'>(lancamento.tipo);
  const [categoriaId, setCategoriaId] = useState<number | null>(lancamento.categoria_id);
  const [contaId, setContaId] = useState<number | null>(lancamento.conta_id);
  const [valor, setValor] = useState(lancamento.valor.toString());
  const [data, setData] = useState(lancamento.data);
  const [descricao, setDescricao] = useState(lancamento.descricao || '');
  const [status, setStatus] = useState<'pago' | 'nao_pago'>(lancamento.status);

  const fetchData = async () => {
    await getCategorias((categoriasData) => {
      const filteredCategorias = categoriasData.filter((cat: any) => cat.tipo === tipo);
      setCategorias(filteredCategorias);
    });

    await getContas((contasData: Conta[]) => {
      setContas(contasData);
    });
  };

  useEffect(() => {
    fetchData();
  }, [tipo]);

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

    await updateLancamento(
      lancamento.id,
      tipo,
      categoriaId,
      contaId,
      valorNum,
      data,
      descricao,
      status,
      (success) => {
        if (success) {
          Alert.alert('Sucesso', 'Lançamento atualizado com sucesso!');
          Keyboard.dismiss();
          navigation.goBack();
        } else {
          Alert.alert('Erro', 'Falha ao atualizar o lançamento.');
        }
      }
    );
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.headerText}>Editar Lançamento</Text>

        <Text style={styles.label}>Tipo:</Text>
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Receita" value="receita" />
          <Picker.Item label="Despesa" value="despesa" />
        </Picker>

        <Text style={styles.label}>Categoria:</Text>
        <Picker
          selectedValue={categoriaId?.toString() || ''}
          onValueChange={(itemValue) => setCategoriaId(itemValue ? parseInt(itemValue) : null)}
          style={styles.picker}
        >
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
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <Text style={styles.label}>Data (DD-MM-YYYY):</Text>
        <TextInput
          style={styles.input}
          value={data}
          onChangeText={setData}
          placeholder="Ex: 26-04-2025"
          placeholderTextColor="#888"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <Text style={styles.label}>Descrição:</Text>
        <TextInput
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Digite uma descrição (opcional)"
          placeholderTextColor="#888"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
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

        <View style={styles.buttonContainer}>
          <Button title="Cancelar" onPress={handleCancel} color="#F44336" />
          <Button title="Salvar Alterações" onPress={handleSubmit} color="#4CAF50" />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
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
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  input: {
    backgroundColor: '#2D3A3A',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    width: screenWidth - 32,
  },
  picker: {
    backgroundColor: '#2D3A3A',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    width: screenWidth - 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: screenWidth - 32,
  },
});

export default EditarLancamento;