// import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
// import { StyleSheet, Text, View } from 'react-native';

import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import TabNavigateScreen from './components/TabNavigateScreen';

import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

/**
 * Main App.js constructor to connect components together.
 */
class Spacebook extends Component {
  render() {
    return (
      <NavigationContainer theme = {DarkTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: 'Sign Up' }}
          />
          <Stack.Screen
            name="TabNavigateScreen"
            component={TabNavigateScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Spacebook;
