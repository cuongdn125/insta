import React, { useState } from 'react'
import {View, Button, TextInput} from 'react-native'
import firebase from 'firebase'


export default function Register({navigation}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSignUp = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(result => {
            console.log(result);
            firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({
                name,
                email
            })
        })
        .catch(err => {console.log(err)})
    }
    return (
       <View style={{justifyContent: 'center', flex: 1}}>
           <TextInput 
                placeholder='name'
                onChangeText={setName}
                value={name}
           />
           <TextInput 
                placeholder='email'
                onChangeText={setEmail}
                value={email}
           />
           <TextInput 
                placeholder='password'
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
           />
           <Button 
                title='Sign Up'
                onPress={() => onSignUp()}
           />
       </View>
    )
}

