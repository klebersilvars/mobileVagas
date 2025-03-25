import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { db } from '../../../firebase/firebase';
import { where, query, collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Vaga = {
    id: string;
    publicacao_text: string;
    data: string;
    hora: string;
    quem_publicou: string;
    area_contato_vaga: string;
    requisito_vaga: string;
    salarioVaga: string;
    titulo_vaga: string;
};

const formatarData = (data: string) => {
    const partes = data.split('-');
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
};

async function deletarPublicacao(item: Vaga) {
    try {
        console.log(`Publicação identificada para deletar: ${item.id}`);
        await deleteDoc(doc(db, 'publicar_vaga_empresa', item.id));
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
            if (userEmpresaLogado) {
                const userEmpresa = JSON.parse(userEmpresaLogado);
                setUserEmpresaLogadoState(userEmpresa.email);
                buscarVagas(userEmpresa.email);
            } else {
                console.log('Nenhum usuário logado encontrado.');
            }
        };
        fetchData();
    }, []);

    const buscarVagas = (emailEmpresa: string) => {
        try {
            const vagasPublicadasRef = collection(db, 'publicar_vaga_empresa');
            const q = query(vagasPublicadasRef, where('quem_publicou.email', '==', emailEmpresa));

            return onSnapshot(q, (querySnapshot) => {
                const vagas = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    publicacao_text: doc.data().publicacao_text,
                    quem_publicou: doc.data().quem_publicou.email,
                    data: formatarData(doc.data().data),
                    hora: doc.data().hora,
                    titulo_vaga: doc.data().titulo_vaga,
                    salarioVaga: doc.data().salarioVaga,
                    requisito_vaga: doc.data().requisito_vaga,
                    area_contato_vaga: doc.data().area_contato_vaga

                }));
                setVagasPublicadas(vagas);
            });
        } catch (error) {
            console.error('Erro ao buscar vagas:', error);
        }
    };

    const handleTextInputChange = (id: string, value: string) => {
        setVagasPublicadas(prevVagas =>
            prevVagas.map(vaga => (vaga.id === id ? { ...vaga, publicacao_text: value, titulo_vaga: value, salarioVaga: value, area_contato_vaga: value, requisito_vaga: value, } : vaga))
        );
    };

    const functionEditarPubli = (item: Vaga) => {
        setPublicacaoEditando(item.id);
    };

    const functionSalvarPubliEditada = async (item: Vaga) => {
        try {
            const vagaRef = doc(db, 'publicar_vaga_empresa', item.id);

            if (!item.publicacao_text.trim()) {
                Alert.alert('Erro', 'O texto da publicação não pode estar vazio.');
                return;
            }

            await updateDoc(vagaRef, {
                publicacao_text: item.publicacao_text
            });

            Alert.alert('Sucesso', 'Publicação atualizada com sucesso!');
            setPublicacaoEditando(null);
        } catch (error) {
            console.error('Erro ao atualizar publicação:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a publicação.');
        }
    };

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
                                value={item.titulo_vaga}
                                onChangeText={(value) => handleTextInputChange(item.id, value)}
                                editable={publicacaoEditando === item.id}
                                style={styles.input}
                                numberOfLines={20}
                                multiline
                            />
                            <TextInput
                                value={item.publicacao_text}
                                onChangeText={(value) => handleTextInputChange(item.id, value)}
                                editable={publicacaoEditando === item.id}
                                style={styles.input}
                                numberOfLines={20}
                                multiline
                            />
                            <TextInput
                                value={item.salarioVaga}
                                onChangeText={(value) => handleTextInputChange(item.id, value)}
                                editable={publicacaoEditando === item.id}
                                style={styles.input}
                                numberOfLines={20}
                                multiline
                            />
                            <TextInput
                                value={item.area_contato_vaga}
                                onChangeText={(value) => handleTextInputChange(item.id, value)}
                                editable={publicacaoEditando === item.id}
                                style={styles.input}
                                numberOfLines={20}
                                multiline
                            />
                            <TextInput
                                value={item.requisito_vaga}
                                onChangeText={(value) => handleTextInputChange(item.id, value)}
                                editable={publicacaoEditando === item.id}
                                style={styles.input}
                                numberOfLines={20}
                                multiline
                            />
                        </View>

                        <View style={styles.containerActionsPubli}>
                            <View>
                                <Text><Text style={{ fontWeight: 'bold' }}>Publicado por:</Text> {item.quem_publicou}</Text>
                                <Text><Text style={{ fontWeight: 'bold' }}>Data:</Text> {item.data}</Text>
                                <Text><Text style={{ fontWeight: 'bold' }}>Hora:</Text> {item.hora}</Text>
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
    },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, fontSize: 16 },
})