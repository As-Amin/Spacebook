// import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Text, ScrollView, FlatList} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from './constants/colors.js';

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
  * Instantiate network request to load data, call the function to retrieve data
  */
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
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
            this.props.navigation.navigate('Login');
          } else {
            throw new Error('Something went wrong');
          }
        })
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

  checkLoggedIn = async () => {
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
  /**
  * Renders the home page and all of its contents.
  * @return {View} The loading text.
  * @return {View} The scrollable view for the posts.
  */
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>Home</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.text}>
            Loading posts...
            </Text>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.title}>Home</Text>
          <FlatList style={styles.scrollView}
            data={this.state.listData}
            renderItem={({item}) => (
              <View>
                <Text style={styles.text}>
                  {item.user_givenname} {item.user_familyname}</Text>
              </View>
            )}
            keyExtractor={(item, index) => item.user_id.toString()}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  scrollView: {
    paddingLeft: 12,
    paddingRight: 5,
  },
  text: {
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
export default HomeScreen;
