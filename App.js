import React, {Component} from 'react';

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
  /**
 * Main App.js constructor to connect components together.
 * @return {NavigationContainer} The stack navigator for logging in,
 * signing up and the other screens post log in
 */
  render() {
    return (
      <NavigationContainer theme = {DarkTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Sign in'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{title: 'Back'}}
          />
          <Stack.Screen
            name="TabNavigateScreen"
            component={TabNavigateScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Spacebook;
