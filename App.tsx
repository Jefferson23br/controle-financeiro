import React, { useEffect } from 'react';
import AppNavigator from './AppNavigator';
import { initDatabase } from './database';

const App = () => {
  useEffect(() => {
    initDatabase();
  }, []);

  return <AppNavigator />;
};

export default App;