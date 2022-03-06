import React, {Component} from 'react';
import LoginScreen from './components/setup-account/LoginScreen';
import SignUpScreen from './components/setup-account/SignUpScreen';
import PostLoginScreen from './components/setup-account/PostLoginScreen';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Colors} from './constants/colors.js';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();
const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.darkerBackground,
    card: Colors.lighterBackground,
    theme: Colors.theme,
    text: Colors.text,
  },
};

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
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name='LoginScreen'
            component={LoginScreen}
            options={{headerShown: false}}/>
          <Stack.Screen
            name='SignUpScreen'
            component={SignUpScreen}
            options={{title: 'Back to login'}}/>
          <Stack.Screen
            name='PostLoginScreen'
            component={PostLoginScreen}
            options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default Spacebook;
