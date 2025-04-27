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
    ActivityIndicator
} from 'react-native';
import { auth, db } from '../../firebase/firebase';
import { uploadImage } from '../../firebase/cloudinary';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

// Responsive calculation functions
const scale = width / 375; // Based on standard iPhone 8 width
const normalize = (size: number) => Math.round(size * scale);

interface UserData {
    nome_completo: string;
    email: string;
    telefone: string;
    bairro: string;
    cep: string;
    complemento: string;
    data_nascimento: string;
    estado: string;
    logradouro: string;
    type_conta: string;
    uf: string;
    formacoes: string[];
    experiencias: string[];
    profileImage: string;
    password: string;
}

export default function PerfilUser() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'address', 'education', 'experience', 'password'
    const [editData, setEditData] = useState({
        nome_completo: '',
        email: '',
        telefone: '',
        bairro: '',
        cep: '',
        complemento: '',
        data_nascimento: '',
        estado: '',
        logradouro: '',
        type_conta: '',
        uf: '',
        formacoes: [''],
        experiencias: [''],
        profileImage: '',
        senha_atual: '',
        nova_senha: '',
        confirmar_senha: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userCandidatoLogado');
                console.log('Dados do usuário no AsyncStorage:', userDataString);

                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    const userEmail = userData.email;
                    console.log('Email extraído:', userEmail);

                    if (userEmail) {
                        const usersRef = collection(db, 'user_candidato');
                        const q = query(usersRef, where('email', '==', userEmail));
                        const querySnapshot = await getDocs(q);
                        
                        console.log('Resultado da query:', querySnapshot.docs.length);
                        
                        if (!querySnapshot.empty) {
                            const userDoc = querySnapshot.docs[0];
                            const data = userDoc.data();
                            console.log('Dados do usuário:', data);
                            
                            setUserData({
                                nome_completo: data.nome_completo || '',
                                email: data.email || '',
                                telefone: data.telefone || '',
                                bairro: data.bairro || '',
                                cep: data.cep || '',
                                complemento: data.complemento || '',
                                data_nascimento: data.data_nascimento || '',
                                estado: data.estado || '',
                                logradouro: data.logradouro || '',
                                type_conta: data.type_conta || '',
                                uf: data.uf || '',
                                formacoes: data.formacoes || [],
                                experiencias: data.experiencias || [],
                                profileImage: data.profileImage || '',
                                password: data.password || ''
                            });
                            setEditData({
                                nome_completo: data.nome_completo || '',
                                email: data.email || '',
                                telefone: data.telefone || '',
                                bairro: data.bairro || '',
                                cep: data.cep || '',
                                complemento: data.complemento || '',
                                data_nascimento: data.data_nascimento || '',
                                estado: data.estado || '',
                                logradouro: data.logradouro || '',
                                type_conta: data.type_conta || '',
                                uf: data.uf || '',
                                formacoes: data.formacoes || [''],
                                experiencias: data.experiencias || [''],
                                profileImage: data.profileImage || '',
                                senha_atual: '',
                                nova_senha: '',
                                confirmar_senha: ''
                            });
                        } else {
                            console.log('Nenhum usuário encontrado com este email');
                        }
                    }
                } else {
                    console.log('Nenhum dado encontrado no AsyncStorage');
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
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
                        const updateData = {
                            nome_completo: editData.nome_completo,
                            telefone: editData.telefone,
                            bairro: editData.bairro,
                            cep: editData.cep,
                            complemento: editData.complemento,
                            data_nascimento: editData.data_nascimento,
                            estado: editData.estado,
                            logradouro: editData.logradouro,
                            uf: editData.uf,
                            formacoes: editData.formacoes.filter(f => f.trim() !== ''),
                            experiencias: editData.experiencias.filter(e => e.trim() !== ''),
                            profileImage: editData.profileImage
                        };

                        await updateDoc(doc(db, 'user_candidato', userDoc.id), updateData);
                        setUserData((prev: UserData | null) => prev ? { ...prev, ...updateData } : null);
                        setModalVisible(false);
                        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
        }
    };

    const addFormacao = () => {
        setEditData({
            ...editData,
            formacoes: [...editData.formacoes, '']
        });
    };

    const addExperiencia = () => {
        setEditData({
            ...editData,
            experiencias: [...editData.experiencias, '']
        });
    };

    const updateFormacao = (index: number, value: string) => {
        const newFormacoes = [...editData.formacoes];
        newFormacoes[index] = value;
        setEditData({
            ...editData,
            formacoes: newFormacoes
        });
    };

    const updateExperiencia = (index: number, value: string) => {
        const newExperiencias = [...editData.experiencias];
        newExperiencias[index] = value;
        setEditData({
            ...editData,
            experiencias: newExperiencias
        });
    };

    const removeFormacao = (index: number) => {
        const newFormacoes = editData.formacoes.filter((_, i) => i !== index);
        setEditData({
            ...editData,
            formacoes: newFormacoes
        });
    };

    const removeExperiencia = (index: number) => {
        const newExperiencias = [...editData.experiencias];
        newExperiencias.splice(index, 1);
        setEditData({
            ...editData,
            experiencias: newExperiencias
        });
    };

    // Função para formatar o telefone
    const formatarTelefone = (telefone: string) => {
        // Remove todos os caracteres não-numéricos
        const numeroLimpo = telefone.replace(/\D/g, '');
        
        // Aplica a máscara dependendo da quantidade de dígitos
        if (numeroLimpo.length <= 10) {
            // Telefone fixo: (99) 9999-9999
            return numeroLimpo
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        } else {
            // Celular: (99) 99999-9999
            return numeroLimpo
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }
    };

    // Manipulador para atualizar o telefone com a máscara
    const handleTelefoneChange = (text: string) => {
        const telefoneFormatado = formatarTelefone(text);
        setEditData({...editData, telefone: telefoneFormatado});
    };

    const uploadImageToCloudinary = async (uri: string) => {
        try {
            const userDataString = await AsyncStorage.getItem('userCandidatoLogado');
            if (!userDataString) return;

            const userData = JSON.parse(userDataString);
            const userEmail = userData.email;

            if (!userEmail) return;

            // Fazer upload da nova imagem
            const imageUrl = await uploadImage(uri);

            // Atualizar o estado local primeiro
            setProfileImage(imageUrl);
            setEditData(prev => ({ ...prev, profileImage: imageUrl }));

            // Atualizar no Firebase
            const usersRef = collection(db, 'user_candidato');
            const q = query(usersRef, where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'user_candidato', userDoc.id), {
                    profileImage: imageUrl
                });
                
                // Atualizar o estado do usuário
                setUserData((prev: any) => ({ ...prev, profileImage: imageUrl }));
                
                // Mostrar mensagem de sucesso
                Alert.alert('Sucesso', 'Foto de perfil atualizada com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a foto de perfil. Tente novamente.');
            // Restaurar a imagem anterior em caso de erro
            setProfileImage(userData?.profileImage || null);
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
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                // Mostrar a nova imagem imediatamente
                setProfileImage(imageUri);
                // Fazer upload da imagem
                await uploadImageToCloudinary(imageUri);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente.');
        }
    };

    const handleUpdatePassword = async () => {
        try {
            // Verificar se as senhas novas coincidem
            if (editData.nova_senha !== editData.confirmar_senha) {
                Alert.alert('Erro', 'As novas senhas não coincidem');
                return;
            }

            // Verificar se a senha tem pelo menos 6 caracteres
            if (editData.nova_senha.length < 6) {
                Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
                return;
            }

            const user = auth.currentUser;
            if (!user || !user.email) {
                Alert.alert('Erro', 'Usuário não está autenticado');
                return;
            }

            // Reautenticar o usuário antes de alterar a senha
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

            // Atualizar a senha no Firebase Auth
            await updatePassword(user, editData.nova_senha);

            // Atualizar a senha no Firestore
            const usersRef = collection(db, 'user_candidato');
            const q = query(usersRef, where('email', '==', user.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'user_candidato', userDoc.id), {
                    password: editData.nova_senha
                });
            }

            // Limpar os campos de senha
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

    // Get initials for avatar fallback
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
            case 'personal':
                return (
                    <>
                        <Text style={styles.inputLabel}>Nome Completo</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                style={styles.input}
                                    placeholder="Nome Completo"
                                    value={editData.nome_completo}
                                    onChangeText={(text) => setEditData({...editData, nome_completo: text})}
                                />
                        </View>
                                
                        <Text style={styles.inputLabel}>Telefone</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                style={styles.input}
                                    placeholder="(99) 99999-9999"
                                    value={editData.telefone}
                                    onChangeText={handleTelefoneChange}
                                    keyboardType="phone-pad"
                                    maxLength={15}
                                />
                            </View>

                        <Text style={styles.inputLabel}>Data de Nascimento</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                style={styles.input}
                                placeholder="DD/MM/AAAA"
                                value={editData.data_nascimento}
                                onChangeText={(text) => setEditData({...editData, data_nascimento: text})}
                            />
                        </View>
                    </>
                );
            case 'address':
                return (
                    <>
                        <Text style={styles.inputLabel}>CEP</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="location-on" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                    placeholder="CEP"
                                    value={editData.cep}
                                    onChangeText={(text) => setEditData({...editData, cep: text})}
                                keyboardType="numeric"
                                />
                        </View>

                        <Text style={styles.inputLabel}>Logradouro</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="home-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                style={styles.input}
                                    placeholder="Logradouro"
                                    value={editData.logradouro}
                                    onChangeText={(text) => setEditData({...editData, logradouro: text})}
                                />
                        </View>

                        <Text style={styles.inputLabel}>Bairro</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                style={styles.input}
                                    placeholder="Bairro"
                                    value={editData.bairro}
                                    onChangeText={(text) => setEditData({...editData, bairro: text})}
                                />
                        </View>

                        <Text style={styles.inputLabel}>Complemento</Text>
                        <View style={styles.inputContainer}>
                            <MaterialIcons name="apartment" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                style={styles.input}
                                    placeholder="Complemento"
                                    value={editData.complemento}
                                    onChangeText={(text) => setEditData({...editData, complemento: text})}
                                />
                        </View>

                        <View style={styles.rowContainer}>
                            <View style={styles.halfInput}>
                                <Text style={styles.inputLabel}>Estado</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="map" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                        style={styles.input}
                                            placeholder="Estado"
                                            value={editData.estado}
                                            onChangeText={(text) => setEditData({...editData, estado: text})}
                                        />
                                    </View>
                            </View>
                            <View style={styles.halfInput}>
                                <Text style={styles.inputLabel}>UF</Text>
                                <View style={styles.inputContainer}>
                                    <MaterialIcons name="location-city" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                        style={styles.input}
                                            placeholder="UF"
                                            value={editData.uf}
                                            onChangeText={(text) => setEditData({...editData, uf: text})}
                                        maxLength={2}
                                        />
                                    </View>
                                </View>
                            </View>
                    </>
                );
            case 'education':
                return (
                    <>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
                                {editData.formacoes.map((formacao, index) => (
                                <View key={index} style={styles.listItemContainer}>
                                    <Text style={styles.inputLabel}>
                                            {index === 0 ? 'Formação Principal' : `Formação ${index + 1}`}
                                        </Text>
                                    <View style={styles.listItemRow}>
                                        <View style={styles.listItemInput}>
                                            <Ionicons name="school-outline" size={20} color="#666" style={styles.inputIcon} />
                                                <TextInput
                                                style={styles.input}
                                                    placeholder="Descreva sua formação"
                                                    value={formacao}
                                                    onChangeText={(text) => updateFormacao(index, text)}
                                                multiline
                                                />
                                            </View>
                                            {index > 0 && (
                                                <TouchableOpacity 
                                                style={styles.deleteButton}
                                                    onPress={() => removeFormacao(index)}
                                                >
                                                <Ionicons name="trash-outline" size={20} color="#ff5252" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ))}
                                <TouchableOpacity 
                                style={styles.addButton}
                                    onPress={addFormacao}
                                >
                                <Ionicons name="add-circle-outline" size={20} color="#000" />
                                <Text style={styles.addButtonText}>Adicionar Formação</Text>
                                </TouchableOpacity>
                            </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Experiência Profissional</Text>
                                {editData.experiencias.map((experiencia, index) => (
                                <View key={index} style={styles.listItemContainer}>
                                    <Text style={styles.inputLabel}>
                                            {index === 0 ? 'Experiência Principal' : `Experiência ${index + 1}`}
                                        </Text>
                                    <View style={styles.listItemRow}>
                                        <View style={styles.listItemInput}>
                                            <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
                                                <TextInput
                                                style={styles.input}
                                                    placeholder="Descreva sua experiência"
                                                    value={experiencia}
                                                    onChangeText={(text) => updateExperiencia(index, text)}
                                                    multiline
                                                />
                                            </View>
                                            {index > 0 && (
                                                <TouchableOpacity 
                                                style={styles.deleteButton}
                                                    onPress={() => removeExperiencia(index)}
                                                >
                                                <Ionicons name="trash-outline" size={20} color="#ff5252" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ))}
                                <TouchableOpacity 
                                style={styles.addButton}
                                    onPress={addExperiencia}
                                >
                                <Ionicons name="add-circle-outline" size={20} color="#000" />
                                <Text style={styles.addButtonText}>Adicionar Experiência</Text>
                                </TouchableOpacity>
                            </View>
                    </>
                );
            case 'experience':
                return (
                    <>
                        {editData.experiencias.map((experiencia, index) => (
                            <View key={index} style={styles.listItemContainer}>
                                <Text style={styles.inputLabel}>
                                    {index === 0 ? 'Experiência Principal' : `Experiência ${index + 1}`}
                                </Text>
                                <View style={styles.listItemRow}>
                                    <View style={styles.listItemInput}>
                                        <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Descreva sua experiência"
                                            value={experiencia}
                                            onChangeText={(text) => updateExperiencia(index, text)}
                                            multiline
                                        />
                                    </View>
                                    {index > 0 && (
                                        <TouchableOpacity 
                                            style={styles.deleteButton}
                                            onPress={() => removeExperiencia(index)}
                                        >
                                            <Ionicons name="trash-outline" size={20} color="#ff5252" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={addExperiencia}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="#000" />
                            <Text style={styles.addButtonText}>Adicionar Experiência</Text>
                        </TouchableOpacity>
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
                    <View style={styles.profileImageContainer}>
                        {userData?.profileImage ? (
                            <Image
                                source={{ uri: userData.profileImage }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.profileImageFallback}>
                                <Text style={styles.profileImageFallbackText}>
                                    {getInitials(userData?.nome_completo || 'User')}
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
                    
                    <Text style={styles.userName}>{userData?.nome_completo || 'Nome do Usuário'}</Text>
                    <Text style={styles.userEmail}>{userData?.email || 'email@exemplo.com'}</Text>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person" size={20} color="#000" />
                        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Nome</Text>
                            <Text style={styles.infoValue}>{userData?.nome_completo || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>E-mail</Text>
                            <Text style={styles.infoValue}>{userData?.email || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Telefone</Text>
                            <Text style={styles.infoValue}>{userData?.telefone || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Data de Nascimento</Text>
                            <Text style={styles.infoValue}>{userData?.data_nascimento || 'Não informado'}</Text>
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
                            <Text style={styles.infoLabel}>Logradouro</Text>
                            <Text style={styles.infoValue}>{userData?.logradouro || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Bairro</Text>
                            <Text style={styles.infoValue}>{userData?.bairro || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Complemento</Text>
                            <Text style={styles.infoValue}>{userData?.complemento || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>CEP</Text>
                            <Text style={styles.infoValue}>{userData?.cep || 'Não informado'}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Estado/UF</Text>
                            <Text style={styles.infoValue}>{userData?.estado || 'Não informado'}/{userData?.uf || 'N/I'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="school" size={20} color="#000" />
                        <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
                    </View>
                    
                    {userData?.formacoes && userData.formacoes.length > 0 ? (
                        userData.formacoes.map((formacao, index) => (
                            <View key={index} style={styles.educationItem}>
                                <View style={styles.educationBullet}>
                                    <Text style={styles.educationBulletText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.educationText}>{formacao}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyListText}>Nenhuma formação acadêmica cadastrada</Text>
                    )}
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="briefcase" size={20} color="#000" />
                        <Text style={styles.sectionTitle}>Experiência Profissional</Text>
                    </View>
                    
                    {userData?.experiencias && userData.experiencias.length > 0 ? (
                        userData.experiencias.map((experiencia, index) => (
                            <View key={index} style={styles.experienceItem}>
                                <View style={styles.experienceBullet}>
                                    <Text style={styles.experienceBulletText}>{index + 1}</Text>
                                </View>
                                <Text style={styles.experienceText}>{experiencia}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyListText}>Nenhuma experiência profissional cadastrada</Text>
                    )}
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

                        {/* Profile Image Section - Now at the top of the modal */}
                        <View style={styles.profileImageEditContainer}>
                            {profileImage || userData?.profileImage ? (
                                <Image
                                    source={{ uri: profileImage || userData?.profileImage }}
                                    style={styles.profileImageEdit}
                                />
                            ) : (
                                <View style={styles.profileImageFallbackEdit}>
                                    <Text style={styles.profileImageFallbackTextEdit}>
                                        {getInitials(userData?.nome_completo || 'User')}
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

                        {/* Tab Navigation - Now below the profile image */}
                        <View style={styles.tabsContainer}>
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false} 
                                style={styles.tabScrollView}
                                contentContainerStyle={styles.tabScrollContent}
                            >
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
                                    onPress={() => setActiveTab('personal')}
                                >
                                    <Ionicons 
                                        name="person" 
                                        size={20} 
                                        color={activeTab === 'personal' ? '#000' : '#666'} 
                                    />
                                    <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
                                        Pessoal
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'address' && styles.activeTab]}
                                    onPress={() => setActiveTab('address')}
                                >
                                    <Ionicons 
                                        name="location" 
                                        size={20} 
                                        color={activeTab === 'address' ? '#000' : '#666'} 
                                    />
                                    <Text style={[styles.tabText, activeTab === 'address' && styles.activeTabText]}>
                                        Endereço
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'education' && styles.activeTab]}
                                    onPress={() => setActiveTab('education')}
                                >
                                    <Ionicons 
                                        name="school" 
                                        size={20} 
                                        color={activeTab === 'education' ? '#000' : '#666'} 
                                    />
                                    <Text style={[styles.tabText, activeTab === 'education' && styles.activeTabText]}>
                                        Formação
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'experience' && styles.activeTab]}
                                    onPress={() => setActiveTab('experience')}
                                >
                                    <Ionicons 
                                        name="briefcase" 
                                        size={20} 
                                        color={activeTab === 'experience' ? '#000' : '#666'} 
                                    />
                                    <Text style={[styles.tabText, activeTab === 'experience' && styles.activeTabText]}>
                                        Experiência
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

                        {/* Content Area - Below tabs */}
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
    educationItem: {
        flexDirection: 'row',
        marginBottom: normalize(12),
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: normalize(8),
    },
    educationBullet: {
        width: normalize(24),
        height: normalize(24),
        borderRadius: normalize(12),
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(12),
        marginTop: normalize(2),
    },
    educationBulletText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: normalize(12),
    },
    educationText: {
        flex: 1,
        fontSize: normalize(15),
        color: '#000',
        lineHeight: normalize(22),
    },
    experienceItem: {
        flexDirection: 'row',
        marginBottom: normalize(12),
        alignItems: 'flex-start',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: normalize(8),
    },
    experienceBullet: {
        width: normalize(24),
        height: normalize(24),
        borderRadius: normalize(12),
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(12),
        marginTop: normalize(2),
    },
    experienceBulletText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: normalize(12),
    },
    experienceText: {
        flex: 1,
        fontSize: normalize(15),
        color: '#000',
        lineHeight: normalize(22),
    },
    emptyListText: {
        fontSize: normalize(14),
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: normalize(12),
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
    // New styles for the redesigned modal
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    listItemContainer: {
        marginBottom: normalize(16),
    },
    listItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    listItemInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: normalize(12),
        paddingHorizontal: normalize(12),
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    deleteButton: {
        width: normalize(40),
        height: normalize(40),
        borderRadius: normalize(20),
        backgroundColor: 'rgba(255, 82, 82, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: normalize(8),
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(12),
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: normalize(12),
        marginTop: normalize(8),
    },
    addButtonText: {
        color: '#000',
        fontWeight: '500',
        marginLeft: normalize(8),
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
    sectionContainer: {
        marginBottom: normalize(24),
    },
});