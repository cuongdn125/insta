import firebase from 'firebase';
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE } from '../constants';

export const fetchUser = () => {
    return ((dispatch) => {
        firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
                // console.log(response.data())
                dispatch({
                    type: USER_STATE_CHANGE,
                    currentUser: response.data()
                })
            })
            .catch((error) => {console.error(error);})
    })
}

export const fetchUserPost = () => {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((response) => {
                let posts = response.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;
                    return {
                        ... data,
                        id
                    }
                })
                // console.log(posts)
                dispatch({
                    type: USER_POSTS_STATE_CHANGE,
                    posts
                })
            })
            .catch((error) => {console.error(error);})
    })
}