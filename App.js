// import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
// import { StyleSheet, Text, View } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './components/HomeScreen';
import SettingsScreen from './components/SettingsScreen';
// import LoginScreen from './components/LoginScreen';
import PostScreen from './components/PostScreen';
// import FriendsScreen from './components/FriendsScreen';

import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const themeColor = '#ff8a5b';

/**
 * Main App.js constructor to connect components together.
 */
class Spacebook extends Component {
  /**
 * Renders the tab navigator at the bottom of the screen.
 * @return {NavigationContainer} The tab navigator.
 */
  render() {
    return (
      <NavigationContainer theme={DarkTheme}>
        <Tab.Navigator
          screenOptions={({route}) => (
            {tabBarIcon: ({color, size}) => {
              if (route.name == 'Home') {
                return <IonIcons
                  name={'planet-outline'}
                  size={size}
                  color={color} />;
              } else if (route.name == 'New Post') {
                return <IonIcons
                  name={'add-circle-outline'}
                  size={size}
                  color={color} />;
              } else if (route.name == 'Friends') {
                return <IonIcons
                  name={'people-outline'}
                  size={size}
                  color={color} />;
              } else if (route.name == 'Settings') {
                return <IonIcons
                  name={'settings-outline'}
                  size={size}
                  color={color} />;
              }
            },
            tabBarActiveTintColor: themeColor,
            tabBarInactiveTintColor: 'gray',
            })}>

          <Tab.Screen name='Home' component={HomeScreen}/>
          <Tab.Screen name='New Post' component={PostScreen} />
          <Tab.Screen name='Friends' component={SettingsScreen} />
          <Tab.Screen name='Settings' component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default Spacebook;
