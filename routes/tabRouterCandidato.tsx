import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginUser from '../src/pages/acessoUser/loginUser';
import LoginEmpresa from '../src/pages/acessoEmpresa/acessoEmpresa'
import ConfiguracoesUser from '../src/pages/acessoUser/ConfiguracoesPage/Configuracoes';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PerfilUser from '../src/pages/acessoUser/PerfilUser';
export default function TabRouterCandidato() {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator
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
                component={LoginUser}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name='Perfil'
                component={PerfilUser}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name='Configurações'
                component={ConfiguracoesUser}
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