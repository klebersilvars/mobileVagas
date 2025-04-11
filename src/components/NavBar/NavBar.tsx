import React, {useState} from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, Image, Alert} from 'react-native'
import { db } from '../../firebase/firebase'
import { auth } from '../../firebase/firebase'
import { collection, where, query } from 'firebase/firestore'
import { StyleLoginNavBar } from './NavBarStyle'

export default function NavBar() {

    function imagemAviso(){
        Alert.alert('Aviso', 'Implementação futura!')
    }
    
    return(
        <>
            <SafeAreaView>
                <View style={StyleLoginNavBar.containerNavBar}>
                    <View> 
                        <TouchableOpacity onPress={imagemAviso}>
                            
                            <Image style={StyleLoginNavBar.imageHomemPerfil} source={require('../../../assets/homem.png')}/>
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