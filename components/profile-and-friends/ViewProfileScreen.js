// eslint-disable-next-line max-len
import {StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../constants/colors.js';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

/**
 * View profile screen to display the profile of the user or friend
 * whos profile is requested to be viewed.
 * @return {render} Renders the profile screen.
*/
class ViewProfileScreen extends Component {
  /**
  * Constuctor for the view profile screen component class inheriting
  * properties from the Component class
  * @param {Component} props Inherited properties for the components.
  */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      allPostsData: [],
      userId: '', // ID of user whos profile is being displayed
      friendFirstName: 'Profile', // Whos profile it is, to display at top
      loggedInAccountUserId: '', // ID of user whos logged in
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
  * Function loading all of the users post to update from the server.
  * @return {fetch} Response from the fetch statement for getting
  * the posts.
  */
  getPosts = async () => {
    // Store the user id as a constant - retrieved from async storage
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');
    // Check if to view friends posts or users posts
    try {
      if (this.props.route.params.friendId.toString() !== user.toString()) {
        this.setState({
          userId: this.props.route.params.friendId.toString(),
          friendFirstName: this.props.route.params.friendFirstName.toString() +
            '\'s profile',
        });
      }
    } catch (error) {
      this.setState({
        userId: user.toString(),
      });
    }
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.userId + '/post', {
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
          } else if (response.status === 403) {
            throw new Error('Can only view posts of yourself or friends');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .then((responseJson) => {
          this.setState({
            isLoading: false,
            allPostsData: responseJson,
            loggedInAccountUserId: user,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
  * Function allowing user to post on the profile of the friend or their
  * own profile.
  * @return {fetch} Response from the fetch statement for
  * posting a post on the profile.
  */
  postOnProfile = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.userId + '/post', {
      method: 'POST',
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: this.state.userTextToPost,
      }),
    })
        .then((response) => {
          if (response.status === 201) {
            this.getPosts();
            this.setState({
              userTextToPost: '', // So user can post again
            });
          } else if (response.status === 401) {
            this.props.navigation.navigate('LoginScreen');
          } else if (response.status === 404) {
            throw new Error('Post not found!');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
  * Function which sends a POST request to like a post
  * into the the DOM tree from server.
  * @param {int} postId The identifier for the post to like.
  * @return {fetch} Response from the fetch statement for
  * liking a users post.
  */
  likePost = async (postId) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.userId + '/post/' + postId.toString() + '/like', {
      method: 'POST', // POST request as sending request to like post
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
      },
    })
        .then((response) => {
          if (response.status === 200) {
            this.getPosts();
          } else if (response.status === 401) {
            this.props.navigation.navigate('LoginScreen');
          } else if (response.status === 403) {
            throw new Error('You have already liked this post!');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          toast.error('You have already liked this post!');
          console.log(error);
        });
  };

  /**
  * Function which sends a DELETE request to dislike a post
  * into the the DOM tree from server.
  * @param {int} postId The identifier for the post to dislike.
  * @return {fetch} Response from the fetch statement for
  * disliking a users post.
  */
  dislikePost = async (postId) => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.userId + '/post/' + postId.toString() + '/like', {
      method: 'DELETE', // DELETE request as sending request to dislike post
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
      },
    })
        .then((response) => {
          if (response.status === 200) {
            this.getPosts();
          } else if (response.status === 401) {
            this.props.navigation.navigate('LoginScreen');
          } else if (response.status === 403) {
            throw new Error('You have not liked this post!');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((error) => {
          toast.error('You have not liked this post!');
          console.log(error);
        });
  };

  /**
  * Function which sends a DELETE request to delete a post.
  * @param {int} postId The identifier for the post to delete.
  * @return {fetch} Response from the fetch statement for
  * deleting a users post.
  */
  deletePost = async (postId) => {
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
            this.getPosts();
          } else if (response.status === 401) {
            this.props.navigation.navigate('LoginScreen');
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
  * profile screen.
  * @return {View} The container for the profile screen.
  */
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>
            {this.state.friendFirstName}
          </Text>
          <FlatList style={styles.flatList}>
            <Text style={styles.text}>
              {'Loading posts...'}
            </Text>
          </FlatList>
        </View>
      );
    } else {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>
            {this.state.friendFirstName}
          </Text>
          <View style={styles.postOnProfileView}>
            <TextInput style={styles.textInput}
              placeholder="New post here..."
              onChangeText={(userTextToPost) => this.setState({userTextToPost})}
              value={this.state.userTextToPost}/>
            <View style={styles.flexContainerButtons}>
              <TouchableOpacity style={styles.button}
                onPress={() => this.postOnProfile()}>
                <Text style={styles.buttonText}>
                  {'Post'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}
                onPress={() => console.log('worked')}>
                <Text style={styles.buttonText}>
                  {'Save as draft'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}
                onPress={() => this.componentDidMount()}>
                <Text style={styles.buttonText}>
                  {'Refresh'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.lineSeperator}></View>
          </View>
          <FlatList style={styles.flatList}
            data={this.state.allPostsData}
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
                    onPress={() =>
                      this.props.navigation.navigate('ViewSinglePostScreen', {
                        userId: this.state.userId,
                        postId: item.post_id,
                        postAuthorFirstName: item.author.first_name,
                      })}>
                    <Text style={styles.buttonText}>
                      {'View'}
                    </Text>
                  </TouchableOpacity>
                  {item.author.user_id.toString() !==
                    this.state.loggedInAccountUserId ?
                    <></> :
                    <><TouchableOpacity style={styles.button}
                      onPress={() => this.deletePost(item.post_id)}>
                      <Text style={styles.buttonText}>
                        {'Delete'}
                      </Text>
                    </TouchableOpacity><TouchableOpacity style={styles.button}
                      onPress={() =>
                        this.props.navigation.navigate('UpdatePostScreen', {
                          userId: this.state.userId,
                          postId: item.post_id,
                          friendFirstName: this.state.friendFirstName,
                        })}>
                      <Text style={styles.buttonText}>
                        {'Update'}
                      </Text>
                    </TouchableOpacity></> }
                  {item.author.user_id.toString() ===
                    this.state.loggedInAccountUserId ?
                    <></> :
                    <><TouchableOpacity style={styles.button}
                      onPress={() =>
                        this.likePost(item.post_id)}>
                      <Text style={styles.buttonText}>
                        {'Like'}
                      </Text>
                    </TouchableOpacity><TouchableOpacity style={styles.button}
                      onPress={() =>
                        this.dislikePost(item.post_id)}>
                      <Text style={styles.buttonText}>
                        {'Dislike'}
                      </Text>
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
    fontSize: '250%',
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
  lineSeperator: {
    margin: 5,
    padding: 1,
    borderRadius: 10,
    backgroundColor: Colors.lineBreak,
  },
});

export default ViewProfileScreen;
