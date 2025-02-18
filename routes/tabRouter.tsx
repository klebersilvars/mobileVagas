import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginUser from '../src/pages/acessoUser/loginUser';
import LoginEmpresa from '../src/pages/acessoEmpresa/acessoEmpresa'

export default function TabRouter() {
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
            name='Perfil'
            component={LoginEmpresa}
            options={{
                headerShown: false,
            }}
            />
        </Tab.Navigator>
    )
}