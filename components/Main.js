import React, { useEffect } from 'react'
import { View, Text} from 'react-native';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, fetchUserPost } from '../redux/actions';

import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import SearchScreen from './main/Search';

import firebase from 'firebase'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () =>{
    return (null)
}

function Main({fetchUser, fetchUserPost,posts}) {
    useEffect(() => {
        fetchUser();
        fetchUserPost();
    },[]);
    
    return (
        <Tab.Navigator initialRouteName='Feed' labeled={false}>
            <Tab.Screen name="Feed" component={FeedScreen} 
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen name="AddContainer" component={EmptyScreen} 
                listeners={({navigation}) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Add");
                    }
                })}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="plus-box" color={color} size={26} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen name="Profile" component={ProfileScreen}
                listeners={({navigation}) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid});
                    }
                })}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen name="Search" component={SearchScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={26} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
})
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPost}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);