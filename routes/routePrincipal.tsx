import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnBoarding from '../src/components/onBoarding';
import PageHome from '../src/pages/pageHome';
import PageLogin from '../src/pages/pageLogin';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="OnBoarding">
                <Stack.Screen
                    name="OnBoarding"
                    component={OnBoarding}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PageHome"
                    component={PageHome}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PageLogin"
                    component={PageLogin}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
