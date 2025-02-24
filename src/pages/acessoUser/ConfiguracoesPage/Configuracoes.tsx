import React from 'react'
import { SafeAreaView, TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native'
import NavBarConfigs from '../../../components/NavBarConfigs/NavBarConfigs'

export default function ConfiguracoesUser() {

    function alertaVersao() {
        Alert.alert('Aviso', 'O aplicativo se encontra na versão BETA')
    }
    return (
        <SafeAreaView>
            <NavBarConfigs />

            <View style={styles.container}>

                <TouchableOpacity onPress={alertaVersao} style={styles.buttonDeslogarConta}>
                    <Text style={styles.textVersionApp}>Versão do aplicativo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonDeslogarConta}>
                    <Text style={styles.textDeslogarConta}>Deslogar conta</Text>
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
    },
    textDeslogarConta: {
        color: 'red'
    },
    textVersionApp: {
        color: 'black'
    }
})