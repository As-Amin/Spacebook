import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Button, SafeAreaView} from 'react-native';
import React, {Component} from 'react';

class FriendsScreen extends Component {
  render() {
    return (
      <View>
        <Button title="Test Button" onPress={() => this.props.navigation.navigate('About')}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FriendsScreen;
