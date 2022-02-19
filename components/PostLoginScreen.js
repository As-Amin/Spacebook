// import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';

import ProfileScreen from './ProfileScreen';
import FriendsScreen from './FriendsScreen';
import FriendRequestsScreen from './FriendRequestsScreen';
import AccountScreen from './AccountScreen';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors} from './constants/colors.js';

const Tab = createBottomTabNavigator();

// eslint-disable-next-line require-jsdoc
class TabNavigateScreen extends Component {
  /**
 * Renders the tab navigator at the bottom of the screen.
 * @return {NavigationContainer} The tab navigator.
 */
  render() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => (
          {tabBarIcon: ({color, size}) => {
            if (route.name == 'Profile') {
              return <IonIcons
                name={'person-outline'}
                size={size}
                color={color} />;
            } else if (route.name == 'Friends') {
              return <IonIcons
                name={'people-outline'}
                size={size}
                color={color} />;
            } else if (route.name == 'Friend Requests') {
              return <IonIcons
                name={'person-add-outline'}
                size={size}
                color={color} />;
            } else if (route.name == 'Account') {
              return <IonIcons
                name={'settings-outline'}
                size={size}
                color={color} />;
            }
          },
          tabBarActiveTintColor: Colors.theme,
          tabBarInactiveTintColor: 'gray',
          })}>

        <Tab.Screen name='Profile'
          component={ProfileScreen}
          options={{headerShown: false}}/>
        <Tab.Screen name='Friends'
          component={FriendsScreen}
          options={{headerShown: false}} />
        <Tab.Screen name='Friend Requests'
          component={FriendRequestsScreen}
          options={{headerShown: false}} />
        <Tab.Screen name='Account'
          component={AccountScreen}
          options={{headerShown: false}} />
      </Tab.Navigator>
    );
  }
}

export default TabNavigateScreen;
