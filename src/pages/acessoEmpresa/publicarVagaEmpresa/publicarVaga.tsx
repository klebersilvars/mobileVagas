import React from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import PublicarVagaStyle from './publicarVagaStyle'
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PublicarVaga() {
    return(
        <SafeAreaView style={PublicarVagaStyle.container}>
            <View style={PublicarVagaStyle.title_PublicarVaga}>
                <Text style={PublicarVagaStyle.title_NovosTalentos}>NovosTalentos</Text>
                <TouchableOpacity style={PublicarVagaStyle.bottomPublicarVaga}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Publicar</Text>
                </TouchableOpacity>
            </View>

            <View style={PublicarVagaStyle.containerInput}>
                <TextInput 
                placeholder='Publique sua vaga abaixo' 
                multiline
                numberOfLines={20}
                style={{fontSize: 18,}}
            />
            </View>
        </SafeAreaView>
    )
}