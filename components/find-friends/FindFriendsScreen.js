// eslint-disable-next-line max-len
import {StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../constants/colors.js';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

/**
 * Find friends screen class allowing users to find users to send
 * a friend request to.
 * @param {int} userId The user id of the user to send a request to.
 * @return {render} Renders the account screen.
 */
class FindFriendsScreen extends Component {
  /**
  * Constuctor for the find friends screen component class inheriting properties
  * from the Component class
  * @param {Component} props Inherited properties for the components.
  */
  constructor(props) {
    super(props);
    this.state = {
      userToFind: '',
      isLoading: true,
      allUsersData: [],
      userFriendsData: [],
    };
  }

  /**
  * Instantiate network request to load data, call the function to retrieve data
  */
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getUsers();
      this.getFriends();
    });
  }

  /**
  * Allows the execution of React code when component unmounted from DOM tree
  */
  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
  * Function loading all of the users registered to the app into the
  * DOM tree from server.
  * @return {fetch} Response from the fetch statement for getting all users.
  */
  getUsers = async () => {
    try {
      // Store the auth key as a constant - retrieved from async storage,
      // used to authenticate requests.
      const token = await AsyncStorage.getItem('@session_token');
      return fetch('http://localhost:3333/api/1.0.0/search', {
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
            } else if (response.status === 500) {
              throw new Error('Server error');
            } else {
              throw new Error('Something went wrong');
            }
          })
          .then((responseJson) => {
            this.setState({
              isLoading: false,
              allUsersData: responseJson,
            });
          })
          .catch((error) =>{
            console.log(error);
          });
    } catch (error) {
      toast.error('Something went wrong. Please try again!');
      console.log('There was an error making the request: ' + error);
    }
  };

  /**
  * Function which finds specifically searched users from the search box.
  * @return {fetch} Response from the fetch statement for getting all users
  * which match the keywords in the search box.
  */
  findUser = async () => {
    try {
      const token = await AsyncStorage.getItem('@session_token');
      return fetch('http://localhost:3333/api/1.0.0/search?q=' + this.state.userToFind.toString() + '&limit=20', {
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
            } else if (response.status === 500) {
              throw new Error('Server error');
            } else {
              throw new Error('Something went wrong');
            }
          })
          .then((responseJson) => {
            this.setState({
              allUsersData: responseJson,
              userToFind: '', // Reset user to find so can search new users
            });
          })
          .catch((error) => {
            console.log(error);
          });
    } catch (error) {
      toast.error('Something went wrong. Please try again!');
      console.log('There was an error making the request: ' + error);
    }
  };

  /**
  * Function sending a fetch request to the server to send a friend request
  * to a friend.
  * @param {int} userId The user id of the user to send a request to.
  * @return {fetch} Response from the fetch statement for adding a user.
  */
  addFriend = async (userId) => {
    try {
      const token = await AsyncStorage.getItem('@session_token');
      return fetch('http://localhost:3333/api/1.0.0/user/' + userId.toString() + '/friends', {
        method: 'POST',
        headers: {
          'X-Authorization': token, // Assign the auth key to verify account
        },
      })
          .then((response) => {
            if (response.status === 201) {
              toast.success('Request sent successfully!');
              this.getUsers();
            } else if (response.status === 401) {
              this.props.navigation.navigate('LoginScreen');
            } else if (response.status === 403) {
              toast.error('Waiting for this user to accept your request!');
              throw new Error('Already sent this person a friend request!');
            } else if (response.status === 500) {
              throw new Error('Server error');
            } else {
              throw new Error('Something went wrong');
            }
          })
          .catch((error) =>{
            console.log(error);
          });
    } catch (error) {
      toast.error('Something went wrong. Please try again!');
      console.log('There was an error making the request: ' + error);
    }
  };

  /**
  * Function loading all of the users friends from the server. This is
  * used to check if a user is already friends with someone and won't display
  * there name in the find friends screen if so.
  * @return {fetch} Response from the fetch statement for getting all
  * friends.
  */
  getFriends = async () => {
    try {
    // Store the auth key as a constant - retrieved from async storage
      const userId = await AsyncStorage.getItem('@user_id');
      const token = await AsyncStorage.getItem('@session_token');
      return fetch('http://localhost:3333/api/1.0.0/user/' + userId.toString() + '/friends', {
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
            } else if (response.status === 500) {
              throw new Error('Server error');
            } else {
              throw new Error('Something went wrong');
            }
          })
          .then((responseJson) => {
            this.setState({
              userFriendsData: responseJson,
            });
            this.removeFriendsFromUsers();
          })
          .catch((error) =>{
            console.log(error);
          });
    } catch (error) {
      toast.error('Something went wrong. Please try again!');
      console.log('There was an error making the request: ' + error);
    }
  };

  /**
  * Function which removes all of the users friends list aswell as
  * the user from list of all users add as friends as they are
  * already friends and they cannot add themselves, and this
  * avoids errors.
  */
  removeFriendsFromUsers = async () => {
    const loggedInAccountUserId = await AsyncStorage.getItem('@user_id');
    // Remove friends from the users list to add
    for (let i=0; i<this.state.allUsersData.length; i++) {
      for (let j=0; j<this.state.userFriendsData.length; j++) {
        const user = parseInt(this.state.allUsersData[i]['user_id']);
        const friend = parseInt(this.state.userFriendsData[j]['user_id']);
        if (user === friend) {
          this.state.allUsersData.splice(i, 1);
        }
      }
    }
    // Remove logged in user from the users list
    for (let i=0; i<this.state.allUsersData.length; i++) {
      for (let j=0; j<this.state.userFriendsData.length; j++) {
        const user = parseInt(this.state.allUsersData[i]['user_id']);
        if (user === parseInt(loggedInAccountUserId)) {
          this.state.allUsersData.splice(i, 1);
        }
      }
    }
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
   * Resets the list of users if the user has previously searched for a
   * specific keyword in the search bar and results are filtered.
   */
  reset = () => {
    this.getUsers();
    this.getFriends();
  };

  /**
  * Renders the GUI allowing users to navigate and interact with
  * find friends screen.
  * @return {View} The container for the find friends screen.
  */
  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>
            {'Find friends'}
          </Text>
          <FlatList style={styles.flatList}>
            <Text style={styles.text}>
              {'Loading users...'}
            </Text>
          </FlatList>
        </View>
      );
    } else {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.title}>
            {'Find friends'}
          </Text>
          <View style={styles.searchUserView}>
            <TextInput style={styles.textInput}
              placeholder="Enter name here..."
              onChangeText={(userToFind) => this.setState({userToFind})}
              value={this.state.userToFind}/>
            <View style={styles.flexContainerButtons}>
              <TouchableOpacity style={styles.button}
                onPress={() => this.findUser()}>
                <Text style={styles.buttonText}>
                  {'Search'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}
                onPress={() => this.reset()}>
                <Text style={styles.buttonText}>
                  {'Reset'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.lineSeperator}></View>
          </View>
          <FlatList style={styles.flatList}
            data={this.state.allUsersData}
            renderItem={({item, index}) => (
              <View style={styles.cardBackground}>
                <Text style={styles.boldText}>
                  {'Username: ' + item.user_givenname + ' ' +
                  item.user_familyname} {'\n'}{'\n'}
                </Text>
                <View style={styles.flexContainerButtons}>
                  <TouchableOpacity style={styles.button}
                    onPress={() => this.addFriend(item.user_id)}>
                    <Text style={styles.buttonText}>
                      {'Send ' + item.user_givenname + ' a friend request'}
                    </Text>
                  </TouchableOpacity>
                </View>
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
  searchUserView: {
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

export default FindFriendsScreen;
