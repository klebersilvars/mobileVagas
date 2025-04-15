import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useVersionCheck } from './hooks/useVersionCheck';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
    // Verificar versão do app
    useVersionCheck();

    return (
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
    );
} 