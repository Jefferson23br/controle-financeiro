import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addCategoria, getCategorias, updateCategoria, deleteCategoria } from './database';

const GerenciarCategorias = () => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita');
  const [editId, setEditId] = useState<number | null>(null);

  const fetchCategorias = async () => {
    await getCategorias((categoriasData) => {
      setCategorias(categoriasData);
    });
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async () => {
    if (!nome) {
      Alert.alert('Erro', 'Por favor, preencha o nome da categoria.');
      return;
    }

    if (editId) {
      // Editar categoria existente
      await updateCategoria(editId, nome, tipo, (success) => {
        if (success) {
          Alert.alert('Sucesso', 'Categoria atualizada com sucesso!');
          fetchCategorias();
          setNome('');
          setTipo('receita');
          setEditId(null);
        } else {
          Alert.alert('Erro', 'Falha ao atualizar a categoria.');
        }
      });
    } else {
      // Adicionar nova categoria
      await addCategoria(nome, tipo, (success) => {
        if (success) {
          Alert.alert('Sucesso', 'Categoria adicionada com sucesso!');
          fetchCategorias();
          setNome('');
          setTipo('receita');
        } else {
          Alert.alert('Erro', 'Falha ao adicionar a categoria.');
        }
      });
    }
  };

  const handleEdit = (categoria: any) => {
    setEditId(categoria.id);
    setNome(categoria.nome);
    setTipo(categoria.tipo);
  };

  const handleDelete = async (id: number) => {
    await deleteCategoria(id, (success) => {
      if (success) {
        Alert.alert('Sucesso', 'Categoria deletada com sucesso!');
        fetchCategorias();
      } else {
        Alert.alert('Erro', 'Falha ao deletar a categoria. Pode haver lançamentos associados a ela.');
      }
    });
  };

  const renderCategoria = ({ item }: { item: any }) => (
    <View style={styles.categoriaItem}>
      <Text style={styles.categoriaText}>Nome: {item.nome}</Text>
      <Text style={styles.categoriaText}>Tipo: {item.tipo === 'receita' ? 'Receita' : 'Despesa'}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Editar" onPress={() => handleEdit(item)} color="#4CAF50" />
        <Button title="Deletar" onPress={() => handleDelete(item.id)} color="#F44336" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {editId ? 'Editar Categoria' : 'Adicionar Categoria'}
      </Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome da categoria"
        placeholderTextColor="#888"
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

      <Button
        title={editId ? 'Atualizar Categoria' : 'Adicionar Categoria'}
        onPress={handleSubmit}
        color={editId ? '#4CAF50' : '#2196F3'}
      />

      <Text style={styles.headerText}>Lista de Categorias</Text>
      <FlatList
        data={categorias}
        renderItem={renderCategoria}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.noDataText}>Nenhuma categoria encontrada.</Text>
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
    marginTop: 16,
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
  },
  picker: {
    backgroundColor: '#2D3A3A',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  categoriaItem: {
    backgroundColor: '#2D3A3A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  categoriaText: {
    fontSize: 16,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default GerenciarCategorias;