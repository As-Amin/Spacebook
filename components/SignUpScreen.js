import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, SafeAreaView, TextInput } from 'react-native';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './HomeScreen';

/**
 * Logic Screen class prompting users to create an account or sign in.
 */
class SignUpScreen extends Component {
    /**
     * Constuctor for the Login Screen component class inheriting properties
     * from the Component class
     * @param {Component} props Inherited properties for the components.
     */
    constructor(props) {
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
        };
    }

    signup = () => {
        return fetch("http://localhost:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 201){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
               console.log("User created with ID: ", responseJson);
               this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    render() {
        return (
            <View style={styles.flexContainer}>
                <ScrollView style={styles.scrollView}>
                    <TextInput
                        placeholder="Enter your first name..."
                        onChangeText={(first_name) => this.setState({first_name})}
                        value={this.state.first_name}
                        style={{padding:5, borderWidth:1, margin:5}}
                    />
                    <TextInput
                        placeholder="Enter your last name..."
                        onChangeText={(last_name) => this.setState({last_name})}
                        value={this.state.last_name}
                        style={{padding:5, borderWidth:1, margin:5}}
                    />
                    <TextInput
                        placeholder="Enter your password..."
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        secureTextEntry
                        style={{padding:5, borderWidth:1, margin:5}}
                    />
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
                        title="Create account"
                        onPress={() => this.signup()}
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

export default SignUpScreen;