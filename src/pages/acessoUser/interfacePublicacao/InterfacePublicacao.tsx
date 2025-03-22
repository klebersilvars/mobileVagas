import React, { useEffect, useState } from 'react';
import { 
  View, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  ActivityIndicator 
} from 'react-native';
import { db } from '../../../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';

type Vaga = {
    id: string;
    publicacao_text: string;
    data: string;
    hora: string;
    quem_publicou: { email: string; nome?: string };
};

export default function InterfacePublicacao() {
    const [vagasPublicadas, setVagasPublicadas] = useState<Vaga[]>([]);
    const [loading, setLoading] = useState(true);

    // Função para formatar a data usando o Moment.js
    const formatarData = (data: string) => {
        return moment(data).format('DD/MM/YYYY'); // Formato brasileiro
    };

    useEffect(() => {
        const refVagas = collection(db, 'publicar_vaga_empresa');

        const unsubscribe = onSnapshot(refVagas, (snapshot) => {
            setLoading(false);
            
            if (snapshot.empty) {
                console.log("Nenhuma vaga encontrada!");
                setVagasPublicadas([]);  // Se não houver vagas, a lista será esvaziada.
                return;
            }

            const vagas = snapshot.docs.map((doc) => {
                const data = doc.data();
                console.log("Documento recebido:", data);  // Log para depuração

                return {
                    id: doc.id,
                    publicacao_text: data.publicacao_text || 'Sem descrição',
                    data: formatarData(data.data || 'Data não informada'),
                    hora: data.hora || 'Hora não informada',
                    quem_publicou: data.quem_publicou || { email: 'Desconhecido' },
                };
            });

            console.log("Vagas formatadas:", vagas);  // Log para depuração
            setVagasPublicadas(vagas);  // Atualiza o estado com as vagas formatadas
        });

        return () => unsubscribe();
    }, []);

    // Verificar o valor do estado 'vagasPublicadas' para depuração
    useEffect(() => {
        console.log("Estado de vagasPublicadas atualizado:", vagasPublicadas);
    }, [vagasPublicadas]);

    const renderVagaItem = ({ item }: { item: Vaga }) => {
        console.log("Renderizando item:", item); // Log de depuração
        return (
            <TouchableOpacity activeOpacity={0.9}>
                <View style={styles.cardContainer}>
                    <View style={styles.cardHeader}>
                        <View style={styles.publisherContainer}>
                            <View style={styles.avatarCircle}>
                                <Text style={styles.avatarText}>
                                    {(item.quem_publicou.nome || item.quem_publicou.email).charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <Text style={styles.publisherName}>
                                {item.quem_publicou.nome || item.quem_publicou.email}
                            </Text>
                        </View>
                        <View style={styles.dateTimeContainer}>
                            <Text style={styles.dateText}>{item.data}</Text>
                            <Text style={styles.timeText}>{item.hora}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.contentContainer}>
                        <Text style={styles.jobDescription}>{item.publicacao_text}</Text>
                    </View>
                </View>
            </TouchableOpacity>
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
            <Text style={styles.headerTitle}>Vagas Disponíveis</Text>
            
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        padding: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A2138',
        marginBottom: 16,
        marginTop: 8,
    },
    listContainer: {
        paddingBottom: 20,
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    publisherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    publisherName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A2138',
    },
    dateTimeContainer: {
        alignItems: 'flex-end',
    },
    dateText: {
        fontSize: 14,
        color: '#4A5568',
        fontWeight: '500',
    },
    timeText: {
        fontSize: 14,
        color: '#4A5568',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 16,
    },
    contentContainer: {
        padding: 16,
    },
    jobDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: '#2D3748',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A5568',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#718096',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#4A5568',
    },
});