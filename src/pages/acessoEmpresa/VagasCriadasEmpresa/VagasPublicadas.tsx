import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { db } from '../../../firebase/firebase';
import { where, query, collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Vaga = {
    id: string;
    publicacao_text: string;
    data: string;
    hora: string;
    quem_publicou: string;
};

const formatarData = (data: string) => {
    const partes = data.split('-');
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return data;
};

async function deletarPublicacao(item: Vaga) {
    try {
        console.log(`Publicação identificada para deletar: ${item.id}`);
        const vagaRef = doc(db, 'publicar_vaga_empresa', item.id);
        await deleteDoc(vagaRef);
        Alert.alert('Sucesso', 'Publicação deletada com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar a publicação:', error);
        Alert.alert('Erro', 'Não foi possível deletar a publicação.');
    }
}

export default function VagasPublicadas() {
    const [userEmpresaLogadoState, setUserEmpresaLogadoState] = useState<string>('');
    const [vagasPublicadas, setVagasPublicadas] = useState<Vaga[]>([]);
    const [publicacaoEditando, setPublicacaoEditando] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const userEmpresaLogado = await AsyncStorage.getItem('userEmpresaLogado');

            if (userEmpresaLogado !== null) {
                const userEmpresa = JSON.parse(userEmpresaLogado);
                console.log('Usuário logado:', userEmpresa);
                setUserEmpresaLogadoState(userEmpresa.email);
                buscarVagas(userEmpresa.email);
            } else {
                console.log('Não há dados no AsyncStorage para "userEmpresaLogado"');
            }
        };

        fetchData();
    }, []);

    const buscarVagas = (emailEmpresa: string) => {
        try {
            const vagasPublicadasRef = collection(db, 'publicar_vaga_empresa');
            const q = query(vagasPublicadasRef, where('quem_publicou.email', '==', emailEmpresa));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const vagas = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    publicacao_text: doc.data().publicacao_text,
                    quem_publicou: doc.data().quem_publicou.email,
                    data: formatarData(doc.data().data),
                    hora: doc.data().hora,
                }));

                setVagasPublicadas(vagas);
            });

            return () => unsubscribe();
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

    function functionEditarPubli(item: Vaga) {
        console.log(`Editando publicação ID: ${item.id}`);
        setPublicacaoEditando(item.id); // Define o ID da publicação que está sendo editada
    }

    function functionSalvarPubliEditada(item: Vaga) {
        console.log(`Salvando publicação editada ID: ${item.id}`);
        setPublicacaoEditando(null); // Sai do modo de edição
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerTitlePage}>
                <Text style={styles.titleContainerPage}>Novos Talentos</Text>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                data={vagasPublicadas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.containerBox}>
                        <View style={styles.containerText}>
                            <TextInput
                                value={item.publicacao_text}
                                onChangeText={(value) => handleTextInputChange(item.id, value)}
                                editable={publicacaoEditando === item.id}
                            />
                        </View>

                        <View style={styles.containerActionsPubli}>
                            <View>
                                <Text>
                                    <Text style={{ fontWeight: 'bold' }}>Publicado por:</Text> {item.quem_publicou}
                                </Text>
                                <Text>
                                    <Text style={{ fontWeight: 'bold' }}>Data:</Text> {item.data}
                                </Text>
                                <Text>
                                    <Text style={{ fontWeight: 'bold' }}>Hora:</Text> {item.hora}
                                </Text>
                            </View>

                            <View style={{ gap: 10 }}>
                                <TouchableOpacity
                                    onPress={() => deletarPublicacao(item)}
                                    style={styles.deletarPubli}
                                >
                                    <Text style={styles.textBtnDeletar}>Deletar</Text>
                                </TouchableOpacity>

                                {publicacaoEditando === item.id ? (
                                    <TouchableOpacity
                                        onPress={() => functionSalvarPubliEditada(item)}
                                        style={styles.salvarPubli}
                                    >
                                        <Text style={styles.textBtnEditar}>Salvar</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        onPress={() => functionEditarPubli(item)}
                                        style={styles.editarPubli}
                                    >
                                        <Text style={styles.textBtnEditar}>Editar</Text>
                                    </TouchableOpacity>
                                )}
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
        height: 340,
        maxHeight: 350,
        borderWidth: 1,
        marginTop: 10,

    },
    containerText: {
        height: 230,
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
    editarPubli: {
        backgroundColor: '#FFB300',
        width: 100,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
    },
    salvarPubli: {
        backgroundColor: 'green',
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
    },
    textBtnEditar: {
        color: 'white',
        fontWeight: 'bold'
    }
})