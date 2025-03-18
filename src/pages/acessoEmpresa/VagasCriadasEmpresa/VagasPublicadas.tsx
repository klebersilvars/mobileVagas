import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { db } from '../../../firebase/firebase';
import { where, query, collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Vaga = {
    id: string;
    publicacao_text: string; // Adicione outros campos conforme necessário
    data: string, 
    hora: string,
    quem_publicou:string
};

export default function VagasPublicadas() {
    const [userEmpresaLogadoState, setUserEmpresaLogadoState] = useState<string>('');
    const [vagasPublicadas, setVagasPublicadas] = useState<Vaga[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const userEmpresaLogado = await AsyncStorage.getItem('userEmpresaLogado');

            if (userEmpresaLogado !== null) {
                const userEmpresa = JSON.parse(userEmpresaLogado);
                console.log('Usuário logado:', userEmpresa);
                setUserEmpresaLogadoState(userEmpresa.email);

                // Chamando a função para buscar as vagas publicadas
                buscarVagas(userEmpresa.email);
            } else {
                console.log('Não há dados no AsyncStorage para "userEmpresaLogado"');
            }
        };

        fetchData();
    }, []);

    const buscarVagas = async (emailEmpresa: string) => {
        try {
            const vagasPublicadasRef = collection(db, 'publicar_vaga_empresa');
            const q = query(vagasPublicadasRef, where('quem_publicou.email', '==', emailEmpresa));
            const querySnapshot = await getDocs(q);

            const vagas = querySnapshot.docs.map(doc => ({
                id: doc.id,
                publicacao_text: doc.data().publicacao_text,
                quem_publicou: doc.data().quem_publicou.email,
                data: doc.data().data,
                hora: doc.data().hora,
            }));

            setVagasPublicadas(vagas);
        } catch (error) {
            console.error('Erro ao buscar vagas:', error);
        }
    };

    const handleTextInputChange = (id: string, value: string) => {
        setVagasPublicadas((prevVagas) =>
            prevVagas.map((vaga) =>
                vaga.id === id ? { ...vaga, publicacao_text: value } : vaga
            )
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerTitlePage} >
                <Text style={styles.titleContainerPage}>Novos Talentos</Text>
            </View>

            <FlatList
                data={vagasPublicadas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.containerBox}>
                        <View style={styles.containerText}>
                            <TextInput
                                value={item.publicacao_text} // Inicializa com o valor vindo do banco de dados
                                onChangeText={(value) => handleTextInputChange(item.id, value)} // Atualiza o estado para esse item
                            />
                        </View>

                        <View style={styles.containerActionsPubli}>
                            <View>
                                <Text>
                                    <Text style={{fontWeight: 'bold'}}>Publicado por:</Text>  {item.quem_publicou}
                                </Text>
                                <Text>
                                    
                                    <Text style={{fontWeight: 'bold'}}>Data:</Text> {item.data}


                                </Text>
                                <Text>

                                    <Text style={{fontWeight: 'bold'}}>Hora:</Text> {item.hora}
                                    
                                </Text>
                            </View>

                            <View>
                                <TouchableOpacity style={styles.deletarPubli}>
                                    <Text style={styles.textBtnDeletar}>Deletar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: 10,

    },
    containerTitlePage: {
        width: '100%',
        height: 80,
        padding: 24,
        display: 'flex',
        alignItems: 'center'
    },
    titleContainerPage: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    containerBox: {
        width: '100%',
        padding: 10,
        height: 330,
        maxHeight: 350,
        borderWidth: 1,
    },
    containerText: {
        height: 250,
        maxHeight: 251,
        width: '100%'
    },
    containerActionsPubli: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    deletarPubli: {
        backgroundColor: 'red',
        width: 100,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
    },
    textBtnDeletar: {
        color: 'white',
        fontWeight: 'bold'
    }
})