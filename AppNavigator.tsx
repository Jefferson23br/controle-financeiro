import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import DetalhesContas from './DetalhesContas';
import LancamentoReceita from './LancamentoReceita';
import LancamentoDespesa from './LancamentoDespesa';
import DetalhesGraficos from './DetalhesGraficos';
import ContasAPagar from './ContasAPagar';
import GerenciarCategorias from './GerenciarCategorias';
import Configuracoes from './Configuracoes';
import EditarConta from './EditarConta';
import EditarLancamento from './EditarLancamento';
import { RootStackParamList } from './types';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Criar o Stack Navigator para navegação entre telas
const Stack = createStackNavigator<RootStackParamList>();

// Criar o Tab Navigator para o menu inferior
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'ContasAPagar') {
            iconName = 'list-outline';
          } else if (route.name === 'LancamentoReceita') {
            iconName = 'add-circle-outline';
          } else if (route.name === 'LancamentoDespesa') {
            iconName = 'remove-circle-outline';
          } else if (route.name === 'DetalhesContas') {
            iconName = 'wallet-outline';
          } else if (route.name === 'GerenciarCategorias') {
            iconName = 'settings-outline';
          } else if (route.name === 'Configuracoes') {
            iconName = 'cog-outline';
          } else {
            iconName = 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#1C2526',
          borderTopColor: '#2D3A3A',
        },
        headerStyle: {
          backgroundColor: '#1C2526',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: 'Visão Geral' }} />
      <Tab.Screen name="ContasAPagar" component={ContasAPagar} options={{ title: 'Movimentações' }} />
      <Tab.Screen name="LancamentoReceita" component={LancamentoReceita} options={{ title: 'Nova Receita' }} />
      <Tab.Screen name="LancamentoDespesa" component={LancamentoDespesa} options={{ title: 'Nova Despesa' }} />
      <Tab.Screen name="DetalhesContas" component={DetalhesContas} options={{ title: 'Contas' }} />
      <Tab.Screen name="GerenciarCategorias" component={GerenciarCategorias} options={{ title: 'Categorias' }} />
      <Tab.Screen name="Configuracoes" component={Configuracoes} options={{ title: 'Configurações' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1C2526',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false, title: 'Home' }}
        />
        <Stack.Screen
          name="DetalhesGraficos"
          component={DetalhesGraficos}
          options={{ title: 'Detalhes Gráficos' }}
        />
        <Stack.Screen
          name="EditarConta"
          component={EditarConta}
          options={{ title: 'Editar Conta' }}
        />
        <Stack.Screen
          name="EditarLancamento"
          component={EditarLancamento}
          options={{ title: 'Editar Lançamento' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;