import {StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity}
  from 'react-native';
import React, {Component} from 'react';
import {Colors} from './constants/colors.js';

/**
 * Logic Screen class prompting users to create an account or sign in.
 * @return {render} Renders the sign up screen.
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
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    };
  }

  signup = () => {
    return fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    })
        .then((response) => {
          if (response.status === 201) {
            return response.json();
          } else if (response.status === 400) {
            throw new 'Failed validation';
          } else {
            throw new 'Something went wrong';
          }
        })
        .then((responseJson) => {
          console.log('User created with ID: ', responseJson);
          this.props.navigation.navigate('Login');
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
 * Main App.js constructor to connect components together.
 * @return {View} The stack navigator for logging in,
 * signing up and the other screens post log in
 */
  render() {
    return (
      <View style={styles.flexContainer}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.title}>Sign up</Text>
          <TextInput style={styles.textInput}
            placeholder="Enter your first name..."
            // eslint-disable-next-line camelcase
            onChangeText={(first_name) => this.setState({first_name})}
            value={this.state.first_name}
          />
          <TextInput style={styles.textInput}
            placeholder="Enter your last name..."
            // eslint-disable-next-line camelcase
            onChangeText={(last_name) => this.setState({last_name})}
            value={this.state.last_name}
          />
          <TextInput style={styles.textInput}
            placeholder="Enter your email..."
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
          <TextInput style={styles.textInput}
            placeholder="Enter your password..."
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button}
            onPress={() => this.signup()}>
            <Text style={styles.text}>Create account</Text>
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
    marginBottom: '50%',
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
    color: Colors.text,
  },
  button: {
    padding: 5,
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
  title: {
    padding: 5,
    margin: 5,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: '350%',
    color: Colors.text,
  },
});

export default SignUpScreen;
