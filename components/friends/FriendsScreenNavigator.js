/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';

import FriendsScreen from './FriendsScreen';
import GetFriendsPosts from '../profile-and-friends/ViewProfileScreen';
import ViewSinglePost from '../profile-and-friends/ViewSinglePost';
import UpdatePostScreen from
  '../profile-and-friends/UpdatePostScreen';

const Stack = createStackNavigator();

class FriendsScreenNavigator extends Component {
  /**
 * Main Friends Screen constructor to connect components together.
 * @return {Navigator} The stack navigator for all friends screen components.
 */
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name='FriendsScreen'
          component={FriendsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name='GetFriendsPosts'
          component={GetFriendsPosts}
          options={{title: 'Back to friends'}}
        />
        <Stack.Screen
          name='ViewSinglePost'
          component={ViewSinglePost}
          options={{title: 'Back to friends profile'}}
        />
        <Stack.Screen
          name='UpdatePostScreen'
          component={UpdatePostScreen}
          options={{title: 'Back to friends profile'}}
        />
      </Stack.Navigator>
    );
  }
}

export default FriendsScreenNavigator;
