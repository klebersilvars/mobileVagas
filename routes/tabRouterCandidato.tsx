import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginUser from '../src/pages/acessoUser/loginUser';
import LoginEmpresa from '../src/pages/acessoEmpresa/acessoEmpresa'
import ConfiguracoesUser from '../src/pages/acessoUser/ConfiguracoesPage/Configuracoes';

export default function TabRouterCandidato() {
    const Tab = createBottomTabNavigator();
    return(
        <Tab.Navigator>
            <Tab.Screen 
            name='Home' 
            component={LoginUser}
            options={{
                headerShown: false,
            }}
            />

            <Tab.Screen 
            name='Configurações'
            component={ConfiguracoesUser}
            options={{
                headerShown: false,
            }}
            />
        </Tab.Navigator>
    )
}