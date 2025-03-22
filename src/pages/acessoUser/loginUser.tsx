import React, {useState} from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, StyleSheet} from 'react-native'
import { db } from '../../firebase/firebase'
import { auth } from '../../firebase/firebase'
import { collection, where, query } from 'firebase/firestore'
import { StyleLoginUser } from './loginUserStyle'
import NavBar from '../../components/NavBar/NavBar'
import InterfacePublicacao from './interfacePublicacao/InterfacePublicacao'

export default function LoginUser() {

    
    return(
        <>
            <SafeAreaView style={styles.container}>
                <NavBar/>
                <InterfacePublicacao/>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})