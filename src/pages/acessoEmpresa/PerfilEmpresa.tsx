import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    Modal, 
    TextInput, 
    Alert,
    Dimensions,
    Platform,
    StatusBar,
    SafeAreaView,
    KeyboardAvoidingView,
    ActivityIndicator,
    Linking
} from 'react-native';
import { auth, db } from '../../firebase/firebase';
import { uploadImage } from '../../firebase/cloudinary';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

// Funções responsivas
const scale = width / 375;
const normalize = (size: number) => Math.round(size * scale);

interface EmpresaData {
    nome_empresa: string;
    email: string;
    telefone: string;
    cnpj: string;
    ramo_atividade: string;
    descricao: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    site: string;
    linkedin: string;
    profileImage: string;
    password: string;
    premium: boolean;
    data_pagamento_premium: string;
    publicacao_restante: number;
}

export default function PerfilEmpresa() {
    const [empresaData, setEmpresaData] = useState<EmpresaData | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('info'); // 'info', 'endereco', 'contato', 'password'
    const [editData, setEditData] = useState({
        nome_empresa: '',
        email: '',
        telefone: '',
        cnpj: '',
        ramo_atividade: '',
        descricao: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        site: '',
        linkedin: '',
        profileImage: '',
        senha_atual: '',
        nova_senha: '',
        confirmar_senha: ''
    });
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [publicacaoRestante, setPublicacaoRestante] = useState<number | null>(null);

    // Função para verificar se o premium expirou
    const verificarPremiumExpirado = async (data: any) => {
        if (data.premium && data.data_pagamento_premium) {
            const dataPagamento = new Date(data.data_pagamento_premium);
            const hoje = new Date();
            
            // Calcula a diferença em dias
            const diffTime = Math.abs(hoje.getTime() - dataPagamento.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Se passou 30 dias, remove o premium
            if (diffDays >= 30) {
                try {
                    const empresaDataString = await AsyncStorage.getItem('userEmpresaLogado');
                    if (empresaDataString) {
                        const empresaData = JSON.parse(empresaDataString);
                        const empresaEmail = empresaData.email;
                        
                        if (empresaEmail) {
                            const empresasRef = collection(db, 'user_empresa');
                            const q = query(empresasRef, where('email_empresa', '==', empresaEmail));
                            const querySnapshot = await getDocs(q);
                            
                            if (!querySnapshot.empty) {
                                const empresaDoc = querySnapshot.docs[0];
                                await updateDoc(doc(db, 'user_empresa', empresaDoc.id), {
                                    premium: false,
                                    publicacao_restante: 2
                                });
                                
                                // Atualiza o estado local
                                setIsPremium(false);
                                setPublicacaoRestante(2);
                                
                                Alert.alert(
                                    'Premium Expirado',
                                    'Seu plano premium expirou. Renove para continuar com os benefícios!'
                                );
                            }
                        }
                    }
                } catch (error) {
                    console.error('Erro ao verificar premium expirado:', error);
                }
            }
        }
    };

    useEffect(() => {
        let unsubscribe: (() => void) | null = null;
        const fetchEmpresaDataRealtime = async () => {
            try {
                const empresaDataString = await AsyncStorage.getItem('userEmpresaLogado');
                if (empresaDataString) {
                    const empresaData = JSON.parse(empresaDataString);
                    const empresaEmail = empresaData.email;
                    if (empresaEmail) {
                        const empresasRef = collection(db, 'user_empresa');
                        const q = query(empresasRef, where('email_empresa', '==', empresaEmail));
                        unsubscribe = onSnapshot(q, (querySnapshot) => {
                            if (!querySnapshot.empty) {
                                const empresaDoc = querySnapshot.docs[0];
                                const data = empresaDoc.data();
                                
                                // Verifica se o premium expirou
                                verificarPremiumExpirado(data);
                                
                                setIsPremium(!!data.premium);
                                setPublicacaoRestante(typeof data.publicacao_restante === 'number' ? data.publicacao_restante : null);
                                
                                // Atualizar estado com dados do Firestore
                                const empresaDataFirestore = {
                                    nome_empresa: data.nome_empresa || '',
                                    email: data.email || '',
                                    telefone: data.telefone || '',
                                    cnpj: data.cnpj_empresa || '',
                                    ramo_atividade: data.ramo_atividade || '',
                                    descricao: data.descricao || '',
                                    endereco: data.endereco || '',
                                    cidade: data.cidade || '',
                                    estado: data.estado || '',
                                    cep: data.cep || '',
                                    site: data.site || '',
                                    linkedin: data.linkedin || '',
                                    profileImage: data.profileImage || '',
                                    password: data.password || '',
                                    premium: data.premium || false,
                                    data_pagamento_premium: data.data_pagamento_premium || '',
                                    publicacao_restante: data.publicacao_restante || 2
                                };
                                
                                setEmpresaData(empresaDataFirestore);
                                setEditData({
                                    ...empresaDataFirestore,
                                    senha_atual: '',
                                    nova_senha: '',
                                    confirmar_senha: ''
                                });
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados da empresa:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmpresaDataRealtime();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const handleSave = async () => {
        try {
            const empresaDataString = await AsyncStorage.getItem('userEmpresaLogado');
            if (empresaDataString) {
                const empresaData = JSON.parse(empresaDataString);
                const empresaEmail = empresaData.email;

                if (empresaEmail) {
                    const empresasRef = collection(db, 'user_empresa');
                    const q = query(empresasRef, where('email_empresa', '==', empresaEmail));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const empresaDoc = querySnapshot.docs[0];
                        const updateData = {
                            nome_empresa: editData.nome_empresa,
                            telefone_empresa: editData.telefone,
                            cnpj_empresa: editData.cnpj,
                            ramo_atividade: editData.ramo_atividade,
                            descricao: editData.descricao,
                            endereco: editData.endereco,
                            cidade: editData.cidade,
                            estado: editData.estado,
                            cep: editData.cep,
                            site: editData.site,
                            linkedin: editData.linkedin,
                            profileImage: editData.profileImage
                        };

                        console.log('Atualizando documento:', empresaDoc.id);
                        console.log('Dados para atualização:', updateData);

                        await updateDoc(doc(db, 'user_empresa', empresaDoc.id), updateData);
                        
                        // Atualiza o estado local com os novos dados
                        setEmpresaData(prev => {
                            if (!prev) return null;
                            return {
                                ...prev,
                                nome_empresa: updateData.nome_empresa,
                                telefone: updateData.telefone_empresa,
                                cnpj: updateData.cnpj_empresa,
                                ramo_atividade: updateData.ramo_atividade,
                                descricao: updateData.descricao,
                                endereco: updateData.endereco,
                                cidade: updateData.cidade,
                                estado: updateData.estado,
                                cep: updateData.cep,
                                site: updateData.site,
                                linkedin: updateData.linkedin,
                                profileImage: updateData.profileImage
                            };
                        });

                        setModalVisible(false);
                        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
                    } else {
                        Alert.alert('Erro', 'Empresa não encontrada no banco de dados');
                    }
                } else {
                    Alert.alert('Erro', 'Email da empresa não encontrado');
                }
            } else {
                Alert.alert('Erro', 'Dados da empresa não encontrados no AsyncStorage');
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
        }
    };

    const uploadImageToCloudinary = async (uri: string) => {
        try {
            const empresaDataString = await AsyncStorage.getItem('userEmpresaLogado');
            if (!empresaDataString) return;

            const empresaData = JSON.parse(empresaDataString);
            const empresaEmail = empresaData.email;

            if (!empresaEmail) return;

            const imageUrl = await uploadImage(uri);
            console.log('URL da imagem gerada:', imageUrl);

            // Atualiza o estado local primeiro
            setProfileImage(imageUrl);
            setEditData(prev => ({ ...prev, profileImage: imageUrl }));

            // Busca o documento da empresa no Firestore
            const empresasRef = collection(db, 'user_empresa');
            const q = query(empresasRef, where('email_empresa', '==', empresaEmail));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const empresaDoc = querySnapshot.docs[0];
                console.log('Atualizando imagem no documento:', empresaDoc.id);
                
                // Atualiza o documento no Firestore
                await updateDoc(doc(db, 'user_empresa', empresaDoc.id), {
                    profileImage: imageUrl
                });
                
                // Atualiza o estado global da empresa
                setEmpresaData(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        profileImage: imageUrl
                    };
                });
                
                Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
            } else {
                console.error('Nenhum documento encontrado para o email:', empresaEmail);
                Alert.alert('Erro', 'Empresa não encontrada no banco de dados');
            }
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil. Tente novamente.');
            // Restaura a imagem anterior em caso de erro
            setProfileImage(empresaData?.profileImage || null);
        }
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar uma foto.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                setProfileImage(imageUri);
                await uploadImageToCloudinary(imageUri);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente.');
        }
    };

    const handleUpdatePassword = async () => {
        try {
            if (editData.nova_senha !== editData.confirmar_senha) {
                Alert.alert('Erro', 'As novas senhas não coincidem');
                return;
            }

            if (editData.nova_senha.length < 6) {
                Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
                return;
            }

            const user = auth.currentUser;
            if (!user || !user.email) {
                Alert.alert('Erro', 'Usuário não está autenticado');
                return;
            }

            const credential = EmailAuthProvider.credential(
                user.email,
                editData.senha_atual
            );

            try {
                await reauthenticateWithCredential(user, credential);
            } catch (reAuthError) {
                console.error('Erro na reautenticação:', reAuthError);
                Alert.alert('Erro', 'Senha atual incorreta');
                return;
            }

            await updatePassword(user, editData.nova_senha);

            const empresasRef = collection(db, 'user_empresa');
            const q = query(empresasRef, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const empresaDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'user_empresa', empresaDoc.id), {
                    password: editData.nova_senha
                });
            }

            setEditData(prev => ({
                ...prev,
                senha_atual: '',
                nova_senha: '',
                confirmar_senha: ''
            }));

            Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
            setModalVisible(false);
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a senha. Tente novamente mais tarde.');
        }
    };

    const getInitials = (name: string) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map(word => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return (
                    <>
                        <Text style={styles.inputLabel}>Nome da Empresa</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nome da Empresa"
                                value={editData.nome_empresa}
                                onChangeText={(text) => setEditData({...editData, nome_empresa: text})}
                            />
                        </View>

                        <Text style={styles.inputLabel}>CNPJ</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="document-text-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="CNPJ"
                                value={editData.cnpj}
                                onChangeText={(text) => setEditData({...editData, cnpj: text})}
                            />
                        </View>

                        <Text style={styles.inputLabel}>Ramo de Atividade</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ramo de Atividade"
                                value={editData.ramo_atividade}
                                onChangeText={(text) => setEditData({...editData, ramo_atividade: text})}
                            />
                        </View>

                        <Text style={styles.inputLabel}>Descrição</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="text-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { height: 100 }]}
                                placeholder="Descrição da empresa"
                                value={editData.descricao}
                                onChangeText={(text) => setEditData({...editData, descricao: text})}
                                multiline
                            />
                        </View>
                    </>
                );
            case 'endereco':
                return (
                    <>
                        <Text style={styles.inputLabel}>Endereço</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Endereço"
                                value={editData.endereco}
                                onChangeText={(text) => setEditData({...editData, endereco: text})}
                            />
                        </View>

                        <Text style={styles.inputLabel}>Cidade</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="home-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Cidade"
                                value={editData.cidade}
                                onChangeText={(text) => setEditData({...editData, cidade: text})}
                            />
                        </View>

                        <Text style={styles.inputLabel}>Estado</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="map-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Estado"
                                value={editData.estado}
                                onChangeText={(text) => setEditData({...editData, estado: text})}
                            />
                        </View>

                        <Text style={styles.inputLabel}>CEP</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="navigate-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="CEP"
                                value={editData.cep}
                                onChangeText={(text) => setEditData({...editData, cep: text})}
                            />
                        </View>
                    </>
                );
            case 'contato':
                return (
                    <>
                        <Text style={styles.inputLabel}>Telefone</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Telefone"
                                value={editData.telefone}
                                onChangeText={(text) => setEditData({...editData, telefone: text})}
                            />
                        </View>

                        <Text style={styles.inputLabel}>Site</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="globe-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Site"
                                value={editData.site}
                                onChangeText={(text) => setEditData({...editData, site: text})}
                            />
                        </View>

                        <Text style={styles.inputLabel}>LinkedIn</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="logo-linkedin" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="LinkedIn"
                                value={editData.linkedin}
                                onChangeText={(text) => setEditData({...editData, linkedin: text})}
                            />
                        </View>
                    </>
                );
            case 'password':
                return (
                    <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>Alterar Senha</Text>
                        
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Senha atual"
                                value={editData.senha_atual}
                                onChangeText={(text) => setEditData({...editData, senha_atual: text})}
                                secureTextEntry
                                autoCapitalize='none'
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Nova senha"
                                value={editData.nova_senha}
                                onChangeText={(text) => setEditData({...editData, nova_senha: text})}
                                secureTextEntry
                                autoCapitalize='none'
                            />
                        </View>
                        
                        <View style={styles.inputContainer}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirmar nova senha"
                                value={editData.confirmar_senha}
                                onChangeText={(text) => setEditData({...editData, confirmar_senha: text})}
                                secureTextEntry
                                autoCapitalize='none'
                            />
                        </View>
                        
                        <TouchableOpacity
                            style={[styles.saveButton, { marginTop: 20 }]}
                            onPress={handleUpdatePassword}
                        >
                            <Text style={styles.saveButtonText}>Atualizar Senha</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    // Função para o botão Upgrade com integração Stripe via backend Render
    const handleUpgrade = async () => {
        try {
            // Pega o e-mail da empresa logada
            const userDataString = await AsyncStorage.getItem('userEmpresaLogado');
            if (!userDataString) {
                Alert.alert('Erro', 'Usuário não encontrado');
                return;
            }
            const userData = JSON.parse(userDataString);
            const email = userData.email;
            if (!email) {
                Alert.alert('Erro', 'E-mail não encontrado');
                return;
            }

            // Chama a API para criar a sessão do Stripe
            const response = await fetch('https://backend-gopq.onrender.com/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (data.url) {
                Linking.openURL(data.url);
            } else {
                Alert.alert('Erro', 'Não foi possível criar o pagamento.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao processar o pagamento.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    {/* Banner de status melhorado */}
                    {isPremium ? (
                        <LinearGradient
                            colors={['#43e97b', '#38f9d7']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.statusBanner}
                        >
                            <View style={styles.statusBannerContent}>
                                <View style={styles.statusIconContainer}>
                                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                                </View>
                                <View style={styles.statusTextContainer}>
                                    <Text style={styles.statusBannerTitle}>Conta Premium</Text>
                                    <Text style={styles.statusBannerText}>
                                        Vagas restantes: <Text style={styles.publicacoesCount}>{publicacaoRestante ?? 0}</Text>
                                    </Text>
                                    <Text style={styles.statusBannerText}>
                                        Dias restantes: <Text style={styles.publicacoesCount}>{empresaData?.publicacao_restante || 0}</Text>
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    ) : (
                        <View style={styles.verificationContainer}>
                            <LinearGradient
                                colors={['#6366F1', '#4F46E5']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.statusBanner}
                            >
                                <View style={styles.statusBannerContent}>
                                    <View style={styles.statusIconContainer}>
                                        <Ionicons name="alert-circle" size={24} color="#fff" />
                                    </View>
                                    <View style={styles.statusTextContainer}>
                                        <Text style={styles.statusBannerTitle}>Conta não verificada</Text>
                                        <Text style={styles.statusBannerText}>
                                            Vagas restantes: <Text style={styles.publicacoesCount}>{publicacaoRestante ?? 0}</Text>
                                        </Text>
                                        {publicacaoRestante !== null && publicacaoRestante <= 0 && (
                                            <Text style={styles.statusBannerText}>
                                                Você atingiu o limite de 2 vagas mensais
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </LinearGradient>
                            
                            {/* Botão Upgrade redesenhado */}
                            <TouchableOpacity 
                                style={styles.upgradeButton}
                                onPress={handleUpgrade}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#F59E0B', '#D97706']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.upgradeButtonGradient}
                                >
                                    <Ionicons name="star" size={20} color="#fff" />
                                    <Text style={styles.upgradeButtonText}>Upgrade Premium</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.profileImageContainer}>
                        {empresaData?.profileImage ? (
                            <Image
                                source={{ uri: empresaData.profileImage }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.profileImageFallback}>
                                <Text style={styles.profileImageFallbackText}>
                                    {getInitials(empresaData?.nome_empresa || 'Emp')}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity 
                            style={styles.editPhotoButton}
                            onPress={pickImage}
                        >
                            <Ionicons name="camera" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.userName}>{empresaData?.nome_empresa || 'Nome da Empresa'}</Text>
                    <Text style={styles.userEmail}>{empresaData?.email || 'email@empresa.com'}</Text>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="business" size={20} color="#000" />
                        <Text style={styles.sectionTitle}>Informações da Empresa</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Nome</Text>
                            <Text style={styles.infoValue}>{empresaData?.nome_empresa || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>CNPJ</Text>
                            <Text style={styles.infoValue}>{empresaData?.cnpj || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Ramo de Atividade</Text>
                            <Text style={styles.infoValue}>{empresaData?.ramo_atividade || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Descrição</Text>
                            <Text style={styles.infoValue}>{empresaData?.descricao || 'Não informado'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location" size={20} color="#000" />
                        <Text style={styles.sectionTitle}>Endereço</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Endereço</Text>
                            <Text style={styles.infoValue}>{empresaData?.endereco || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Cidade</Text>
                            <Text style={styles.infoValue}>{empresaData?.cidade || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Estado</Text>
                            <Text style={styles.infoValue}>{empresaData?.estado || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>CEP</Text>
                            <Text style={styles.infoValue}>{empresaData?.cep || 'Não informado'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="call" size={20} color="#000" />
                        <Text style={styles.sectionTitle}>Contato</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Telefone</Text>
                            <Text style={styles.infoValue}>{empresaData?.telefone || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Site</Text>
                            <Text style={styles.infoValue}>{empresaData?.site || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>LinkedIn</Text>
                            <Text style={styles.infoValue}>{empresaData?.linkedin || 'Não informado'}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => setModalVisible(true)}
                >
                    <View style={styles.editButtonGradient}>
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text style={styles.editButtonText}>Editar Perfil</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Editar Perfil</Text>
                        </View>

                        <View style={styles.profileImageEditContainer}>
                            {profileImage || empresaData?.profileImage ? (
                                <Image
                                    source={{ uri: profileImage || empresaData?.profileImage }}
                                    style={styles.profileImageEdit}
                                />
                            ) : (
                                <View style={styles.profileImageFallbackEdit}>
                                    <Text style={styles.profileImageFallbackTextEdit}>
                                        {getInitials(empresaData?.nome_empresa || 'Emp')}
                                    </Text>
                                </View>
                            )}
                            <TouchableOpacity 
                                style={styles.editPhotoButtonModal}
                                onPress={pickImage}
                            >
                                <Ionicons name="camera" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.tabsContainer}>
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false} 
                                style={styles.tabScrollView}
                                contentContainerStyle={styles.tabScrollContent}
                            >
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'info' && styles.activeTab]}
                                    onPress={() => setActiveTab('info')}
                                >
                                    <Ionicons 
                                        name="business" 
                                        size={20} 
                                        color={activeTab === 'info' ? '#000' : '#666'} 
                                    />
                                    <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
                                        Informações
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'endereco' && styles.activeTab]}
                                    onPress={() => setActiveTab('endereco')}
                                >
                                    <Ionicons 
                                        name="location" 
                                        size={20} 
                                        color={activeTab === 'endereco' ? '#000' : '#666'} 
                                    />
                                    <Text style={[styles.tabText, activeTab === 'endereco' && styles.activeTabText]}>
                                        Endereço
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'contato' && styles.activeTab]}
                                    onPress={() => setActiveTab('contato')}
                                >
                                    <Ionicons 
                                        name="call" 
                                        size={20} 
                                        color={activeTab === 'contato' ? '#000' : '#666'} 
                                    />
                                    <Text style={[styles.tabText, activeTab === 'contato' && styles.activeTabText]}>
                                        Contato
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'password' && styles.activeTab]}
                                    onPress={() => setActiveTab('password')}
                                >
                                    <Ionicons 
                                        name="key" 
                                        size={20} 
                                        color={activeTab === 'password' ? '#000' : '#666'} 
                                    />
                                    <Text style={[styles.tabText, activeTab === 'password' && styles.activeTabText]}>
                                        Senha
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>

                        <ScrollView 
                            style={styles.modalScroll} 
                            contentContainerStyle={styles.modalScrollContent}
                        >
                            {renderTabContent()}
                        </ScrollView>

                        {activeTab !== 'password' && (
                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: normalize(12),
        fontSize: normalize(16),
        color: '#666',
    },
    header: {
        paddingTop: normalize(isIOS ? 20 : 40),
        paddingBottom: normalize(30),
        alignItems: 'center',
        borderBottomLeftRadius: normalize(30),
        borderBottomRightRadius: normalize(30),
        backgroundColor: '#000',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: normalize(16),
    },
    profileImage: {
        width: normalize(100),
        height: normalize(100),
        borderRadius: normalize(50),
        borderWidth: 3,
        borderColor: 'white',
    },
    profileImageFallback: {
        width: normalize(100),
        height: normalize(100),
        borderRadius: normalize(50),
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    profileImageFallbackText: {
        fontSize: normalize(36),
        fontWeight: 'bold',
        color: 'white',
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#000',
        width: normalize(36),
        height: normalize(36),
        borderRadius: normalize(18),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: {
        fontSize: normalize(22),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: normalize(4),
    },
    userEmail: {
        fontSize: normalize(14),
        color: 'rgba(255, 255, 255, 0.8)',
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: normalize(16),
        padding: normalize(16),
        marginHorizontal: normalize(16),
        marginTop: normalize(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(16),
    },
    sectionTitle: {
        fontSize: normalize(18),
        fontWeight: '600',
        color: '#000',
        marginLeft: normalize(8),
    },
    infoRow: {
        marginBottom: normalize(12),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: normalize(8),
    },
    infoItem: {
        flexDirection: 'column',
    },
    infoLabel: {
        fontSize: normalize(14),
        color: '#666',
        marginBottom: normalize(4),
    },
    infoValue: {
        fontSize: normalize(16),
        color: '#000',
        fontWeight: '500',
    },
    editButton: {
        marginHorizontal: normalize(16),
        marginVertical: normalize(24),
        borderRadius: normalize(12),
        overflow: 'hidden',
    },
    editButtonGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(14),
        backgroundColor: '#000',
    },
    editButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: normalize(16),
        marginLeft: normalize(8),
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: normalize(24),
        borderTopRightRadius: normalize(24),
        height: height * 0.85,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(16),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        right: normalize(16),
        top: normalize(16),
    },
    modalTitle: {
        fontSize: normalize(18),
        fontWeight: '600',
        color: '#000',
    },
    profileImageEditContainer: {
        alignItems: 'center',
        marginVertical: normalize(20),
        position: 'relative',
    },
    profileImageEdit: {
        width: normalize(100),
        height: normalize(100),
        borderRadius: normalize(50),
        borderWidth: 3,
        borderColor: '#000',
    },
    profileImageFallbackEdit: {
        width: normalize(100),
        height: normalize(100),
        borderRadius: normalize(50),
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000',
    },
    profileImageFallbackTextEdit: {
        fontSize: normalize(36),
        fontWeight: 'bold',
        color: 'white',
    },
    editPhotoButtonModal: {
        position: 'absolute',
        bottom: 0,
        right: normalize(20),
        backgroundColor: '#000',
        width: normalize(36),
        height: normalize(36),
        borderRadius: normalize(18),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    tabsContainer: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    tabScrollView: {
        flexGrow: 0,
    },
    tabScrollContent: {
        paddingHorizontal: normalize(10),
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(16),
        marginRight: normalize(8),
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#000',
    },
    tabText: {
        fontSize: normalize(14),
        color: '#666',
        marginLeft: normalize(8),
    },
    activeTabText: {
        color: '#000',
        fontWeight: '600',
    },
    modalScroll: {
        flex: 1,
        padding: normalize(16),
    },
    modalScrollContent: {
        paddingBottom: normalize(20),
    },
    tabContent: {
        padding: normalize(16),
    },
    inputLabel: {
        fontSize: normalize(14),
        color: '#666',
        marginBottom: normalize(6),
        marginLeft: normalize(4),
        marginTop: normalize(10),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: normalize(12),
        paddingHorizontal: normalize(12),
        marginBottom: normalize(16),
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    inputIcon: {
        marginRight: normalize(8),
    },
    input: {
        flex: 1,
        paddingVertical: normalize(12),
        fontSize: normalize(15),
        color: '#000',
    },
    saveButton: {
        backgroundColor: '#000',
        borderRadius: normalize(12),
        paddingVertical: normalize(14),
        alignItems: 'center',
        marginHorizontal: normalize(16),
        marginBottom: normalize(16),
        marginTop: normalize(8),
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: normalize(15),
    },
    // Estilos melhorados para o banner de status e botão de upgrade
    verificationContainer: {
        width: '100%',
        paddingHorizontal: normalize(16),
        marginBottom: normalize(20),
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: normalize(16),
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(16),
        marginBottom: normalize(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
    },
    statusBannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    statusIconContainer: {
        width: normalize(40),
        height: normalize(40),
        borderRadius: normalize(20),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(12),
    },
    statusTextContainer: {
        flex: 1,
    },
    statusBannerTitle: {
        color: '#fff',
        fontSize: normalize(16),
        fontWeight: 'bold',
        marginBottom: normalize(4),
    },
    statusBannerText: {
        color: '#fff',
        fontSize: normalize(14),
    },
    publicacoesCount: {
        fontWeight: 'bold',
        fontSize: normalize(16),
        color: '#fff',
    },
    // Novos estilos para o botão de upgrade
    upgradeButton: {
        borderRadius: normalize(12),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    upgradeButtonGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
    },
    upgradeButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: normalize(16),
        marginLeft: normalize(8),
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});