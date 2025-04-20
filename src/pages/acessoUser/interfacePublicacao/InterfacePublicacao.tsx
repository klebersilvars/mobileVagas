import React, { useEffect, useState } from 'react';
import { 
  View, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Alert,
  Linking
} from 'react-native';
import { db } from '../../../firebase/firebase';
import { collection, onSnapshot, query, getDocs, where, addDoc, setDoc, doc } from 'firebase/firestore';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Vaga = {
    id: string;
    publicacao_text: string;
    data: string;
    hora: string;
    quem_publicou: string;
    salarioVaga: string;
    titulo_vaga: string;
    requisito_vaga: string;
    area_contato_vaga: string;
    nome_empresa: string;
};

interface UserData {
    nome_completo: string;
    email: string;
    telefone: string;
    logradouro: string;
    bairro: string;
    estado: string;
    uf: string;
    formacoes?: string[];
    experiencias?: string[];
}

export default function InterfacePublicacao() {
    const [vagasPublicadas, setVagasPublicadas] = useState<Vaga[]>([]);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [candidaturas, setCandidaturas] = useState<string[]>([]);

    const formatarData = (data: string) => {
        return moment(data).format('DD/MM/YYYY');
    };

    const formatarSalario = (salario: string) => {
        const valorNumerico = parseFloat(salario);
        if (isNaN(valorNumerico)) return salario;
        return valorNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    useEffect(() => {
        const refVagas = collection(db, 'publicar_vaga_empresa');

        const unsubscribe = onSnapshot(refVagas, (snapshot) => {
            if (snapshot.empty) {
                console.log("Nenhuma vaga encontrada!");
                setVagasPublicadas([]);
                return;
            }

            const vagas = snapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                    id: doc.id,
                    publicacao_text: data.publicacao_text || 'Sem descrição',
                    data: formatarData(data.data || 'Data não informada'),
                    hora: data.hora || 'Hora não informada',
                    quem_publicou: typeof data.quem_publicou === 'string' ? data.quem_publicou : 'Usuário desconhecido',
                    salarioVaga: data.salarioVaga || 'Não informado',
                    titulo_vaga: data.titulo_vaga || 'Vaga sem título',
                    requisito_vaga: data.requisito_vaga || 'Requisitos não informados',
                    area_contato_vaga: data.area_contato_vaga || 'Contato não informado',
                    nome_empresa: data.nome_empresa || 'Nome da empresa não informado!'
                };
            });

            setVagasPublicadas(vagas);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadCandidaturas = async (userEmail: string) => {
        try {
            const q = query(
                collection(db, 'user_candidatura_vaga'),
                where('email_user', '==', userEmail)
            );
            const querySnapshot = await getDocs(q);
            const candidaturasIds = querySnapshot.docs.map(doc => doc.data().id_vaga);
            setCandidaturas(candidaturasIds);
        } catch (error) {
            console.error('Erro ao carregar candidaturas:', error);
        }
    };

    const loadUserData = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userCandidatoLogado');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const userEmail = userData.email;

                if (userEmail) {
                    const usersRef = collection(db, 'user_candidato');
                    const q = query(usersRef, where('email', '==', userEmail));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        const data = userDoc.data();
                        setUserData({
                            nome_completo: data.nome_completo || '',
                            email: data.email || '',
                            telefone: data.telefone || '',
                            logradouro: data.logradouro || '',
                            bairro: data.bairro || '',
                            estado: data.estado || '',
                            uf: data.uf || '',
                            formacoes: data.formacoes || [],
                            experiencias: data.experiencias || []
                        });

                        await loadCandidaturas(userEmail);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    };

    const toggleCardExpansion = (id: string) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const salvarCandidatura = async (vaga: Vaga) => {
        if (!userData?.email) return;

        try {
            const dataAtual = new Date();
            const dataFormatada = moment(dataAtual).format('DD/MM/YYYY');
            const horaFormatada = moment(dataAtual).format('HH:mm');

            const candidaturaRef = collection(db, 'user_candidatura_vaga');
            await addDoc(candidaturaRef, {
                candidatura: true,
                email_user: userData.email,
                id_user: userData.email,
                id_vaga: vaga.id,
                data_candidatura: dataFormatada,
                hora_candidatura: horaFormatada
            });

            setCandidaturas(prev => [...prev, vaga.id]);
            
        } catch (error) {
            console.error('Erro ao salvar candidatura:', error);
            throw error;
        }
    };

    const handleCandidatura = async (vaga: Vaga) => {
        if (!userData) {
            Alert.alert('Erro', 'Você precisa estar logado para se candidatar.');
            return;
        }

        if (candidaturas.includes(vaga.id)) {
            Alert.alert('Aviso', 'Você já se candidatou para esta vaga!');
            return;
        }

        try {
            const formattedUserData = `
Nome: ${userData.nome_completo || 'Não informado'}
Email: ${userData.email || 'Não informado'}
Telefone: ${userData.telefone || 'Não informado'}
Endereço: ${userData.logradouro || ''}, ${userData.bairro || ''}, ${userData.estado || ''}-${userData.uf || ''}

Formação Acadêmica:
${userData.formacoes?.map(formacao => `- ${formacao}`).join('\n') || 'Não informado'}

Experiência Profissional:
${userData.experiencias?.map(exp => `- ${exp}`).join('\n') || 'Não informado'}`;

            const subject = encodeURIComponent(`Candidatura para vaga: ${vaga.titulo_vaga}`);
            const body = encodeURIComponent(`
Olá ${vaga.nome_empresa},

Uma nova candidatura foi recebida para a vaga "${vaga.titulo_vaga}".

Dados do Candidato:
${formattedUserData}

Atenciosamente,
${userData.nome_completo || 'Candidato'}
            `);

            const mailtoLink = `mailto:${vaga.quem_publicou}?subject=${subject}&body=${body}`;
            const canOpen = await Linking.canOpenURL(mailtoLink);
            
            if (canOpen) {
                await Linking.openURL(mailtoLink);
                await salvarCandidatura(vaga);
                Alert.alert('Sucesso', 'Sua candidatura foi enviada com sucesso!');
            } else {
                Alert.alert('Erro', 'Não foi possível abrir o cliente de e-mail.');
            }
        } catch (error) {
            console.error('Erro ao processar candidatura:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao processar sua candidatura. Tente novamente.');
        }
    };

    const renderVagaItem = ({ item }: { item: Vaga }) => {
        const isExpanded = expandedCard === item.id;
        const jaCandidatou = candidaturas.includes(item.id);

        // Função para verificar e exibir "A COMBINAR" se o campo estiver vazio
        const verificarCampo = (campo: string) => {
            return campo ? campo : "A COMBINAR";
        };

        return (
            <View style={styles.cardContainer}>
                <StatusBar backgroundColor='#F5F7FF' barStyle='dark-content'/>

                {/* Card Header with Company Info */}
                <View style={styles.cardHeader}>
                    <View style={styles.publisherContainer}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>
                                {item.quem_publicou && item.quem_publicou.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.publisherInfo}>
                            <Text style={styles.publisherName} numberOfLines={1}>
                                {verificarCampo(item.nome_empresa)}
                            </Text>
                            <View style={styles.dateTimeContainer}>
                                <Text style={styles.dateText}>{verificarCampo(item.data)} às {verificarCampo(item.hora)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Job Title and Salary */}
                <View style={styles.jobTitleContainer}>
                    <Text style={styles.jobTitle}>{verificarCampo(item.titulo_vaga)}</Text>
                    <View style={styles.salaryBadge}>
                        <Text style={styles.salaryText}>{formatarSalario(verificarCampo(item.salarioVaga))}</Text>
                    </View>
                </View>

                {/* Job Description */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Descrição</Text>
                    <Text style={styles.sectionContent} numberOfLines={isExpanded ? undefined : 3}>
                        {verificarCampo(item.publicacao_text)}
                    </Text>
                </View>

                {/* Only show these sections if card is expanded */}
                {isExpanded && (
                    <>
                        {/* Job Requirements */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Requisitos</Text>
                            <Text style={styles.sectionContent}>
                                {verificarCampo(item.requisito_vaga)}
                            </Text>
                        </View>

                        {/* Contact Information */}
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Contato</Text>
                            <Text style={styles.sectionContent} selectable={true}>
                                {verificarCampo(item.area_contato_vaga)}
                            </Text>
                        </View>
                    </>
                )}

                {/* Expand/Collapse Button */}
                <TouchableOpacity 
                    style={styles.expandButton} 
                    onPress={() => toggleCardExpansion(item.id)}
                >
                    <Text style={styles.expandText}>
                        {isExpanded ? 'Mostrar menos' : 'Ver detalhes completos'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[
                        styles.candidatarButton,
                        jaCandidatou && styles.candidatarButtonDisabled
                    ]}
                    onPress={() => handleCandidatura(item)}
                    disabled={jaCandidatou}
                >
                    <Text style={styles.candidatarButtonText}>
                        {jaCandidatou ? 'CANDIDATURA ENVIADA' : 'Candidatar-se'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Vagas Disponíveis</Text>
                <Text style={styles.headerSubtitle}>
                    Encontre oportunidades para iniciar sua carreira
                </Text>
            </View>
            
            {vagasPublicadas.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>Nenhuma vaga disponível</Text>
                    <Text style={styles.emptySubtitle}>As vagas publicadas aparecerão aqui</Text>
                </View>
            ) : (
                <FlatList
                    data={vagasPublicadas}
                    keyExtractor={(item) => item.id}
                    renderItem={renderVagaItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FF',
    },
    header: {
        backgroundColor: '#4A80F0',
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
        color: 'white',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 4,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FF',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#4A80F0',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    publisherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    publisherInfo: {
        flex: 1,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4A80F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    publisherName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 12,
        color: '#666',
    },
    timeText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 12,
    },
    jobTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    salaryBadge: {
        backgroundColor: '#E8F0FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    salaryText: {
        color: '#4A80F0',
        fontWeight: '600',
        fontSize: 14,
    },
    sectionContainer: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 6,
    },
    sectionContent: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
    expandIndicator: {
        alignItems: 'center',
        marginTop: 8,
    },
    expandText: {
        fontSize: 14,
        color: '#4A80F0',
        fontWeight: '500',
    },
    contentContainer: {
        marginTop: 12,
    },
    jobDescription: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
    expandButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    candidatarButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8
    },
    candidatarButtonDisabled: {
        backgroundColor: '#28a745',
    },
    candidatarButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});