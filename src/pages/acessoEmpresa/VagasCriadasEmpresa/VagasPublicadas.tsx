import React, { useEffect, useState } from 'react';
import { 
  View, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Dimensions,
  StatusBar
} from 'react-native';
import { db } from '../../../firebase/firebase';
import { where, query, collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlertGreen from '../../../components/CustomAlertGreen';

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

export default function VagasPublicadas() {
    const [userEmpresaLogadoState, setUserEmpresaLogadoState] = useState<string>('');
    const [vagasPublicadas, setVagasPublicadas] = useState<Vaga[]>([]);
    const [publicacaoEditando, setPublicacaoEditando] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    function showAlert(message: string) {
        setAlertMessage(message);
        setAlertVisible(true);
    }

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
            const q = query(vagasPublicadasRef, where('quem_publicou', '==', emailEmpresa));

            return onSnapshot(q, (querySnapshot) => {
                const vagas = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    publicacao_text: doc.data().publicacao_text,
                    quem_publicou: doc.data().quem_publicou,
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

    const handleTextInputChange = (id: string, field: string, value: string) => {
        setVagasPublicadas(prevVagas =>
            prevVagas.map(vaga => (vaga.id === id ? { ...vaga, [field]: value } : vaga))
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
                publicacao_text: item.publicacao_text,
                titulo_vaga: item.titulo_vaga,
                salarioVaga: item.salarioVaga,
                area_contato_vaga: item.area_contato_vaga,
                requisito_vaga: item.requisito_vaga
            });

            showAlert('Publicação atualizada com sucesso!');
            setPublicacaoEditando(null);
        } catch (error) {
            console.error('Erro ao atualizar publicação:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a publicação.');
        }
    };

    const renderFieldLabel = (label: string) => (
        <Text style={styles.fieldLabel}>{label}</Text>
    );

    async function deletarPublicacao(item: Vaga) {
        try {
            console.log(`Publicação identificada para deletar: ${item.id}`);
            await deleteDoc(doc(db, 'publicar_vaga_empresa', item.id));
            showAlert('Publicação deletada com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar a publicação:', error);
            Alert.alert('Erro', 'Não foi possível deletar a publicação.');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            
            <CustomAlertGreen 
                visible={alertVisible} 
                message={alertMessage} 
                onClose={() => setAlertVisible(false)} 
            />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Novos Talentos</Text>
                <Text style={styles.headerSubtitle}>Gerencie suas vagas publicadas</Text>
            </View>

            {vagasPublicadas.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhuma vaga publicada ainda</Text>
                </View>
            ) : (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={vagasPublicadas}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={styles.jobCard}>
                            <View style={styles.jobHeader}>
                                <View style={styles.titleContainer}>
                                    {publicacaoEditando === item.id ? (
                                        <TextInput
                                            value={item.titulo_vaga}
                                            onChangeText={(value) => handleTextInputChange(item.id, 'titulo_vaga', value)}
                                            style={styles.titleInput}
                                            placeholder="Título da vaga"
                                            multiline
                                            numberOfLines={5}
                                        />
                                    ) : (
                                        <Text style={styles.jobTitle}>{item.titulo_vaga}</Text>
                                    )}
                                </View>
                                
                                <View style={styles.salaryBadge}>
                                    {publicacaoEditando === item.id ? (
                                        <TextInput
                                            value={item.salarioVaga}
                                            onChangeText={(value) => handleTextInputChange(item.id, 'salarioVaga', value)}
                                            style={styles.salaryInput}
                                            placeholder="Salário"
                                        />
                                    ) : (
                                        <Text style={styles.salaryText}>{item.salarioVaga}</Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.jobContent}>
                                {renderFieldLabel('Descrição')}
                                <TextInput
                                    value={item.publicacao_text}
                                    onChangeText={(value) => handleTextInputChange(item.id, 'publicacao_text', value)}
                                    editable={publicacaoEditando === item.id}
                                    style={[
                                        styles.textInput,
                                        publicacaoEditando === item.id && styles.activeInput
                                    ]}
                                    multiline
                                    placeholder="Descrição da vaga"
                                />

                                {renderFieldLabel('Requisitos')}
                                <TextInput
                                    value={item.requisito_vaga}
                                    onChangeText={(value) => handleTextInputChange(item.id, 'requisito_vaga', value)}
                                    editable={publicacaoEditando === item.id}
                                    style={[
                                        styles.textInput,
                                        publicacaoEditando === item.id && styles.activeInput
                                    ]}
                                    multiline
                                    placeholder="Requisitos para a vaga"
                                />

                                {renderFieldLabel('Contato')}
                                <TextInput
                                    value={item.area_contato_vaga}
                                    onChangeText={(value) => handleTextInputChange(item.id, 'area_contato_vaga', value)}
                                    editable={publicacaoEditando === item.id}
                                    style={[
                                        styles.textInput,
                                        publicacaoEditando === item.id && styles.activeInput
                                    ]}
                                    multiline
                                    placeholder="Área de contato"
                                />
                            </View>

                            <View style={styles.jobFooter}>
                                <View style={styles.metadataContainer}>
                                    <Text style={styles.metadataText}>
                                        <Text style={styles.metadataLabel}>Publicado: </Text>
                                        {item.data} às {item.hora}
                                    </Text>
                                    <Text style={styles.metadataText} numberOfLines={1}>
                                        <Text style={styles.metadataLabel}>Por: </Text>
                                        {item.quem_publicou}
                                    </Text>
                                </View>

                                <View style={styles.actionButtons}>
                                    {publicacaoEditando === item.id ? (
                                        <TouchableOpacity
                                            onPress={() => functionSalvarPubliEditada(item)}
                                            style={styles.saveButton}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.buttonText}>Salvar</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => functionEditarPubli(item)}
                                            style={styles.editButton}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.buttonText}>Editar</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        onPress={() => deletarPublicacao(item)}
                                        style={styles.deleteButton}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.buttonText}>Deletar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FF',
    },
    header: {
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
        marginTop: 4,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    jobCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    titleContainer: {
        flex: 1,
        marginRight: 10,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    titleInput: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        padding: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#4A6FFF',
    },
    salaryBadge: {
        backgroundColor: '#E8EDFF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    salaryText: {
        color: '#4A6FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    salaryInput: {
        color: '#4A6FFF',
        fontWeight: '600',
        fontSize: 14,
        minWidth: 80,
        textAlign: 'center',
    },
    jobContent: {
        padding: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
        marginTop: 12,
    },
    textInput: {
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        color: '#333',
        minHeight: 60,
        textAlignVertical: 'top',
    },
    activeInput: {
        backgroundColor: '#F0F4FF',
        borderWidth: 1,
        borderColor: '#4A6FFF',
    },
    jobFooter: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        padding: 16,
    },
    metadataContainer: {
        marginBottom: 12,
    },
    metadataText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    metadataLabel: {
        fontWeight: '600',
        color: '#444',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    editButton: {
        backgroundColor: '#4A6FFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#22C55E',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});