/* eslint-disable require-jsdoc */
/* eslint-disable react/jsx-no-undef */
import {StyleSheet, View, Text, ScrollView,
  TouchableOpacity, TextInput} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from './constants/colors.js';

class AccountScreen extends Component {
  constructor(props) {
    super(props);

    // State object to store all data
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      isLoading: false,
      listData: [],
    };
  }

  /**
  * Instantiate network request to load data, call the function to retrieve data
  */
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  /**
  * Allows the execution of React code when component unmounted from DOM tree
  */
  componentWillUnmount() {
    this.unsubscribe();
  }

  logOut = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST', // POST request as sending request to like post
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
      },
    })
        .then((response) => {
          if (response.status === 200) {
            this.props.navigation.navigate('Login');
          } else if (response.status === 401) {
            this.props.navigation.navigate('Login');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((responseJson) => {})
        .catch((error) =>{
          console.log(error);
        });
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    // If a session token is not found, navigate to login screen
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.text}>
            Loading account settings...
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>Account</Text>
          <ScrollView style={styles.scrollView}>

            <Text style={styles.boldText}>
              {'First name: ' }{'\n'}{'\n'}
            </Text>
            <Text style={styles.boldText}>
              {'Last name: ' }{'\n'}{'\n'}
            </Text>
            <Text style={styles.boldText}>
              {'Email: ' }{'\n'}{'\n'}
            </Text>
            <TextInput style={styles.textInput}
              placeholder="New first name..."
              // eslint-disable-next-line camelcase
              onChangeText={(first_name) => this.setState({first_name})}
              value={this.state.first_name}
            />
            <TextInput style={styles.textInput}
              placeholder="New last name..."
              // eslint-disable-next-line camelcase
              onChangeText={(last_name) => this.setState({last_name})}
              value={this.state.last_name}
            />
            <TextInput style={styles.textInput}
              placeholder="New email..."
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
            <TextInput style={styles.textInput}
              placeholder="New password..."
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button}
              onPress={() => console.log('worked')}>
              <Text style={styles.buttonText}>Update information</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
              onPress={() => this.logOut() &&
                    this.props.navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  scrollView: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    paddingLeft: 5,
  },
  title: {
    padding: 5,
    margin: 5,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: '300%',
    color: Colors.text,
  },
  postBackground: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.lighterBackground,
  },
  button: {
    padding: 7.5,
    margin: 5,
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.theme,
    color: Colors.text,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  textInput: {
    padding: 5,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: Colors.lighterBackground,
    color: Colors.text,
  },
});

export default AccountScreen;
