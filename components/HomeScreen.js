// import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import React, {Component} from 'react';

// const themeColor = '#9487f2';
// Scroll view for all chats, function to produce boxes with text posts

/**
 * Home Screen class displaying users home page including posts.
 */
class HomeScreen extends Component {
  /**
  * Renders the home page and all of its contents.
  * @return {SafeAreaView} The scrollable view for the posts.
  */
  render() {
    return (
      <SafeAreaView style = {styles.flexContainer}>
        <View style = {styles.viewOne}></View>
        <View style = {styles.viewTwo}></View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#121212',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },

  viewOne: {
    flex: 1,
    width: 300,
    height: 100,
    backgroundColor: 'red',
  },
  viewTwo: {
    flex: 3,
    width: 500,
    height: 100,
    backgroundColor: 'lightsalmon',
  },

  text: {
    fontSize: 42,
  },
});

export default HomeScreen;
