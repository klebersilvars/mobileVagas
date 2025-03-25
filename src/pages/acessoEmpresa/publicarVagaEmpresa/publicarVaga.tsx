import React, { useEffect, useState } from 'react'
import { 
  SafeAreaView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native'
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
    const [tituloVaga, setTituloVaga] = useState<string>('')
    const [salarioVaga, setSalarioVaga] = useState<string>('')
    const [requisitosVaga, setRequisitosVaga] = useState<string>('')
    const [areaLinkVaga, setAreaLinkVaga] = useState<string>('')
    const [areaContatoVaga, setAreaContatoVaga] = useState<string>('')

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
                quem_publicou: userLogadoState,
                requisito_vaga: requisitosVaga,
                salarioVaga: salarioVaga,
                titulo_vaga: tituloVaga,
                area_contato_vaga: areaContatoVaga
            });

            // Agora você pode acessar o ID do documento usando `publicationRef.id`
            const publicationId = publicationRef.id;

            // Caso precise salvar o ID no próprio documento:
            await updateDoc(publicationRef, { id_doc: publicationId });

            Alert.alert('Sucesso!', 'Publicação feita com sucesso!')
            setPublicacao_texto('')
            setTituloVaga('')
            setSalarioVaga('')
            setRequisitosVaga('')
            setAreaContatoVaga('')
            setAreaLinkVaga('')
        } catch (error) {
            console.error("Erro ao publicar a vaga:", error);
        }
    }
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={PublicarVagaStyle.container}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                
                {/* Header */}
                <View style={PublicarVagaStyle.header}>
                    <Text style={PublicarVagaStyle.headerTitle}>NovosTalentos</Text>
                    <TouchableOpacity 
                        onPress={publicarVaga} 
                        style={PublicarVagaStyle.publishButton}
                    >
                        <MaterialCommunityIcons name="send" size={18} color="white" />
                        <Text style={PublicarVagaStyle.publishButtonText}>Publicar</Text>
                    </TouchableOpacity>
                </View>
                
                <ScrollView style={PublicarVagaStyle.scrollView}>
                    <View style={PublicarVagaStyle.formCard}>
                        {/* Job Title Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Título da Vaga *</Text>
                            <TextInput
                                style={PublicarVagaStyle.input}
                                placeholder="Ex: Desenvolvedor Front-end React"
                                placeholderTextColor="#A0AEC0"
                                value={tituloVaga}
                                onChangeText={setTituloVaga}

                            />
                        </View>
                        
                        {/* Job Description Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Descrição da Vaga *</Text>
                            <TextInput
                                style={PublicarVagaStyle.textArea}
                                placeholder="Descreva detalhadamente a vaga, responsabilidades, benefícios e outras informações relevantes..."
                                placeholderTextColor="#A0AEC0"
                                multiline
                                numberOfLines={8}
                                textAlignVertical="top"
                                value={publicacao_texto}
                                onChangeText={setPublicacao_texto}
                            />
                        </View>
                        
                        {/* Salary Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Salário da Vaga *</Text>
                            <TextInput
                                style={PublicarVagaStyle.input}
                                placeholder="Ex: R$ 3.500,00 ou A combinar"
                                placeholderTextColor="#A0AEC0"
                                value={salarioVaga}
                                onChangeText={setSalarioVaga}
                            />
                        </View>

                        {/* Link Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Área dos links da vaga (opcional)</Text>
                            <TextInput
                                style={PublicarVagaStyle.input}
                                placeholder="https://google.com.br"
                                placeholderTextColor="#A0AEC0"
                                value={areaLinkVaga}
                                onChangeText={setAreaLinkVaga}
                            />
                        </View>

                        {/* Link Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Área de contato</Text>
                            <TextInput
                                style={PublicarVagaStyle.textArea}
                                placeholder="Caso não tenha links, coloque obrigatoriamente uma forma do usuário entrar em contato."
                                placeholderTextColor="#A0AEC0"
                                value={areaContatoVaga}
                                textAlignVertical="top"
                                multiline
                                onChangeText={setAreaContatoVaga}
                            />
                        </View>
                        
                        {/* Requirements Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Requisitos da Vaga</Text>
                            <TextInput
                                style={PublicarVagaStyle.textArea}
                                placeholder="Ex: JavaScript, React, 2 anos de experiência, inglês intermediário..."
                                placeholderTextColor="#A0AEC0"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={requisitosVaga}
                                onChangeText={setRequisitosVaga}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}