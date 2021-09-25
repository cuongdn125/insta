import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'


const { height, width } = Dimensions.get("window")


export default function Search({navigation}) {
    
    const [users, setUsers] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        firebase.firestore()
        .collection("users")
        .get()
        .then(response => {
            let users = response.docs.map(user => {
                const data = user.data();
                const id = user.id;
                return {
                    ... data,
                    id
                }
            })

            const newUsers = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
            setUsers(newUsers);
            
        })
    }, [search]);

    return (
        <View style={styles.container}>
            <View style={styles.search}>
                <View style={styles.iconSearch}>
                    <MaterialCommunityIcons name="magnify" size={20} />
                </View>
                <TextInput 
                    placeholder="Tìm kiếm"
                    onChangeText={setSearch}
                    value={search}
                    style={styles.inputSearch}
                />
            </View>
            <View style={styles.containerUsers} >
                <FlatList 
                    data={users}
                    keyExtractor={item => item.id}
                    horizontal={false}
                    renderItem={({item}) => (
                        <TouchableOpacity style={styles.user} onPress={() => navigation.navigate("Profile", {uid: item.id})}>
                            <View style={styles.avatar}>
                                {!item.avatar ? 
                                    <MaterialCommunityIcons name="account-circle" size={65} color="#5e5e57"/> : 
                                    <Image 
                                        source={{uri: item.avatar}}
                                        style={styles.img}
                                    />
                                }
                            </View>
                            <View>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.email}>{item.email}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },  
    search: {
        marginTop: 40,
        marginHorizontal: 40,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dddddd',
        borderRadius: 8,
        paddingHorizontal: 10, 
        paddingVertical: 5,
        marginBottom: 20,
    },
    iconSearch: {
        marginRight: 6
    },
    inputSearch: {
        flex: 1
    },
    containerUsers: {
        flex: 1,
        borderTopWidth: 1,
        borderColor: '#dddddd',
        justifyContent: 'center',
    },
    user: {
        height: height/8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginRight: 20
    },
    img: {
        flex: 1,
        borderColor: "#cccac9",
        borderWidth: 1,
        borderRadius: 30
    },
    name: {
        fontSize: 16,
        fontWeight: '700'
    },
    email: {
        color: "#979797",
        fontSize: 14,
        fontWeight: '700'
    }

})