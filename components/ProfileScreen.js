/* eslint-disable no-trailing-spaces */
// import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Text, FlatList, 
  TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from './constants/colors.js';
import IonIcons from 'react-native-vector-icons/Ionicons';

// Scroll view for all chats, function to produce boxes with text posts

/**
 * Home Screen class displaying users home page including posts.
 */
class ProfileScreen extends Component {
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
    this.getPosts();
  }

  /**
  * Allows the execution of React code when component unmounted from DOM tree
  */
  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
  * Function loading friends into the the DOM tree from server.
  * @return {state} The states loading config and list data
  */
  getData = async () => {
    // Store the auth key as a constant - retrieved from async storage
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/search', {
      'headers': {
        'X-Authorization': token, // Assign the auth key to verify account
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

  /**
  * Function loading users posts into the the DOM tree from server.
  * @return {state} The states loading config and list data
  */
  getPosts = async () => {
    // Store the user id as a constant - retrieved from async storage
    const userId = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/' + userId.toString() + '/post', {
      'headers': {
        'X-Authorization': token, // Assign the auth key to verify account
      },
    })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) {
            this.props.navigation.navigate('Login');
          } else if (response.status === 403) {
            throw new Error('Can only view posts of yourself or friends');
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
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>Profile</Text>
          <FlatList style={styles.flatList}>
            <Text style={styles.text}>
              Loading posts...
            </Text>
          </FlatList>
        </View>
      );
    } else {
      console.log(this.state.listData);
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>Profile</Text>
          <FlatList style={styles.flatList}
            data={this.state.listData}
            renderItem={({item}) => (
              <View style={styles.postBackground}>
                <Text style={styles.boldText}>
                  {'Post from ' + item.author.first_name + ' ' + 
                  item.author.last_name + ':'} {'\n'}{'\n'}
                </Text>

                <Text style={styles.text}>
                  {item.text} {'\n'}{'\n'}
                </Text>

                <Text style={styles.boldText}>
                  {new Date(item.timestamp).toDateString() + 
                  ' | Likes: ' + item.numLikes} {'\n'}{'\n'}
                </Text>

                <View style={styles.flexContainerButtons}>
                  <TouchableOpacity style={styles.button}
                    onPress={() => console.log('worked')}>
                    <Text style={styles.buttonText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button}
                    onPress={() => console.log('worked')}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button}
                    onPress={() => console.log('worked')}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button}
                    onPress={() => console.log('worked')}>
                    <Text style={styles.buttonText}>Like</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button}
                    onPress={() => console.log('worked')}>
                    <Text style={styles.buttonText}>Dislike</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      );
    }
  }
}

/**
 * Add button for adding post to my own profile
 *
 * Add button that for each post that when clicked on,
 * views in a new stack screen
 *
 * Functionality to update and delete posts
 *
 * Functionality to like, dislike buttons
 */

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  flexContainerButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  flatList: {
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
    padding: 5,
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
});
export default ProfileScreen;
