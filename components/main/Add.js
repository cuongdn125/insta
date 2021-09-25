import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, TextInput, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker';

import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/firebase-storage'

// import { fetchUserPost } from'../../redux/actions';

const {width, height} = Dimensions.get('screen');

export default function Add({navigation}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const [camera, setCamera] = useState(null);

  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);


  const takePicture = async () => {
    if(camera) {
        const data = await camera.takePictureAsync();
        console.log(data.uri);
        setImage(data.uri);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {

    setLoading(true);
    const pathImg = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
    const response = await fetch(image);
    const blob = await response.blob();
    const task = firebase
        .storage()
        .ref()
        .child(pathImg)
        .put(blob);

    const taskProgess = snapshot => {
        console.log(`transferred: ${snapshot.bytesTransferred}`);
    }
    const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then(snapshot => {
            savePost(snapshot);
            console.log(snapshot);
        });
    }
    const taskError = snapshot => {
        console.log(snapshot);
    }

    task.on("state_changed", taskProgess, taskError, taskCompleted);
  }

  const savePost = (downloadURL) => {
      firebase.firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
          downloadURL,
          caption,
          creation: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
          setLoading(false);
          navigation.navigate("Feed")
        })
  }


  useEffect(() => {
    (async () => {
        const cameraStatus = await Camera.requestPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setHasGalleryCameraPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === null || hasGalleryPermission === null ) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if(!loading){
      return (
            <View style={styles.container}>
                {!image && 
                <View style={{flex: 1}}>
                    <View style={styles.cameraContainer}>
                        <Camera style={styles.camera} type={type} ratio={'1:1'} ref={ref => setCamera(ref)}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                    setType(
                                        type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                    );
                                    }}>
                                    <View style={styles.cameraFlip}>
                                        <MaterialCommunityIcons name='sync-circle' size={25} color='white' />
                                    </View>
                                    
                                </TouchableOpacity>
                            </View>
                            <View style={{ position: 'absolute', bottom: 10, right:width/2-30 }}>
                                <TouchableOpacity style={styles.buttonTakePicture} onPress={() => takePicture()}>
                                    <MaterialCommunityIcons name="circle-slice-8" size={60} color='white' />
                                </TouchableOpacity>
                            </View>
                        </Camera>
                    </View>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <TouchableOpacity onPress={() => pickImage()} style={{height: 50, width: 200, backgroundColor: 'green'}}>
                            <Text style={{color: 'white'}}>Take Image</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                }
                
                {image && <View style={{flex: 1,}}>
                            <View style={{ height: width, }}>
                                <Image 
                                    source={{uri: image}}
                                    style={{
                                        flex: 1,
                                    }}
                                />
                            </View>
                            <View style={{}}>
                                <TextInput 
                                    placeholder='viet vao day'
                                    onChangeText={setCaption}
                                    value={caption}
                                />
                                <TouchableOpacity onPress={() => uploadImage()}>
                                    <Text>Post</Text>
                                </TouchableOpacity>
                            </View>
                    </View>}
            </View>
        
      );
  } 
  else if(loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
      flex: 1,
      flexDirection: 'row'
    },
    camera: {
      flex: 1,
      aspectRatio: 1,
    },
    buttonContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
    },
    button: {
      flex: 0.1,
      alignItems: 'center',
    },
  });
  