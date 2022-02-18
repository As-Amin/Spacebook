import React, {Component} from 'react';

import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import PostLoginScreen from './components/PostLoginScreen';

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
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{title: 'Back to Login'}}
          />
          <Stack.Screen
            name="PostLogin"
            component={PostLoginScreen}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Spacebook;
