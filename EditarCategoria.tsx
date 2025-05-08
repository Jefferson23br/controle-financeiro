import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from './types';
import { addCategoria, updateCategoria, getCategoriaById } from './database';

type NavigationProp = StackNavigationProp<RootStackParamList, 'EditarCategoria'>;
type RoutePropType = RouteProp<RootStackParamList, 'EditarCategoria'>;

const screenWidth = Dimensions.get('window').width;

// Definir o tipo da categoria
type Categoria = {
  id: number;
  nome: string;
  tipo: 'receita' | 'despesa';
};

const EditarCategoria = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { categoriaId } = route.params || {};

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita');

  useEffect(() => {
    const fetchCategoria = async () => {
      if (categoriaId) {
        await getCategoriaById(categoriaId, (categoria: Categoria | null) => {
          if (categoria) {
            setNome(categoria.nome);
            setTipo(categoria.tipo);
          }
        });
      }
    };
    fetchCategoria();
  }, [categoriaId]);

  const handleSubmit = async () => {
    if (!nome) {
      Alert.alert('Erro', 'Por favor, preencha o nome da categoria.');
      return;
    }

    if (categoriaId) {
      await updateCategoria(categoriaId, nome, tipo, (success: boolean) => {
        if (success) {
          Alert.alert('Sucesso', 'Categoria atualizada com sucesso!');
          Keyboard.dismiss();
          navigation.goBack();
        } else {
          Alert.alert('Erro', 'Falha ao atualizar a categoria.');
        }
      });
    } else {
      await addCategoria(nome, tipo, (success: boolean) => {
        if (success) {
          Alert.alert('Sucesso', 'Categoria criada com sucesso!');
          Keyboard.dismiss();
          navigation.goBack();
        } else {
          Alert.alert('Erro', 'Falha ao criar a categoria.');
        }
      });
    }
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
        <Text style={styles.headerText}>
          {categoriaId ? 'Editar Categoria' : 'Nova Categoria'}
        </Text>

        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome da categoria"
          placeholderTextColor="#888"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <Text style={styles.label}>Tipo:</Text>
        <Picker
          selectedValue={tipo}
          onValueChange={(itemValue) => setTipo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Receita" value="receita" />
          <Picker.Item label="Despesa" value="despesa" />
        </Picker>

        <View style={styles.buttonContainer}>
          <Button title="Cancelar" onPress={handleCancel} color="#F44336" />
          <Button title="Salvar" onPress={handleSubmit} color="#4CAF50" />
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

export default EditarCategoria;