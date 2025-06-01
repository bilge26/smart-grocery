import React from 'react';
import MainNavigator from './src/navigators/MainNavigator';
import { PlanProvider } from './src/context/PlanContext';
import ErrorBoundary from './src/components/ErrorBoundary'; 

export default function App() {
  return (
    <ErrorBoundary>
    <PlanProvider>
        <MainNavigator />
    </PlanProvider>
    </ErrorBoundary>
  );
}