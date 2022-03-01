import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import AccountScreen from './AccountScreen';
import CameraScreen from './CameraScreen';

const Stack = createStackNavigator();

/**
 * Account screen stack navigator allowing users to navigate
 * through every screen related to the account screen such as
 * the camera to take a new profile picture and the account
 * management screen.
 * @return {render} Renders the stack navigator.
*/
class AccountScreenNavigator extends Component {
  /**
  * Renders the stack navigator for the account related screens.
  * @return {Stack.Navigator} The stack navigator.
  */
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name='AccountScreen'
          component={AccountScreen}
          options={{headerShown: false}}/>
        <Stack.Screen
          name='CameraScreen'
          component={CameraScreen}
          options={{title: 'Back to account'}}/>
      </Stack.Navigator>
    );
  }
}

export default AccountScreenNavigator;
