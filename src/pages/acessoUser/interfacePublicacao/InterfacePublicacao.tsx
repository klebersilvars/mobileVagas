import React, { useEffect, useState } from 'react';
import {
    View,
    SafeAreaView,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Alert,
    Linking,
    RefreshControl,
    Animated,
    ScrollView,
    Dimensions,
    Platform
} from 'react-native';
import { db } from '../../../firebase/firebase';
import { collection, onSnapshot, query, getDocs, where, addDoc, setDoc, doc } from 'firebase/firestore';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getResponsiveFontSize,
    getResponsivePadding,
    getResponsiveWidth,
    getResponsiveHeight,
    getResponsiveBorderRadius,
    getResponsiveLineHeight,
    getResponsiveMargin
} from '../../../utils/responsive';
import { baseStyles } from '../../../styles/baseStyles';
import * as MailComposer from 'expo-mail-composer';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

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
    const [refreshing, setRefreshing] = useState(false);
    const [isBlurred, setIsBlurred] = useState(false);
    const blurAnimation = new Animated.Value(0);
    
    // Animation values for header
    const scrollY = new Animated.Value(0);
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [getResponsiveHeight(150), getResponsiveHeight(80)],
        extrapolate: 'clamp'
    });

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

    const animateBlur = (toValue: number) => {
        Animated.timing(blurAnimation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setIsBlurred(true);
        animateBlur(1);

        try {
            await loadUserData();
            const refVagas = collection(db, 'publicar_vaga_empresa');
            const snapshot = await getDocs(refVagas);
            
            if (snapshot.empty) {
                setVagasPublicadas([]);
            } else {
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
            }
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            Alert.alert('Erro', 'Não foi possível atualizar as vagas. Tente novamente.');
        } finally {
            setTimeout(() => {
                setRefreshing(false);
                setIsBlurred(false);
                animateBlur(0);
            }, 1000);
        }
    }, []);

    // Get company initials for avatar
    const getInitials = (name: string) => {
        if (!name || name === 'Nome da empresa não informado!') return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const renderVagaItem = ({ item, index }: { item: Vaga, index: number }) => {
        const isExpanded = expandedCard === item.id;
        const jaCandidatou = candidaturas.includes(item.id);
        const companyInitials = getInitials(item.nome_empresa);

        // Função para verificar e exibir "A COMBINAR" se o campo estiver vazio
        const verificarCampo = (campo: string) => {
            return campo ? campo : "A COMBINAR";
        };

        // Animation for card appearance
        const translateY = new Animated.Value(50);
        const opacity = new Animated.Value(0);
        
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                delay: index * 50,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                delay: index * 50,
                useNativeDriver: true,
            }),
        ]).start();

        return (
            <Animated.View 
                style={[
                    styles.vagaContainer, 
                    { 
                        transform: [{ translateY }],
                        opacity,
                        width: width * 0.9 
                    }
                ]} 
                key={item.id}
            >
                <TouchableOpacity 
                    activeOpacity={0.9}
                    onPress={() => toggleCardExpansion(item.id)}
                >
                    <View style={styles.vagaHeader}>
                        <View style={styles.companyAvatarContainer}>
                            <View style={styles.avatarCircle}>
                                <Text style={styles.avatarText}>{companyInitials}</Text>
                            </View>
                            <View style={styles.companyInfo}>
                                <Text style={styles.companyName} numberOfLines={1}>
                                    {verificarCampo(item.nome_empresa)}
                                </Text>
                                <View style={styles.dateTimeContainer}>
                                    <Ionicons name="time-outline" size={12} color="#666" />
                                    <Text style={styles.dateText}>
                                        {verificarCampo(item.data)} às {verificarCampo(item.hora)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.jobTitleContainer}>
                        <Text style={styles.vagaTitle} numberOfLines={2}>
                            {verificarCampo(item.titulo_vaga)}
                        </Text>
                        <View style={styles.salaryBadge}>
                            <Text style={styles.salaryText}>
                                {formatarSalario(verificarCampo(item.salarioVaga))}
                            </Text>
                        </View>
                    </View>
                    
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.vagaLocation}>
                            {verificarCampo(item.area_contato_vaga)}
                        </Text>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    {isExpanded ? (
                        <View style={styles.expandedContent}>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>
                                    <MaterialIcons name="description" size={16} color="#4A80F0" /> Descrição
                                </Text>
                                <Text style={styles.vagaDescription}>
                                    {verificarCampo(item.publicacao_text)}
                                </Text>
                            </View>
                            
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>
                                    <MaterialIcons name="assignment" size={16} color="#4A80F0" /> Requisitos
                                </Text>
                                <Text style={styles.vagaRequirements}>
                                    {verificarCampo(item.requisito_vaga)}
                                </Text>
                            </View>

                            <TouchableOpacity 
                                style={styles.expandButton}
                                onPress={() => toggleCardExpansion(item.id)}
                            >
                                <Text style={styles.expandText}>
                                    Ver menos <Ionicons name="chevron-up" size={14} color="#4A80F0" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.vagaDescription} numberOfLines={2}>
                                {verificarCampo(item.publicacao_text)}
                            </Text>
                            <TouchableOpacity 
                                style={styles.expandButton}
                                onPress={() => toggleCardExpansion(item.id)}
                            >
                                <Text style={styles.expandText}>
                                    Ver mais <Ionicons name="chevron-down" size={14} color="#4A80F0" />
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </TouchableOpacity>
                
                <View style={styles.vagaActions}>
                    <TouchableOpacity 
                        style={[
                            styles.candidaturaButton,
                            jaCandidatou && styles.candidaturaSuccess
                        ]}
                        onPress={() => handleCandidatura(item)}
                        disabled={jaCandidatou}
                    >
                        <Text style={styles.candidaturaButtonText}>
                            {jaCandidatou ? (
                                <>
                                    <Ionicons name="checkmark-circle" size={16} color="white" /> CANDIDATURA ENVIADA
                                </>
                            ) : (
                                <>
                                    <FontAwesome name="paper-plane" size={14} color="white" /> Candidatar-se
                                </>
                            )}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#4A80F0" />
            
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Vagas Disponíveis</Text>
                    <Text style={styles.headerSubtitle}>
                        Encontre oportunidades para iniciar sua carreira
                    </Text>
                </View>
            </Animated.View>

            <View style={styles.container}>
                {vagasPublicadas.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="briefcase-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyTitle}>Nenhuma vaga disponível</Text>
                        <Text style={styles.emptySubtitle}>As vagas publicadas aparecerão aqui</Text>
                        <TouchableOpacity 
                            style={styles.refreshButton}
                            onPress={onRefresh}
                        >
                            <Text style={styles.refreshButtonText}>Atualizar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Animated.FlatList
                        data={vagasPublicadas}
                        keyExtractor={(item) => item.id}
                        renderItem={renderVagaItem}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#4A80F0']}
                                tintColor="#4A80F0"
                                title="Atualizando..."
                                titleColor="#4A80F0"
                                progressViewOffset={20}
                            />
                        }
                    />
                )}
                {isBlurred && (
                    <Animated.View style={[
                        styles.loadingOverlay,
                        {
                            opacity: blurAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1]
                            })
                        }
                    ]}>
                        <ActivityIndicator size="large" color="#4A80F0" />
                        <Text style={styles.loadingText}>Atualizando vagas...</Text>
                    </Animated.View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FF',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: getResponsivePadding(16),
        paddingTop: getResponsivePadding(8),
    },
    header: {
        backgroundColor: '#4A80F0',
        paddingHorizontal: getResponsivePadding(20),
        paddingTop: getResponsivePadding(isIOS ? 10 : 40),
        paddingBottom: getResponsivePadding(15),
        justifyContent: 'flex-end',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    headerContent: {
        marginBottom: getResponsiveMargin(10),
    },
    headerTitle: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: getResponsiveMargin(5),
    },
    headerSubtitle: {
        fontSize: getResponsiveFontSize(14),
        color: 'rgba(255, 255, 255, 0.9)',
    },
    vagaContainer: {
        backgroundColor: 'white',
        borderRadius: getResponsiveBorderRadius(16),
        padding: getResponsivePadding(16),
        marginBottom: getResponsiveMargin(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        alignSelf: 'center',
    },
    vagaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: getResponsiveMargin(12),
    },
    companyAvatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    companyInfo: {
        marginLeft: getResponsiveMargin(12),
        flex: 1,
    },
    companyName: {
        fontSize: getResponsiveFontSize(16),
        fontWeight: '600',
        color: '#333',
        marginBottom: getResponsiveMargin(4),
    },
    dateTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: getResponsiveFontSize(12),
        color: '#666',
        marginLeft: getResponsiveMargin(4),
    },
    jobTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: getResponsiveMargin(12),
    },
    vagaTitle: {
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: getResponsiveMargin(8),
    },
    salaryBadge: {
        backgroundColor: '#E8F0FF',
        paddingHorizontal: getResponsivePadding(12),
        paddingVertical: getResponsivePadding(6),
        borderRadius: getResponsiveBorderRadius(20),
    },
    salaryText: {
        color: '#4A80F0',
        fontWeight: '600',
        fontSize: getResponsiveFontSize(14),
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: getResponsiveMargin(12),
    },
    vagaLocation: {
        fontSize: getResponsiveFontSize(14),
        color: '#666',
        marginLeft: getResponsiveMargin(4),
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: getResponsiveMargin(12),
    },
    expandedContent: {
        marginTop: getResponsiveMargin(8),
    },
    sectionContainer: {
        marginBottom: getResponsiveMargin(16),
    },
    sectionTitle: {
        fontSize: getResponsiveFontSize(15),
        fontWeight: '600',
        color: '#333',
        marginBottom: getResponsiveMargin(8),
    },
    vagaDescription: {
        fontSize: getResponsiveFontSize(14),
        color: '#666',
        lineHeight: getResponsiveLineHeight(20),
        marginBottom: getResponsiveMargin(8),
    },
    vagaRequirements: {
        fontSize: getResponsiveFontSize(14),
        color: '#666',
        lineHeight: getResponsiveLineHeight(20),
    },
    vagaSalary: {
        fontSize: getResponsiveFontSize(16),
        color: '#4CAF50',
        fontWeight: 'bold',
        marginBottom: getResponsiveMargin(8),
    },
    expandButton: {
        alignItems: 'center',
        marginTop: getResponsiveMargin(8),
    },
    expandText: {
        fontSize: getResponsiveFontSize(14),
        color: '#4A80F0',
        fontWeight: '500',
    },
    vagaActions: {
        marginTop: getResponsiveMargin(16),
    },
    candidaturaButton: {
        backgroundColor: '#4A80F0',
        paddingVertical: getResponsivePadding(12),
        borderRadius: getResponsiveBorderRadius(12),
        alignItems: 'center',
        justifyContent: 'center',
    },
    candidaturaSuccess: {
        backgroundColor: '#4CAF50',
    },
    candidaturaButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: getResponsiveFontSize(14),
    },
    avatarCircle: {
        width: getResponsiveWidth(40),
        height: getResponsiveHeight(40),
        borderRadius: getResponsiveBorderRadius(20),
        backgroundColor: '#4A80F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: getResponsiveFontSize(16),
        fontWeight: 'bold',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    loadingText: {
        marginTop: getResponsiveMargin(12),
        fontSize: getResponsiveFontSize(16),
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: getResponsivePadding(20),
    },
    emptyTitle: {
        fontSize: getResponsiveFontSize(20),
        fontWeight: 'bold',
        color: '#333',
        marginTop: getResponsiveMargin(16),
        marginBottom: getResponsiveMargin(8),
    },
    emptySubtitle: {
        fontSize: getResponsiveFontSize(14),
        color: '#666',
        textAlign: 'center',
        marginBottom: getResponsiveMargin(24),
    },
    refreshButton: {
        paddingHorizontal: getResponsivePadding(24),
        paddingVertical: getResponsivePadding(12),
        backgroundColor: '#4A80F0',
        borderRadius: getResponsiveBorderRadius(12),
    },
    refreshButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: getResponsiveFontSize(14),
    },
});