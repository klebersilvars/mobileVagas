import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../pages/acessoUser/Login';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Login" 
                component={Login} 
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
} 