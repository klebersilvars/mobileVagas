import React from 'react'
import {View, StyleSheet, Text} from 'react-native'

export default function NavBarConfigs() {
    return(
        <View style={styles.container}>
            <Text style={styles.titleConfigs}>Configurações</Text>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
    },
    titleConfigs: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    }
})