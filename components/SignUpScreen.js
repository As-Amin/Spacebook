// eslint-disable-next-line max-len
import {StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import {Colors} from '../constants/colors.js';

/**
 * Sign up screen class allowing users to sign up to Spacebook.
 * @return {render} Renders the sign up screen.
 */
class SignUpScreen extends Component {
  /**
    * Constuctor for the Sign up screen component class inheriting properties
    * from the Component class
    * @param {Component} props Inherited properties for the components.
  */
  constructor(props) {
    super(props);
    this.state = {
      // Details for the user signing up
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      // Error messages for invalid email and password
      errorMessageEmail: '',
      errorMessagePassword: '',
      // Validate email string used to check if an email is possible
      validateEmailString:
      // eslint-disable-next-line max-len
      /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
    };
  }

  /**
    * Signs up a user to Spacebook by sending a POST request to the API.
    * @return {response} Response from the fetch statement for signing up.
  */
  signup = () => {
    this.setState({
      errorMessageEmail: '',
      errorMessagePassword: '',
    });
    if (!this.state.email.toString().toLowerCase().match(
        this.state.validateEmailString)) {
      this.setState({
        errorMessageEmail: 'Your email address is not valid!',
      });
      return false;
    }
    if (this.state.password.toString().length < 5) {
      this.setState({
        errorMessagePassword: 'Your password must be longer than 5 characters!',
      });
      return false;
    }
    return fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'POST',
      headers: {
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
          if (response.status === 201) {
            return response.json();
          } else if (response.status === 400) {
            throw new Error('User email is already in the system...');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((responseJson) => {
          console.log('User created with ID: ', responseJson);
          this.props.navigation.navigate('LoginScreen');
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
 * Renders the GUI allowing users to navigate and interact with
 * sign up screen.
 * @return {View} The container for the sign up screen.
 */
  render() {
    return (
      <View style={styles.flexContainer}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>
            {'Sign up'}
          </Text>
          <TextInput style={styles.textInput}
            placeholder='Enter your first name...'
            onChangeText={(firstName) => this.setState({firstName})}
            value={this.state.firstName}/>
          <TextInput style={styles.textInput}
            placeholder='Enter your last name...'
            onChangeText={(lastName) => this.setState({lastName})}
            value={this.state.lastName}/>
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
            {this.state.errorMessageEmail}
          </Text>
          <Text style={styles.textError}>
            {this.state.errorMessagePassword}
          </Text>
          <TouchableOpacity style={styles.button}
            onPress={() => this.signup()}>
            <Text style={styles.text}>
              {'Create account'}
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
    fontSize: '250%',
    color: Colors.text,
  },
});

export default SignUpScreen;

