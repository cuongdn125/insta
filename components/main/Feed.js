import React, {useState, useEffect, useCallback} from 'react';
import { ScrollView, RefreshControl, StyleSheet, Text, SafeAreaView, FlatList, View } from 'react-native';
import Constants from 'expo-constants';

import firebase from 'firebase'

export default function Feed() {
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);


  

  const fetchData = async () => {
    const data = [];
    await firebase.firestore()
            .collection("users")
            .get()
            .then( response => {
                response.docs.map(doc => {
                  let user = doc.data();
                  let id = doc.id;
                  firebase.firestore()
                    .collection("posts")
                    .doc(id)
                    .collection("userPosts")
                    .get()
                    .then(response => {
                      response.docs.map(doc => {
                        let post = doc.data();
                        data.push({
                          ...post,
                          ...user,
                          id
                        })
                      })
                    })
                })
            })
            .then(() => {
              console.log(data)
            })
            .catch(err => {console.log(err)})
  }

  useEffect(() => {
    fetchData()
  },[]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  
});