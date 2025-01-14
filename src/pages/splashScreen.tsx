import React, {useEffect} from 'react'
import { View, SafeAreaView, StyleSheet, Image, Text} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../../routes/RootStackParamList'

type SplashScreenNavigation = StackNavigationProp<RootStackParamList>
export default function SplashScreen() {

    const navigation = useNavigation<SplashScreenNavigation>()

    useEffect(() => {
      
    }, [])
    
    return (
        <>
        
            <SafeAreaView>
                <Image source={require('../../assets/novos_talentos_logo_fundo.png')}/>
                <Text>SplashScreen</Text>
            </SafeAreaView>

        </>

    )
}