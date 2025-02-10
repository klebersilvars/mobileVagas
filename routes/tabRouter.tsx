import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginUser from '../src/pages/acessoUser/loginUser';

export default function TabRouter() {
    const Tab = createBottomTabNavigator();
    return(
        <Tab.Navigator>
            <Tab.Screen 
            name='homeUsuario' 
            component={LoginUser}
            options={{
                headerShown: false,
                
            }}
            />
        </Tab.Navigator>
    )
}