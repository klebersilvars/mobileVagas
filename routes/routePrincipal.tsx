import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import App from '../App';

export default function Routes() {

    const Stack = createStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="App" component={App} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }