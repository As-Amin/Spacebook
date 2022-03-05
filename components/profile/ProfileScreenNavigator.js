import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import ProfileScreen from '../post-management/ViewProfileScreen';
import ViewSinglePost from '../post-management/ViewSinglePost';
import UpdatePostScreen from '../post-management/UpdatePostScreen';
import ViewDraftsScreen from '../post-management/ViewDraftsScreen';

const Stack = createStackNavigator();

/**
 * Profile screen stack navigator allowing users to navigate
 * through every screen related to the profile screen
 * @return {render} Renders the stack navigator.
*/
class ProfileScreenNavigator extends Component {
  /**
  * Renders the stack navgigator for the profile related screens.
  * @return {Stack.Navigator} The stack navigator.
  */
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name='ProfileScreen'
          component={ProfileScreen}
          options={{headerShown: false}}/>
        <Stack.Screen
          name='ViewSinglePostScreen'
          component={ViewSinglePost}
          options={{title: 'Back to profile'}}/>
        <Stack.Screen
          name='UpdatePostScreen'
          component={UpdatePostScreen}
          options={{title: 'Back to profile'}}/>
        <Stack.Screen
          name='ViewDraftsScreen'
          component={ViewDraftsScreen}
          options={{title: 'Back to profile'}}/>
      </Stack.Navigator>
    );
  }
}

export default ProfileScreenNavigator;
