import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import PublicarVagaStyle from './publicarVagaStyle'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../../../firebase/firebase';
import { collection, addDoc, updateDoc } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function PublicarVaga() {
    const data = moment()
    // Converter para string no formato desejado
    const dataFormatted = data.format('YYYY-MM-DD'); // Exemplo de formato de data
    const horaFormatted = data.format('HH:mm:ss'); // Exemplo de formato de hora
    const [userLogadoState, setUserLogadoState] = useState<string>('')
    const [publicacao_texto, setPublicacao_texto] = useState<string>('')

    useEffect(() => {
        // Função assíncrona dentro do useEffect
        const fetchData = async () => {
            const userEmpresaLogado = await AsyncStorage.getItem('userEmpresaLogado');
            // Verifica se o item existe
            if (userEmpresaLogado !== null) {
                // Converte de volta para objeto
                const userEmpresa = JSON.parse(userEmpresaLogado);
                console.log('Usuário logado:', userEmpresa);
                setUserLogadoState(userEmpresa);
            } else {
                console.log('Não há dados no AsyncStorage para "userEmpresaLogado"');
            }
        };

        // Chama a função assíncrona
        fetchData();
    }, []);


    async function publicarVaga() {
        try {
            const publicationRef = await addDoc(collection(db, 'publicar_vaga_empresa'), {
                publicacao_text: publicacao_texto,
                data: dataFormatted,
                hora: horaFormatted,
                quem_publicou: userLogadoState
            });
    
            // Agora você pode acessar o ID do documento usando `publicationRef.id`
            const publicationId = publicationRef.id;
    
            // Caso precise salvar o ID no próprio documento:
            await updateDoc(publicationRef, { id_doc: publicationId });

            Alert.alert('Sucesso!', 'Publicação feita com sucesso!')
            setPublicacao_texto('')
        } catch (error) {
            console.error("Erro ao publicar a vaga:", error);
        }
    }
    return (
        <SafeAreaView style={PublicarVagaStyle.container}>
            <View style={PublicarVagaStyle.title_PublicarVaga}>
                <Text style={PublicarVagaStyle.title_NovosTalentos}>NovosTalentos</Text>
                <TouchableOpacity onPress={publicarVaga} style={PublicarVagaStyle.bottomPublicarVaga}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Publicar</Text>
                </TouchableOpacity>
            </View>

            <View style={PublicarVagaStyle.containerInput}>
                <TextInput
                    placeholder='Publique sua vaga abaixo'
                    multiline
                    numberOfLines={20}
                    style={{ fontSize: 18, }}
                    onChangeText={(text)=> {setPublicacao_texto(text)}}
                    value={publicacao_texto} // Adicione isto para controlar o valor do campo
                />
            </View>
        </SafeAreaView>
    )
}