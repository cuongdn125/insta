import React, { useState } from 'react';
import {Text, View, TouchableOpacity ,Image, Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('screen');

export default function Landing({navigation}) {

    return (
        <View style={{ flex: 1, backgroundColor:'white' }}>

            <Image 
                source={require('../../assets/img/image.jpg')}
                style={{
                    width: '100%',
                    height: '40%'
                }}
            />
            <View style={styles.groupsButton}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Login')}
                    style={styles.button}
                ><Text style={styles.textButton}>Login</Text></TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Register')}
                    style={styles.button}
                ><Text  style={styles.textButton}>Register</Text></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    groupsButton: {
        marginTop: height/15,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#4562cc',
        width: width/1.8,
        height: height/17,
        justifyContent: 'center',
        marginBottom: height/35,
        borderRadius: 20
    },
    textButton: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15
    }

})