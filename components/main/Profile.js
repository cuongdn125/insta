import React, {useState, useEffect, useCallback} from 'react'
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, ScrollView,RefreshControl } from 'react-native'

import {connect } from 'react-redux'
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/firebase-storage'

import * as ImagePicker from 'expo-image-picker';

const {height, width} = Dimensions.get('window');


function Profile(props) {
    const { currentUser, posts} = props;
    const { uid } = props.route.params;

    const [statePosts, setStatePosts] = useState(null);
    const [user, setUser] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    
    
    useEffect(() => {
        if(uid === firebase.auth().currentUser.uid) {

            firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "desc")
            .get()
            .then((response) => {
                let newPosts = response.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        ... data,
                        id
                    }
                })
                setStatePosts(newPosts);
                setUser(currentUser);
            })
            .catch((error) => {console.error(error);})
        } else {

            firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((response) => {
                setUser(response.data());
            })
            .catch((error) => {console.error(error);})


            firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "desc")
            .get()
            .then((response) => {
                let newPosts = response.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        ... data,
                        id
                    }
                })
                // console.log(newPosts)
                setStatePosts(newPosts);
            })
            .catch((error) => {console.error(error);})
        }
        
    },[uid])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "desc")
            .get()
            .then((response) => {
                let newPosts = response.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        ... data,
                        id
                    }
                })
                setStatePosts(newPosts);
                setRefreshing(false);
            })
            .catch((error) => {console.error(error);})
    }, []);

    const takeAvatar =async () => {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
            setAvatar(result.uri);
            const pathImg = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
            const response = await fetch(result.uri);
            const blob = await response.blob();
            const task = firebase
                .storage()
                .ref()
                .child(pathImg)
                .put(blob);

            const taskProgess = snapshot => {
                console.log(`transferredAvatar: ${snapshot.bytesTransferred}`);
            }
            const taskCompleted = () => {
                task.snapshot.ref.getDownloadURL().then(snapshot => {
                    saveAvatar(snapshot);
                    console.log(snapshot);
                });
            }
            const taskError = snapshot => {
                console.log(snapshot);
            }

            task.on("state_changed", taskProgess, taskError, taskCompleted);
            
            
        }
    }

    const saveAvatar = (avatarURL) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({
                avatar: avatarURL,
            })
    }


    if(!user || !statePosts) {
        return (<View></View>)
    }
    return (
        <View style={styles.container}>
            
                <View style={styles.userContainer}>
                    <View style={{
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                    }}>
                        {uid === firebase.auth().currentUser.uid ? 
                            <TouchableOpacity style={{ flex: 1}} onPress={() => takeAvatar()}>
                                {!user.avatar ? 
                                    <Image 
                                        source={{uri: "https://img1.kienthucvui.vn/uploads/2019/10/10/anh-chibi-naruto_110701874.jpg"}}
                                        style={{
                                            flex: 1,
                                            borderColor: "#cccac9",
                                            borderWidth: 1,
                                            borderRadius: 40
                                        }}
                                    /> : 
                                    <Image 
                                        source={{uri: user.avatar}}
                                        style={{
                                            flex: 1,
                                            borderColor: "#cccac9",
                                            borderWidth: 1,
                                            borderRadius: 40
                                        }}
                                    /> 
                                }
                            </TouchableOpacity> : 
                            <View style={{flex: 1}} >
                                {!user.avatar ? 
                                    <Image 
                                        source={{uri: "https://img1.kienthucvui.vn/uploads/2019/10/10/anh-chibi-naruto_110701874.jpg"}}
                                        style={{
                                            flex: 1,
                                            borderColor: "#cccac9",
                                            borderWidth: 1,
                                            borderRadius: 40
                                        }}
                                    /> : 
                                    <Image 
                                        source={{uri: user.avatar}}
                                        style={{
                                            flex: 1,
                                            borderColor: "#cccac9",
                                            borderWidth: 1,
                                            borderRadius: 40
                                        }}
                                    /> 
                                }
                            </View>
                        
                        }
                    </View>
                    <View style={{
                        marginLeft: 30
                    }}>
                        <Text style={{
                            fontSize: 25,
                            marginBottom: 10,
                            fontWeight: "600"
                        }}>{user.name}</Text>
                        <TouchableOpacity style={styles.buttonEdit}>
                            <Text style={{fontWeight: "600"}}>Chỉnh sửa thông tin cá nhân</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#dbdbdb',
                }}>
                    <Text style={{fontWeight: "700"}}>{statePosts.length}</Text>
                    <Text style={{ color: '#979797'}}>bài viết</Text>
                </View>
                <SafeAreaView  style={styles.postsContainer}>
                    <FlatList 
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        data={statePosts}
                        horizontal={false}
                        numColumns={3}
                        keyExtractor={item => item.id}
                        renderItem={({item}) =>(
                                <Image
                                    source= {{uri: item.downloadURL}}
                                    style={{
                                        width: width/3,
                                        height: width/3,
                                        margin: 1
                                    }}
                                />
                        )}
                    />
                </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
    },
    userContainer: {
        height: height/5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    postsContainer: {
        flex: 1,
        marginTop: -1
    },
    buttonEdit: {
        width: width/2,
        height: 30,
        borderColor: '#dbdbdb',
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
})

export default connect(mapStateToProps, null)(Profile)