// import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './LoginScreen';

// const themeColor = '#9487f2';
// Scroll view for all chats, function to produce boxes with text posts

/**
 * Home Screen class displaying users home page including posts.
 */
class HomeScreen extends Component {
  /**
  * Constuctor for the Home Screen component class inheriting properties
  * from the Component class
  * @param {Component} props Inherited properties for the components.
  */
  constructor(props) {
    super(props);

    // State object to store all data
    this.state = {
      isLoading: true,
      listData: [],
    };
  }

  /**
  * Instantiate network request to load data
  */
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkIfLoggedIn();
    });
  }

  /**
  * Allows the execution of React code when component unmounted from DOM tree
  */
  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
  * Function loading components (posts) into the the DOM tree from server.
  * @return {state} The states loading config and list data
  */
  getData = async () => {
    // Store the auth key as a constant - retrieved from async storage
    const value = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/search', {
      'headers': {
        'X-Authorization': value, // Assign the auth key to verify account
      },
    })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) {
            this.props.navigation.navigate(LoginScreen);
          } else if (response.status === 403) {
            return response.json();
          } else if (response.status === 404) {
            return response.json();
          } else if (response.status === 404) {
            return response.json();
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            listData: responseJson,
          });
        })
        .catch((error) =>{
          console.log(error);
        });
  };

  checkIfLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    // If a session token is not found, navigate to login screen
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  /**
  * Renders the home page and all of its contents.
  * @return {View} The loading text.
  * @return {View} The scrollable view for the posts.
  */
  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={styles.flexContainerLoading}>
          <Text style={styles.text}>
            Loading posts...
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.flexContainer}>
          <ScrollView style={styles.scrollView}>
            data={this.state.listData}
            renderItem={({item}) => (
              <View>
                <Text style={styles.text}>
                  {item.first_name} {item.last_name}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => item.user_id.toString()}
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  flexContainerLoading: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 50,
  },
  scrollView: {
    flex: 1,
    paddingRight: 10,
    paddingTop: 10,
  },
  viewTwo: {
    flex: 3,
    width: 500,
    height: 100,
    backgroundColor: 'lightsalmon',
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default HomeScreen;
