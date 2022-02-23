/* eslint-disable require-jsdoc */
// import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Text, FlatList,
  TouchableOpacity} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../components/constants/colors.js';
import 'react-native-gesture-handler';

class ViewSinglePost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nonAsyncUserId: '',
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
    this.getSinglePost();
  }

  /**
  * Allows the execution of React code when component unmounted from DOM tree
  */
  componentWillUnmount() {
    this.unsubscribe();
  }

  getSinglePost = async () => {
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');
    return fetch('http://localhost:3333/api/1.0.0/user/' + user.toString() + '/post/' + this.props.route.params.postId, {
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
        .catch((error) => {
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

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>View post</Text>
          <FlatList style={styles.flatList}>
            <Text style={styles.text}>
              Loading post...
            </Text>
          </FlatList>
        </View>
      );
    } else {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>View post</Text>
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
                  {item.author.user_id.toString() !==
                    this.state.nonAsyncUserId.toString() ?
                    <></> :
                    <><TouchableOpacity style={styles.button}
                      onPress={() => this.deletePost(item.post_id)}>
                      <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity><TouchableOpacity style={styles.button}
                      onPress={() => console.log('worked')}>
                      <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity></> }
                  {item.author.user_id.toString() ===
                    this.state.nonAsyncUserId.toString() ?
                    <></> :
                    <><TouchableOpacity style={styles.button}
                      onPress={() =>
                        this.likePost(item.author.user_id, item.post_id)}>
                      <Text style={styles.buttonText}>Like</Text>
                    </TouchableOpacity><TouchableOpacity style={styles.button}
                      onPress={() =>
                        this.dislikePost(item.author.user_id, item.post_id)}>
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
 * Functionality to update posts, view them
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
  lineSeperator: {
    margin: 5,
    padding: 1,
    borderRadius: 10,
    backgroundColor: Colors.lineBreak,
  },
});

export default ViewSinglePost;
