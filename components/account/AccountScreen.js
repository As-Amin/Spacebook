// eslint-disable-next-line max-len
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../constants/colors.js';

/**
 * Account screen class allowing users to manage their profile,
 * and sign out.
 * @return {render} Renders the account screen.
 */
class AccountScreen extends Component {
  /**
    * Constuctor for the account screen component class inheriting properties
    * from the Component class
    * @param {Component} props Inherited properties for the components.
  */
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      isLoading: true,
      userInfoData: [],
      // Error messages for invalid email and password
      errorMessageEmail: '',
      errorMessagePassword: '',
    };
  }

  /**
  * Instantiate network request to load data, call the function to retrieve data
  */
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getUserInfo();
  }

  /**
  * Allows the execution of React code when component unmounted from DOM tree
  */
  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
  * Function loading users information into the the DOM tree from server.
  * @return {fetch} Response from the fetch statement for getting users info.
  */
  getUserInfo = async () => {
    // Store the user id as a constant - retrieved from async storage
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch('http://localhost:3333/api/1.0.0/user/' + user.toString(), {
      method: 'GET',
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
      },
    })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) {
            this.props.navigation.navigate('LoginScreen');
          } else if (response.status === 404) {
            throw new Error('Cannot find user');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            userInfoData: responseJson,
          });
        })
        .catch((error) =>{
          console.log(error);
        });
  };

  /**
  * Function allowing users to log out of their accounts.
  * @return {fetch} Response from the fetch statement for signing out.
  */
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
            this.props.navigation.navigate('LoginScreen');
          } else if (response.status === 401) {
            this.props.navigation.navigate('LoginScreen');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((responseJson) => {})
        .catch((error) =>{
          console.log(error);
        });
  };

  /**
  * Function allowing users to update their personal information such
  * as name, email and password.
  * @return {fetch} Response from the fetch statement for patch request
  * to update users information.
  */
  updateUserInfo = async () => {
    this.setState({
      errorMessageEmail: '',
      errorMessagePassword: '',
    });
    if (!this.state.email.toString().toLowerCase().match(/^\S+@\S+\.\S+$/)) {
      this.setState({
        errorMessageEmail: 'Your email address is not valid!',
      });
    }
    if (this.state.password.toString().length < 5) {
      this.setState({
        errorMessagePassword: 'Your password must be longer than 5 characters!',
      });
    }
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/' + user.toString(), {
      method: 'PATCH',
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      }),
    })
        .then((response) => {
          if (response.status === 200) {
            this.logOut();
          } else if (response.status === 400) {
            throw new Error('Failed validation');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
  * Function checking if user is logged in and if they arent,
  * renavigating to the login screen - increasing security.
  */
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    // If a session token is not found, navigate to login screen
    if (value == null) {
      this.props.navigation.navigate('LoginScreen');
    }
  };

  /**
  * Renders the GUI allowing users to navigate and interact with
  * account screen.
  * @return {View} The container for the account screen.
  */
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>
            {'Account'}
          </Text>
          <Text style={styles.text}>
            {'Loading account settings...'}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>
            {'Account'}
          </Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.cardBackground}>
              <Text style={styles.boldText}>
                {'First name: '}{this.state.userInfoData.first_name}{'\n'}{'\n'}
              </Text>
              <Text style={styles.boldText}>
                {'Last name: '}{this.state.userInfoData.last_name}{'\n'}{'\n'}
              </Text>
              <Text style={styles.boldText}>
                {'Email: '}{this.state.userInfoData.email}{'\n'}
              </Text>
            </View>
            <View style={styles.lineSeperator}></View>
            <TextInput style={styles.textInput}
              placeholder="New first name..."
              onChangeText={(firstName) => this.setState({firstName})}
              value={this.state.firstName}
            />
            <TextInput style={styles.textInput}
              placeholder="New last name..."
              onChangeText={(lastName) => this.setState({lastName})}
              value={this.state.lastName}
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
            <Text style={styles.textError}>
              {this.state.errorMessageEmail}
            </Text>
            <Text style={styles.textError}>
              {this.state.errorMessagePassword}
            </Text>
            <TouchableOpacity style={styles.button}
              onPress={() => this.updateUserInfo()}>
              <Text style={styles.buttonText}>Update information</Text>
            </TouchableOpacity>
            <View style={styles.lineSeperator}></View>
            <TouchableOpacity style={styles.button}
              onPress={() => this.logOut() &&
                      this.props.navigation.navigate('LoginScreen')}>
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
  },
  textError: {
    paddingLeft: 7.5,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.error,
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
  cardBackground: {
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
  lineSeperator: {
    margin: 5,
    padding: 1,
    borderRadius: 10,
    backgroundColor: Colors.lineBreak,
  },
});

export default AccountScreen;
