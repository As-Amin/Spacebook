import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Button, SafeAreaView} from 'react-native';
import React, {Component} from 'react';

class LoginScreen extends Component {
  render() {
    return (
      <View>
        <Button title="About Me" onPress={() => this.props.navigation.navigate('About')}/>
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

export default LoginScreen;
