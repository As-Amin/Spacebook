/* eslint-disable require-jsdoc */
// import {StatusBar} from 'expo-status-bar';
import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';

import ProfileScreen from
  '../profile-and-friends/ViewProfileScreen';
import ViewSinglePost from
  '../profile-and-friends/ViewSinglePost';

const Stack = createStackNavigator();

class ProfileScreenNavigator extends Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name='ProfileScreen'
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name='ViewSinglePost'
          component={ViewSinglePost}
          options={{title: 'Back to profile'}}
        />
      </Stack.Navigator>
    );
  }
}

export default ProfileScreenNavigator;
