import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Button, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { getCategorias } from './database';

type NavigationProp = StackNavigationProp<RootStackParamList, 'GerenciarCategorias'>;

const screenWidth = Dimensions.get('window').width;

const GerenciarCategorias = () => {
  const navigation = useNavigation<NavigationProp>();
  const [categorias, setCategorias] = useState<any[]>([]);

  const fetchCategorias = async () => {
    await getCategorias((categoriasData: any[]) => {
      setCategorias(categoriasData);
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCategorias();
    }, [])
  );

  const renderCategoria = ({ item }: { item: any }) => {
    return (
      <View style={styles.categoriaContainer}>
        <View style={styles.categoriaHeader}>
          <Text style={styles.categoriaTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.nome}
          </Text>
          <Pressable onPress={() => navigation.navigate('EditarCategoria', { categoriaId: item.id })}>
            <Text style={styles.editButton}>Editar</Text>
          </Pressable>
        </View>
        <Text style={styles.tipoText}>
          Tipo: {item.tipo === 'receita' ? 'Receita' : 'Despesa'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Categorias</Text>
        <Button
          title="Nova Categoria"
          onPress={() => navigation.navigate('EditarCategoria', {})}
          color="#4CAF50"
        />
      </View>
      <FlatList
        data={categorias}
        renderItem={renderCategoria}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.noDataText}>Nenhuma categoria encontrada.</Text>}
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
  categoriaContainer: {
    backgroundColor: '#2D3A3A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: screenWidth - 32,
  },
  categoriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaTitle: {
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
  tipoText: {
    fontSize: 16,
    color: '#fff',
  },
  noDataText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default GerenciarCategorias;