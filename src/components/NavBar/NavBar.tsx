import React, {useState} from 'react'
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native'
import { db } from '../../firebase/firebase'
import { auth } from '../../firebase/firebase'
import { collection, where, query } from 'firebase/firestore'
import { StyleLoginNavBar } from './NavBarStyle'

export default function NavBar() {

    
    return(
        <>
            <SafeAreaView>
                <View style={StyleLoginNavBar.containerNavBar}>
                    <View> 
                        <TouchableOpacity>
                            <Text>Foto</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={StyleLoginNavBar.titleNavBar}>NovosTalentos</Text>
                    </View>
                    
                    <View></View> 
                </View>
            </SafeAreaView>
        </>
    )
}