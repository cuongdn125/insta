import React, { useState } from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import firebase from 'firebase';

export default function Login({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSignIn = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {console.log(error)})
    }

    return (
        <View style={{justifyContent: 'center', flex: 1}}>
           <TextInput 
                placeholder='email'
                onChangeText={setEmail}
                value={email}
           />
           <TextInput 
                placeholder='password'
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
           />
            <Button 
                title="Login"
                onPress={() => onSignIn()}
            />
             <Button 
                title="Register"
                onPress={() => navigation.navigate('Register')}
            />
        </View>
    )
}
