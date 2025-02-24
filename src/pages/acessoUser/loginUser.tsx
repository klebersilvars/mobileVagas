import React, {useState} from 'react'
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native'
import { db } from '../../firebase/firebase'
import { auth } from '../../firebase/firebase'
import { collection, where, query } from 'firebase/firestore'
import { StyleLoginUser } from './loginUserStyle'
import NavBar from '../../components/NavBar/NavBar'

export default function LoginUser() {

    
    return(
        <>
            <SafeAreaView>
                <NavBar/>
            </SafeAreaView>
        </>
    )
}