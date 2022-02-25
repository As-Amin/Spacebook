import React, {Component} from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import ProfileScreenNavigator from './profile/ProfileScreenNavigator';
import FriendsScreenNavigator from './friends/FriendsScreenNavigator';
import FriendRequestsScreen from './friend-requests/FriendRequestsScreen';
import FindFriendsScreen from './find-friends/FindFriendsScreen';
import AccountScreen from './account/AccountScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors} from '../constants/colors.js';

const Tab = createBottomTabNavigator();

/**
 * Tab navigation class rendering and operating a bottom tab
 * navigator used to navigate through main screens
 * @return {render} Renders the bottom tab navigator.
 */
class TabNavigateScreen extends Component {
  /**
 * Renders the tab navigator at the bottom of the screen.
 * @return {Tab.Navigator} The tab navigator at the bottom.
 */
  render() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => (
          {tabBarIcon: ({color, size}) => {
            if (route.name === 'Profile') {
              return <IonIcons
                name={'person-outline'}
                size={size}
                color={color}/>;
            } else if (route.name === 'Friends') {
              return <IonIcons
                name={'people-outline'}
                size={size}
                color={color}/>;
            } else if (route.name === 'Requests') {
              return <IonIcons
                name={'person-add-outline'}
                size={size}
                color={color}/>;
            } else if (route.name === 'Find') {
              return <IonIcons
                name={'search-outline'}
                size={size}
                color={color}/>;
            } else if (route.name === 'Account') {
              return <IonIcons
                name={'settings-outline'}
                size={size}
                color={color}/>;
            }
          },
          tabBarActiveTintColor: Colors.theme,
          tabBarInactiveTintColor: 'gray',
          })}>
        <Tab.Screen name='Profile'
          component={ProfileScreenNavigator}
          options={{headerShown: false}}/>
        <Tab.Screen name='Friends'
          component={FriendsScreenNavigator}
          options={{headerShown: false}}/>
        <Tab.Screen name='Requests'
          component={FriendRequestsScreen}
          options={{headerShown: false}}/>
        <Tab.Screen name='Find'
          component={FindFriendsScreen}
          options={{headerShown: false}}/>
        <Tab.Screen name='Account'
          component={AccountScreen}
          options={{headerShown: false}}/>
      </Tab.Navigator>
    );
  }
}

export default TabNavigateScreen;
