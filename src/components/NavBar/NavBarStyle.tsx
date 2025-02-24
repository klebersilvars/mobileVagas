import React from 'react'
import { StyleSheet } from 'react-native'

export const StyleLoginNavBar = StyleSheet.create({
    containerNavBar: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    titleNavBar:{
        fontWeight: 'bold',
        fontSize: 20,
    }
})
