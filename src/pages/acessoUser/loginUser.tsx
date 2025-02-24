import React, {useState} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import { db } from '../../firebase/firebase'
import { auth } from '../../firebase/firebase'
import { collection, where, query } from 'firebase/firestore'

export default function LoginUser() {

    
    return(
        <>
            <View>
                <Text>Página de usuário logada</Text>
            </View>
        </>
    )
}