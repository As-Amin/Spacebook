// eslint-disable-next-line max-len
import {StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../constants/colors.js';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

/**
 * View drafts screen to display the drafts of the user to post on
 * their own or other people profiles, with functionality to edit,
 * schedule, post and delete these posts.
 * @return {render} Renders the profile screen.
*/
class ViewDraftsScreen extends Component {
  /**
  * Constuctor for the view drafts screen component class inheriting
  * properties from the Component class
  * @param {Component} props Inherited properties for the components.
  */
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      userId: '', // ID of user whos profile is being displayed
      loggedInAccountUserId: '', // ID of user whos logged in
      userTextToPost: '',
      // Store all of the draft posts
      allDraftPosts: [],
      draftToPost: '',
      // Time to post the draft post
      timerInputHours: '0',
      timerInputMinutes: '0',
      timerInputSeconds: '0',
    };
  }

  /**
  * Instantiate network request to load data, call the function to retrieve data
  */
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getDraftPosts();
    this.setState({
      userId: this.props.route.params.userId,
    });
  }

  /**
  * Allows the execution of React code when component unmounted from DOM tree
  */
  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
  * Function allowing user to schedule a post on a profile by calling the
  * postOnProfile function after a certain amount of time.
  * @param {String} textToPost The text that the user wants to post from
  * the drafts or directly as a new post.
  * @return {clearTimeout} Clears the timeout so the user can schedule another
  * post with different scheduled time.
  */
  schedulePostOnProfile = ((textToPost) => {
    try {
      toast.info('Post: "' +
        textToPost.toString() +
        '" scheduled successfully!');
      // Convert the time to seconds as a string.
      const timerConvertedHoursStr = (this.state.timerInputHours + '000');
      const timerConvertedHoursInt = parseInt(timerConvertedHoursStr * 120);

      const timerConvertedMinutesStr = (this.state.timerInputMinutes + '000');
      const timerConvertedMinutesInt = parseInt(timerConvertedMinutesStr * 60);

      const timerConvertedSecondsStr = (this.state.timerInputSeconds + '000');
      const timerConvertedSecondsInt = parseInt(timerConvertedSecondsStr);

      const totalTimeToPost = (
        timerConvertedHoursInt +
        timerConvertedMinutesInt +
        timerConvertedSecondsInt);
      // Post the draft to the profile and delete from the drafts
      // after the timer has ended.
      const postToProfile = setTimeout(() =>
        this.postAndDeleteDraft(textToPost), totalTimeToPost);
      this.setState({
        timerInputHours: '0',
        timerInputMinutes: '0',
        timerInputSeconds: '0',
      });
      return () => clearTimeout(postToProfile);
    } catch (error) {
      toast.error('Something went wrong scheduling. Please try again!');
      console.log(error);
    }
  });

  /**
  * Function allowing user to post on the profile of the friend or their
  * own profile.
  * @param {String} textToPost The text that the user wants to post from
  * the drafts or directly as a new post.
  * @return {fetch} Response from the fetch statement for
  * posting a post on the profile.
  */
  postOnProfile = async (textToPost) => {
    try {
      const token = await AsyncStorage.getItem('@session_token');
      return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.userId + '/post', {
        method: 'POST',
        headers: {
          'X-Authorization': token, // Assign the auth key to verify account
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToPost.toString(),
        }),
      })
          .then((response) => {
            if (response.status === 201) {
              this.setState({
                draftToPost: '',
              });
            } else if (response.status === 401) {
              this.props.navigation.navigate('LoginScreen');
            } else if (response.status === 404) {
              throw new Error('Post not found!');
            } else if (response.status === 500) {
              throw new Error('Server error');
            } else {
              throw new Error('Something went wrong');
            }
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
  * Function getting draft posts and storing the posts in an array.
  */
  getDraftPosts = async () => {
    try {
      const drafts = await AsyncStorage.getItem('@draft_posts');
      this.setState({
        allDraftPosts: JSON.parse(drafts),
        isLoading: false,
      });
    } catch (error) {
      // Error getting data
      console.log(error);
    }
  };

  /**
  * Function saving posts as drafts and storing the posts in async
  * storage to post later.
  * @param {String} draftPost The post text to save as a draft in async storage.
  */
  saveAsDraft = async (draftPost) => {
    try {
      const draftPostsAddItem = this.state.allDraftPosts;
      draftPostsAddItem.push(draftPost);
      this.setState({allDraftPosts: draftPostsAddItem});
      await AsyncStorage.setItem('@draft_posts',
          JSON.stringify(this.state.allDraftPosts));
      this.getDraftPosts();
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };

  /**
  * Function deleting draft posts from the draft post array.
  * @param {String} index The post index to delete
  * from async storage.
  */
  deleteDraftPost = async (index) => {
    try {
      const draftPostsRemoveItem = this.state.allDraftPosts;
      draftPostsRemoveItem.splice(index, 1);
      this.setState({allDraftPosts: draftPostsRemoveItem});
      await AsyncStorage.setItem('@draft_posts',
          JSON.stringify(this.state.allDraftPosts));
      this.getDraftPosts();
    } catch (error) {
      // Error deleting data
      console.log(error);
    }
  };

  /**
  * Function posting drafts on the profile and deleting the draft post
  * from the users draft post array.
  * @param {String} draftPost The post text to post and delete from drafts.
  * @param {String} index The index of the draft post in the array.
  */
  postAndDeleteDraft = (draftPost, index) => {
    if (this.state.draftToPost.length !== 0) {
      this.postOnProfile(this.state.draftToPost); // Post the changed draft
    } else {
      this.postOnProfile(draftPost); // Post the unchanged draft
    }
    this.deleteDraftPost(index);
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
            {'Drafts'}
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
            {'Drafts'}
          </Text>
          <View style={styles.postOnProfileView}>
            <TextInput style={styles.textInput}
              placeholder='New draft post here...'
              onChangeText={(userTextToPost) => this.setState({userTextToPost})}
              value={this.state.userTextToPost}/>
            <View style={styles.flexContainerButtons}>
              <TouchableOpacity style={styles.button}
                onPress={() => this.saveAsDraft(this.state.userTextToPost)}>
                <Text style={styles.buttonText}>
                  {'Save as draft'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.lineSeperator}></View>
          </View>
          <FlatList style={styles.flatList}
            data={this.state.allDraftPosts}
            renderItem={({item, index}) => (
              <View style={styles.cardBackground}>
                <Text style={styles.boldText}>
                  {'Draft post: '} {'\n'}
                </Text>
                <TextInput style={styles.textInputDraft}
                  placeholder={item}
                  onChangeText={(draftToPost) =>
                    this.setState({draftToPost})}
                  value={this.state.draftToPost} />
                <View style={styles.flexContainerButtons}>
                  <TouchableOpacity style={styles.button}
                    onPress={() => this.postAndDeleteDraft(item, index)}>
                    <Text style={styles.buttonText}>
                      {'Post'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}
                    onPress={() => this.deleteDraftPost(index)}>
                    <Text style={styles.buttonText}>
                      {'Delete'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.lineSeperatorDark}></View>
                <Text style={styles.boldText}>
                  {'Hours:'}
                </Text>
                <TextInput style={styles.textInputTime}
                  onChangeText={(timerInputHours) =>
                    this.setState({timerInputHours})}
                  value={this.state.timerInputHours}
                  maxLength={5}/>
                <Text style={styles.boldText}>
                  {'Minutes:'}
                </Text>
                <TextInput style={styles.textInputTime}
                  onChangeText={(timerInputMinutes) =>
                    this.setState({timerInputMinutes})}
                  value={this.state.timerInputMinutes}
                  maxLength={2}/>
                <Text style={styles.boldText}>
                  {'Seconds:'}
                </Text>
                <TextInput style={styles.textInputTime}
                  onChangeText={(timerInputSeconds) =>
                    this.setState({timerInputSeconds})}
                  value={this.state.timerInputSeconds}
                  maxLength={2}/>
                <View style={styles.flexContainerButtons}>
                  <TouchableOpacity style={styles.button}
                    onPress={() =>
                      this.schedulePostOnProfile(item)}>
                    <Text style={styles.buttonText}>
                      {'Schedule post'}
                    </Text>
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
  textHighlight: {
    paddingLeft: 7.5,
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.theme,
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
  textInputDraft: {
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: Colors.darkerBackground,
    color: Colors.text,
  },
  textInputTime: {
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
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
  lineSeperatorDark: {
    margin: 5,
    padding: 1,
    borderRadius: 10,
    backgroundColor: Colors.darkerBackground,
  },
});

export default ViewDraftsScreen;
