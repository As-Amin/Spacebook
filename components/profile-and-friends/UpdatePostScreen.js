// eslint-disable-next-line max-len
import {StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../constants/colors.js';
import 'react-native-gesture-handler';

/**
 * Update post screen to display the single post to update, allowing user
 * to change the text in the post.
 * @return {render} Renders the post screen.
*/
class UpdatePostScreen extends Component {
  /**
  * Constuctor for the update post screen component class inheriting
  * properties from the Component class
  * @param {Component} props Inherited properties for the components.
  */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      postToUpdateData: [],
      loggedInAccountUserId: '',
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
    this.getSinglePost();
  }

  /**
  * Allows the execution of React code when component unmounted from DOM tree
  */
  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
  * Function loading the single post to update from the server.
  * @return {fetch} Response from the fetch statement for getting
  * the single post.
  */
  getSinglePost = async () => {
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.props.route.params.userId + '/post/' + this.props.route.params.postId, {
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
            postToUpdateData: responseJson,
            loggedInAccountUserId: user,
          });
        })
        .catch((error) => {
          console.log(error);
        });
  };

  /**
  * Function sending a patch fetch request to update the post with the new
  * text in the textbox (stored in the state).
  * @return {fetch} Response from the fetch statement for updating the post.
  */
  updatePost = async () => {
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.props.route.params.userId + '/post/' + this.props.route.params.postId, {
      method: 'PATCH',
      headers: {
        'X-Authorization': token, // Assign the auth key to verify account
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: this.state.userTextToPost,
      }),
    })
        .then((response) => {
          if (response.status === 200) {
            // If the friends first name is passed in, go to the friends screen,
            // or if the first first name hasn't changed from 'profile' go back
            // to profile screen
            if (this.props.route.params.friendFirstName === 'Profile') {
              this.props.navigation.navigate('ProfileScreen');
            } else {
              this.props.navigation.navigate('FriendsScreen');
            }
            this.setState({
              userTextToPost: '',
            });
          } else if (response.status === 401) {
            this.props.navigation.navigate('LoginScreen');
          } else if (response.status === 403) {
            throw new Error('You can only update your own posts');
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
  * update post screen.
  * @return {View} The container for the update post screen.
  */
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>
            {'Update post'}
          </Text>
          <FlatList style={styles.flatList}>
            <Text style={styles.text}>
              {'Loading post...'}
            </Text>
          </FlatList>
        </View>
      );
    } else {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>
            {'Update post'}
          </Text>
          <View style={styles.listPost}>
            <View style={styles.cardBackground}>
              <Text style={styles.boldText}>
                {'Post from ' + this.state.postToUpdateData.author.first_name +
                  ' ' + this.state.postToUpdateData.author.last_name + ':'}
                {'\n'}{'\n'}
              </Text>
              <TextInput style={styles.textInput}
                placeholder={this.state.postToUpdateData.text}
                onChangeText={(userTextToPost) =>
                  this.setState({userTextToPost})}
                value={this.state.userTextToPost}/>
              <Text style={styles.boldText}>
                {'\n'}{new Date(
                    this.state.postToUpdateData.timestamp).toDateString() +
                  ' | Likes: ' + this.state.postToUpdateData.numLikes}
                {'\n'}{'\n'}
              </Text>
              <View style={styles.flexContainerButtons}>
                <TouchableOpacity style={styles.button}
                  onPress={() => this.updatePost()}>
                  <Text style={styles.buttonText}>
                    {'Update post'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  flexContainerButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listPost: {
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
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: Colors.darkerBackground,
    color: Colors.text,
  },
  lineSeperator: {
    margin: 5,
    padding: 1,
    borderRadius: 10,
    backgroundColor: Colors.lineBreak,
  },
});

export default UpdatePostScreen;
