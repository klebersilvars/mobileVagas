import React, {useState} from 'react'
import {View, Text, SafeAreaView, TouchableOpacity, Image, Alert} from 'react-native'
import { db } from '../../firebase/firebase'
import { auth } from '../../firebase/firebase'
import { collection, where, query } from 'firebase/firestore'
import { StyleLoginNavBar } from './NavBarStyle'
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../../routes/RootTabParamList';

type NavigationProp = BottomTabNavigationProp<RootTabParamList>;

export default function NavBar() {
    const navigation = useNavigation<NavigationProp>();

    function imagemAviso(){
        navigation.navigate('Perfil');
    }
    
    return(
        <>
            <SafeAreaView>
                <View style={StyleLoginNavBar.containerNavBar}>
                    <View> 
                        
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