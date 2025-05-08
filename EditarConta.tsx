import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import { addConta, updateConta, getContas } from './database';

type NavigationProp = StackNavigationProp<RootStackParamList, 'EditarConta'>;
type RoutePropType = RouteProp<RootStackParamList, 'EditarConta'>;

const screenWidth = Dimensions.get('window').width;

const EditarConta = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const contaId = route.params?.contaId;

  const [nome, setNome] = useState('');

  useEffect(() => {
    if (contaId) {
      // Carregar os dados da conta para edição
      getContas((contas) => {
        const conta = contas.find((c) => c.id === contaId);
        if (conta) {
          setNome(conta.nome);
        }
      });
    }
  }, [contaId]);

  const handleSubmit = async () => {
    if (!nome) {
      Alert.alert('Erro', 'Por favor, preencha o nome da conta.');
      return;
    }

    if (contaId) {
      // Editar conta existente
      await updateConta(contaId, nome, (success) => {
        if (success) {
          Alert.alert('Sucesso', 'Conta atualizada com sucesso!');
          navigation.goBack();
        } else {
          Alert.alert('Erro', 'Falha ao atualizar a conta.');
        }
      });
    } else {
      // Criar nova conta
      await addConta(nome, (success) => {
        if (success) {
          Alert.alert('Sucesso', 'Conta criada com sucesso!');
          navigation.goBack();
        } else {
          Alert.alert('Erro', 'Falha ao criar a conta.');
        }
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.headerText}>
        {contaId ? 'Editar Conta' : 'Nova Conta'}
      </Text>

      <Text style={styles.label}>Nome da Conta:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome da conta"
        placeholderTextColor="#888"
      />

      <Button
        title={contaId ? 'Salvar Alterações' : 'Criar Conta'}
        onPress={handleSubmit}
        color="#4CAF50"
      />
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
    width: screenWidth - 32,
  },
});

export default EditarConta;