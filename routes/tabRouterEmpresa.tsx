import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginEmpresa from '../src/pages/acessoEmpresa/acessoEmpresa'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PublicarVaga from '../src/pages/acessoEmpresa/publicarVagaEmpresa/publicarVaga';
import ConfiguracoesEmpresa from '../src/pages/acessoEmpresa/ConfiguracoesPageEmpresa/ConfiguracoesEmpresa';
import VagasPublicadas from '../src/pages/acessoEmpresa/VagasCriadasEmpresa/VagasPublicadas';

export default function TabRouterEmpresa() {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            initialRouteName='Home'
            screenOptions={{
                tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 10, paddingTop: 5 },
                tabBarLabelStyle: {
                    fontSize: 14, // Ajusta o tamanho do texto da aba
                }, // Personalize conforme necessário
                tabBarActiveTintColor: 'black', // Cor do ícone ativo
                tabBarInactiveTintColor: '#8e8e93', // Cor do ícone inativo,

            }}>
            <Tab.Screen
                name='Home'
                component={LoginEmpresa}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name='Publicar Vaga'
                component={PublicarVaga}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="plus" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name='Publicações'
                component={VagasPublicadas}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="book-account-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name='Configurações'
                component={ConfiguracoesEmpresa}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cog" color={color} size={size} />
                    ),
                }}
            />


        </Tab.Navigator>
    )
}