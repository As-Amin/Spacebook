// eslint-disable-next-line max-len
import {Text, TouchableOpacity, StyleSheet, View, TextInput, ScrollView} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../constants/colors.js';
import IonIcons from 'react-native-vector-icons/Ionicons';

/**
 * Login screen class allowing users to login to their accounts.
 * @return {render} Renders the login screen.
 */
class LoginScreen extends Component {
  /**
    * Constuctor for the login screen component class inheriting properties
    * from the Component class
    * @param {Component} props Inherited properties for the components.
  */
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessageBoth: '',
      errorMessageEmail: '',
      errorMessagePassword: '',
    };
  }

  /**
    * Logs in an existing user to Spacebook by sending a POST request to
    * the API, ensuring details are valid and calling the next screen.
    * @return {response} Response from the fetch statement for logging in.
  */
  login = async () => {
    this.setState({
      errorMessageBoth: '',
      errorMessageEmail: '',
      errorMessagePassword: '',
    });
    if (!this.state.email.toString().toLowerCase().match(/^\S+@\S+\.\S+$/)) {
      this.setState({
        errorMessageEmail: 'Your email address is not valid!',
      });
      this.render();
    }
    if (this.state.password.toString().length < 5) {
      this.setState({
        errorMessagePassword: 'Your password must be longer than 5 characters!',
      });
      this.render();
    }
    return fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 400) {
            this.setState({
              password: '',
              errorMessageBoth: 'Invalid email or password. Please try again.',
            });
            this.render();
            throw new 'Invalid email or password';
          } else {
            throw new 'Something went wrong';
          }
        })
        .then(async (responseJson) => {
          await AsyncStorage.setItem('@user_id', responseJson.id);
          await AsyncStorage.setItem('@session_token', responseJson.token);
          // Reset email and password variables once logged in
          // so not saved when logged out - Security
          this.setState({
            email: '',
            password: '',
          });
          this.props.navigation.navigate('PostLoginScreen');
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
 * Renders the GUI allowing users to navigate and interact with
 * login screen.
 * @return {View} The container for the login screen.
 */
  render() {
    return (
      <View style={styles.flexContainer}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>
            <IonIcons style={styles.logo}
              name={'planet-outline'}/>
            {' Spacebook'}
          </Text>
          <TextInput style={styles.textInput}
            placeholder='Enter your email...'
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}/>
          <TextInput style={styles.textInput}
            placeholder='Enter your password...'
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            secureTextEntry/>
          <Text style={styles.textError}>
            {this.state.errorMessageBoth}
          </Text>
          <Text style={styles.textError}>
            {this.state.errorMessageEmail}
          </Text>
          <Text style={styles.textError}>
            {this.state.errorMessagePassword}
          </Text>
          <TouchableOpacity style={styles.button}
            onPress={() => this.login()}>
            <Text style={styles.text}>
              {'Login'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
            onPress={() => this.props.navigation.navigate('SignUpScreen')}>
            <Text style={styles.text}>
              {'Dont have an account?'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollView: {
    marginBottom: '10%',
    paddingLeft: 5,
    paddingRight: 5,
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
  button: {
    padding: 7.5,
    margin: 5,
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.theme,
    color: Colors.text,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
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
  logo: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: '100%',
    color: Colors.theme,
  },
});

export default LoginScreen;

