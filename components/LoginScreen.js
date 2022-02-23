import {Text, TouchableOpacity, StyleSheet, View, TextInput, ScrollView}
  from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../constants/colors.js';
import IonIcons from 'react-native-vector-icons/Ionicons';

/**
 * Login Screen class prompting users to create an account or sign in.
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
      email: '',
      password: '',
    };
  }

  login = async () => {
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
            throw new 'Invalid email or password';
          } else {
            throw new 'Something went wrong';
          }
        })
        .then(async (responseJson) => {
          await AsyncStorage.setItem('@user_id', responseJson.id);
          await AsyncStorage.setItem('@session_token', responseJson.token);
          // Security - Reset email and password variables once logged in
          // so not saved when logged out
          this.setState({
            email: '',
            password: '',
          });
          this.props.navigation.navigate('PostLogin');
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
          <Text style={styles.title}>
            <IonIcons style={styles.logo}
              name={'planet-outline'}
            /> Spacebook</Text>
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
            onPress={() => this.login()}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}
            onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={styles.text}>Don&apos;t have an account?</Text>
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
