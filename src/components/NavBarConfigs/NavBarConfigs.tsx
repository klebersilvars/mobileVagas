import React from 'react'
import {View, StyleSheet, Text, SafeAreaView} from 'react-native'

export default function NavBarConfigs() {
    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.titleConfigs}>Configurações</Text>
        </SafeAreaView>
    )
}

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleConfigs: {
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold'
    }
})