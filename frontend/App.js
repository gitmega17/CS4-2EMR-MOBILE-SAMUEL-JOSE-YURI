import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import GraphScreen from './screens/GraphScreen';
import RecSenha from './screens/RecSenha';
import UsersScreen from './screens/UsersScreen';

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="GraphScreen" component={GraphScreen} />
        <Stack.Screen name="RecSenha" component={RecSenha} />
        <Stack.Screen name="UsersScreen" component={UsersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
