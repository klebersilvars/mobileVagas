import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PageHome from '../src/pages/pageHome';
import PageLogin from '../src/pages/pageLogin';
import PageRegistroOne from '../src/pages/pageRegistroOne';
import PageRegistroTwo from '../src/pages/pageRegistroTwo';
import HeaderLeft from '../src/components/HeaderLeft/HeaderLeft';



const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="PageHome">
                <Stack.Screen
                    name="PageHome"
                    component={PageHome}
                    options={{ headerShown: false }} // Oculta o cabeçalho na tela principal
                />
                <Stack.Screen
                    name="PageLogin"
                    component={PageLogin}
                    options={{
                        headerShown: true,           // Exibe o cabeçalho
                        title: '',                   // Remove o título da tela
                        headerTransparent: true,     // Torna o cabeçalho transparente
                        headerLeft: () => (
                            // Use navigation dentro de um componente de tela
                            <HeaderLeft />
                        ),
                    }}/>
                <Stack.Screen
                    name="PageRegistroOne"
                    component={PageRegistroOne}
                    options={{
                        headerShown: true,           // Exibe o cabeçalho
                        title: '',                   // Remove o título da tela
                        headerTransparent: true,     // Torna o cabeçalho transparente
                        headerLeft: () => (
                            // Use navigation dentro de um componente de tela
                            <HeaderLeft />
                        ),
                    }}
                />
                <Stack.Screen
                    name="PageRegistroTwo"
                    component={PageRegistroTwo}
                    options={{
                        headerShown: true,           // Exibe o cabeçalho
                        title: '',                   // Remove o título da tela
                        headerTransparent: true,     // Torna o cabeçalho transparente
                        headerLeft: () => (
                            // Use navigation dentro de um componente de tela
                            <HeaderLeft />
                        ),
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}


