// eslint-disable-next-line max-len
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Camera} from 'expo-camera';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../constants/colors.js';

/**
 * Camera screen class allowing users to take pictures using the
 * front or back devices hardware camera so they can update their
 * user accounts profile picture.
 * @param {const} data The image taken from the camera to upload.
 * @return {render} Renders the camera screen.
 */
class CameraScreen extends Component {
  /**
    * Constuctor for the camera screen component class inheriting properties
    * from the Component class
    * @param {Component} props Inherited properties for the components.
  */
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  /**
  * Instantiate network request to load data, call the function to retrieve data
  */
  async componentDidMount() {
    const {status} = await Camera.requestCameraPermissionsAsync();
    this.setState({hasPermission: status === 'granted'});
  }

  /**
  * Function which sends the captured picture to the server and uploads
  * the image to the users profile image.
  * @param {Image} data The image file to upload to the users profile picture.
  */
  sendToServer = async (data) => {
    const user = await AsyncStorage.getItem('@user_id');
    const token = await AsyncStorage.getItem('@session_token');
    const res = await fetch(data.base64);
    const blob = await res.blob();
    return fetch('http://localhost:3333/api/1.0.0/user/' + user.toString() + '/photo', {
      method: 'POST',
      headers: {
        'X-Authorization': token,
        'Content-Type': 'image/png',
      },
      body: blob,
    })
        .then((response) => {
          if (response.status === 200) {
            console.log('Picture added', response);
            this.props.navigation.navigate('AccountScreen');
          } else if (response.status === 401) {
            this.props.navigation.navigate('LoginScreen');
          } else if (response.status === 404) {
            throw new Error('Not found...');
          } else {
            throw new Error('Something went wrong');
          }
        })
        .catch((err) => {
          console.log(err);
        });
  };

  /**
  * Function which captures the picture from the camera and configures
  * the options of the picture such as quality.
  */
  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
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
  * Renders the GUI allowing users to navigate and interact with
  * camera screen.
  * @return {View} The container for the camera screen.
  */
  render() {
    if (this.state.hasPermission) {
      return (
        <View style={styles.flexContainer}>
          <Camera style={styles.camera}
            type={this.state.type}
            ref={(ref) => this.camera = ref}>
            <View style={styles.flexContainerButtons}>
              <TouchableOpacity style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}>
                <Text style={styles.text}>
                  {'Take Photo'}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    } else {
      return (
        <View style={styles.flexContainer}>
          <Text style={styles.boldText}>
            {'No access to camera.'}
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'bottom',
    justifyContent: 'space-between',
  },
  flexContainerButtons: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 0,
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
  button: {
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
  lineSeperator: {
    margin: 5,
    padding: 1,
    borderRadius: 10,
    backgroundColor: Colors.lineBreak,
  },
  camera: {
    flex: 1,
  },
});

export default CameraScreen;
