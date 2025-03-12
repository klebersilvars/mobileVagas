import React from 'react'
import { SafeAreaView, TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native'
import NavBarConfigs from '../../../components/NavBarConfigs/NavBarConfigs'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../../../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../../routes/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RouterHomeExit = StackNavigationProp<RootStackParamList>;

export default function ConfiguracoesEmpresa() {

    function alertaVersao() {
        Alert.alert('Aviso', 'O aplicativo se encontra na versão BETA')
    }

    const navigation = useNavigation<RouterHomeExit>()

    async function deslogarConta() {
        try {
            await signOut(auth)
            Alert.alert('Aviso!', 'Usuário deslogado!')
            navigation.navigate('PageEntrarEmpresa')
            await AsyncStorage.removeItem('userEmpresaLogado')
        }catch {
            Alert.alert('Erro!', 'Tente novamente mais tarde!')
        }
    }
    return (
        <SafeAreaView>
            <NavBarConfigs />

            <View style={styles.container}>

            
                <TouchableOpacity onPress={alertaVersao} style={styles.buttonDeslogarConta}>
                    <Text style={styles.textVersionApp}>Versão do aplicativo</Text>
                    <MaterialCommunityIcons
                                name="arrow-right"
                                size={25}
                                color={'black'}
                                style={styles.iconArrow}
                            />
                </TouchableOpacity>

                <TouchableOpacity onPress={deslogarConta} style={styles.buttonDeslogarConta}>
                    <Text style={styles.textDeslogarConta}>Deslogar conta</Text>
                    <MaterialCommunityIcons
                                name="exit-to-app"
                                size={25}
                                color={'red'}
                                style={styles.iconExitApp}
                            />
                </TouchableOpacity>


            </View>
        </SafeAreaView>
    )
}

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    buttonDeslogarConta: {
        backgroundColor: 'white',
        height: 50,
        width: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 1,
        flexDirection: 'row',
        gap: 5,
    },
    textDeslogarConta: {
        color: 'red'
    },
    textAssinaturaConta: {
        color: 'black',
        fontWeight: 'bold'
    },
    textVersionApp: {
        color: 'black'
    },
    iconArrow: {
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 20,
        top: 14,
    },
    iconExitApp: {
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 20,
        top: 14,
    }
})