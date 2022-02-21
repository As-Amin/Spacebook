/* eslint-disable quote-props */
/* eslint-disable no-trailing-spaces */
// import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Text, FlatList, 
  TouchableOpacity, TextInput, ScrollView} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from './constants/colors.js';

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
      nonAsyncUserId: '',
      isLoading: true,
      listData: [],
      userTextToPost: '',
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
  * Function which posts on the users individual profile
  * @return {state} The states loading config and list data
  */
  postOnProfile = async (textToPost) => {
    // Store the user id as a constant - retrieved from async storage
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch('http://localhost:3333/api/1.0.0/user/' + user.toString() + '/post', {
      method: 'POST',  
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToPost,
      }),
    })
        .then((response) => {
          if (response.status === 201) {
            this.componentDidMount();
            return response.json();
          } else if (response.status === 401) {
            this.props.navigation.navigate('Login');
          } else if (response.status === 404) {
            throw new Error('Post not found!');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then(() => {
          // Reset user text so user can post again
          this.setState({
            userTextToPost: '',
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
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch('http://localhost:3333/api/1.0.0/user/' + user.toString() + '/post', {
      method: 'GET',  
      headers: {
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
            nonAsyncUserId: user,
          });
        })
        .catch((error) =>{
          console.log(error);
        });
  };

  /**
  * Function which sends a POST request to like a post
  * into the the DOM tree from server.
  * @param {int} postId The identifier for the post to like
  * @return {state} The states loading config and list data
  */
  likePost = async (postId) => {
    // Store the user id as a constant - retrieved from async storage
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');
    
    return fetch('http://localhost:3333/api/1.0.0/user/' + user.toString() + '/post/' + postId.toString() + '/like', {
      method: 'POST', // POST request as sending request to like post
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
      },
    })
        .then((response) => {
          if (response.status === 200) {
            this.componentDidMount();
            return response.json();
          } else if (response.status === 401) {
            this.props.navigation.navigate('Login');
          } else if (response.status === 403) {
            throw new Error('You have already liked this post!');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) =>{
          console.log(error);
        });
  };

  /**
  * Function which sends a DELETE request to dislike a post
  * into the the DOM tree from server.
  * @param {int} postId The identifier for the post to like
  * @return {state} The states loading config and list data
  */
  dislikePost = async (postId) => {
    // Store the user id as a constant - retrieved from async storage
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch('http://localhost:3333/api/1.0.0/user/' + user.toString() + '/post/' + postId.toString() + '/like', {
      method: 'DELETE', // DELETE request as sending request to dislike post
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
      },
    })
        .then((response) => {
          if (response.status === 200) {
            this.componentDidMount();
            return response.json();
          } else if (response.status === 401) {
            this.props.navigation.navigate('Login');
          } else if (response.status === 403) {
            throw new Error('You have not liked this post!');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) =>{
          console.log(error);
        });
  };
  
  /**
  * Function which sends a DELETE request to delete a post
  * into the the DOM tree from server.
  * @param {int} postId The identifier for the post to delete
  * @return {state} The states loading config and list data
  */
  deletePost = async (postId) => {
    // Store the user id as a constant - retrieved from async storage
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');

    return fetch('http://localhost:3333/api/1.0.0/user/' + user.toString() + '/post/' + postId.toString(), {
      method: 'DELETE',
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
      },
    })
        .then((response) => {
          if (response.status === 200) {
            this.componentDidMount();
            return response.json();
          } else if (response.status === 401) {
            this.props.navigation.navigate('Login');
          } else if (response.status === 403) {
            throw new Error('You can only delete your own posts!');
          } else {
            throw new Error('Something went wrong');
          }
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
  * Renders the profile page and all of its contents.
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
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.postOnProfileView}>
            <TextInput style={styles.textInput}
              placeholder="New post here..."
              onChangeText={(userTextToPost) => this.setState({userTextToPost})}
              value={this.state.userTextToPost}
            />
            <TouchableOpacity style={styles.postOnProfileButton}
              onPress={() => this.postOnProfile(this.state.userTextToPost)}>
              <Text style={styles.buttonText}>Post on profile</Text>
            </TouchableOpacity>
          </View>
          <FlatList style={styles.flatList}
            data={this.state.listData}
            renderItem={({item, index}) => (
              <View style={styles.cardBackground}>
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
                  {item.author.user_id.toString() !== 
                    this.state.nonAsyncUserId.toString() ?  
                    <></> : 
                    <TouchableOpacity style={styles.button}
                      onPress={() => this.deletePost(item.post_id)}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity> }
                  {item.author.user_id.toString() !== 
                    this.state.nonAsyncUserId.toString() ?  
                    <></> : 
                    <TouchableOpacity style={styles.button}
                      onPress={() => console.log('worked')}>
                      <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity> }
                  {item.author.user_id.toString() === 
                    this.state.nonAsyncUserId.toString() ?  
                    <></> : 
                    <><TouchableOpacity style={styles.button}
                      onPress={() => this.likePost(item.post_id)}>
                      <Text style={styles.buttonText}>Like</Text>
                    </TouchableOpacity><TouchableOpacity style={styles.button}
                      onPress={() => this.dislikePost(item.post_id)}>
                      <Text style={styles.buttonText}>Dislike</Text>
                    </TouchableOpacity></> }
                </View>
              </View>
            )}
            keyExtractor={(item, index) => item.post_id.toString()}
          />
        </View>
      );
    }
  }
}

/**
 * Add button that for each post that when clicked on,
 * views in a new stack screen
 *
 * Functionality to update posts
 */

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  flexContainerButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  flatList: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  postOnProfileView: {
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
  cardBackground: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.lighterBackground,
  },
  postOnProfileButton: {
    padding: 7.5,
    margin: 5,
    fontSize: 16,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.theme,
    color: Colors.text,
  },
  button: {  
    flex: 1,
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
export default ProfileScreen;
