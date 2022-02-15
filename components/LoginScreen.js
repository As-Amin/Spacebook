import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView, TextInput, ScrollView } from 'react-native';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const themeColor = '#ff8a5b';

/**
 * Logic Screen class prompting users to create an account or sign in.
 */
class LoginScreen extends Component {
    /**
     * Constuctor for the Login Screen component class inheriting properties
     * from the Component class
     * @param {Component} props Inherited properties for the components.
     */
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
        };
    }

    login = async() => {
        return fetch("http://localhost:3333/api/1.0.0/login", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 400) {
                    throw 'Invalid email or password';
                } else {
                    throw 'Something went wrong';
                }
            })
            .then(async(responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                this.props.navigation.navigate('TabNavigateScreen');
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <View style={styles.flexContainer}>
                <ScrollView style={styles.scrollView}>
                    <TextInput style={styles.textInputEmail}
                        placeholder="Enter your email..."
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                    />
                    <TextInput
                        placeholder="Enter your password..."
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        secureTextEntry
                        style={{padding:5, borderWidth:1, margin:5}}
                    />
                    <Button
                        title="Login"
                        onPress={() => this.login()}
                    />
                    <Button
                        title="Don't have an account?"
                        color="darkblue"
                        onPress={() => this.props.navigation.navigate('SignUp')}
                    />
                </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    flexContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingLeft: 10,
    },
    scrollView: {
      flex: 1,
      paddingRight: 10,
      paddingTop: 10,
    },
    textInputEmail: {
      padding:5,
      borderWidth:1,
      margin:5,
    },
    text: {
      fontSize: 16,
      color: '#FFFFFF',
    },
  });

export default LoginScreen;