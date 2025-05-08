import React, { useEffect } from 'react';
import AppNavigator from './AppNavigator';
import { initDatabase } from './database';

const App = () => {
  useEffect(() => {
    initDatabase(); // Inicializar o banco de dados ao carregar o app
  }, []);

  return <AppNavigator />;
};

export default App;