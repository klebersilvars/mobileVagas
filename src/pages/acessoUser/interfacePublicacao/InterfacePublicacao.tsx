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
  StatusBar
} from 'react-native';
import { db } from '../../../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';

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

export default function InterfacePublicacao() {
    const [vagasPublicadas, setVagasPublicadas] = useState<Vaga[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

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
            setLoading(false);

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

    const toggleCardExpansion = (id: string) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    const renderVagaItem = ({ item }: { item: Vaga }) => {
        const isExpanded = expandedCard === item.id;

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
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A80F0" />
                <Text style={styles.loadingText}>Carregando vagas...</Text>
            </View>
        );
    }

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
    
});