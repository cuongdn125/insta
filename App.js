import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from 'firebase/app';
import 'firebase/auth';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

import LoginScreen from './components/auth/Login';
import RegisterScreen from './components/auth/Register';
import LandingScreen from './components/auth/Landing';
import MainScreen from './components/Main';
import AddScreen from './components/main/Add';

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

const Stack = createStackNavigator();


const firebaseConfig = {
  apiKey: "AIzaSyDKd5rXNwOqM310tCshALsdsixe71uc4NM",
  authDomain: "instagram-11bf5.firebaseapp.com",
  projectId: "instagram-11bf5",
  storageBucket: "instagram-11bf5.appspot.com",
  messagingSenderId: "821643387044",
  appId: "1:821643387044:web:9b3c166d66af82e5f2c631",
  measurementId: "G-CS41L6VBRG"
};
if(firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);

}


export default function App() {

  const [loading, setLoading] = useState(false);
  const [isLoggin, setisLoggin] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if(!user) {
        setisLoggin(false);
        setLoading(true);
      }else{
        setisLoggin(true);
        setLoading(true);
      }
    })
  },[])

  if(!loading) {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Text>Loading....</Text>
      </View>
    )
  }
  if(!isLoggin){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Landing'>
          <Stack.Screen name='Landing' component={LandingScreen} options={{headerShown: false}} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Register' component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <Provider store={store}>
       <NavigationContainer>
        <Stack.Navigator initialRouteName='Main'>
          <Stack.Screen name='Main' component={MainScreen} options={{headerShown: false}} />
          <Stack.Screen name='Add' component={AddScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
    
  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
