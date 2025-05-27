import React from 'react';
import MainNavigator from './src/navigators/MainNavigator';
import { PlanProvider } from './src/context/PlanContext';

export default function App() {
  return (
    <PlanProvider>
      <MainNavigator />
    </PlanProvider>
  );
}
