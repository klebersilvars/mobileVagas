import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { auth, db } from '../../firebase/firebase';
import { uploadImage } from '../../firebase/cloudinary';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { StylePerfilUser } from './StylePerfilUser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                            
                            setUserData(data);
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
                        setUserData((prev: UserData) => ({ ...prev, ...updateData }));
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
        const newExperiencias = editData.experiencias.filter((_, i) => i !== index);
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
                mediaTypes: ['images'],
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
            if (!editData.senha_atual || !editData.nova_senha || !editData.confirmar_senha) {
                Alert.alert('Erro', 'Preencha todos os campos de senha');
                return;
            }

            if (editData.nova_senha !== editData.confirmar_senha) {
                Alert.alert('Erro', 'As senhas não coincidem');
                return;
            }

            const userDataString = await AsyncStorage.getItem('userCandidatoLogado');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const userEmail = userData.email;

                if (userEmail) {
                    // Verificar senha atual no Firestore
                    const usersRef = collection(db, 'user_candidato');
                    const q = query(usersRef, where('email', '==', userEmail));
                    const querySnapshot = await getDocs(q);
                    
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        const userData = userDoc.data();

                        if (userData.password !== editData.senha_atual) {
                            Alert.alert('Erro', 'Senha atual incorreta');
                            return;
                        }

                        // Atualizar senha no Authentication
                        const user = auth.currentUser;
                        if (user) {
                            await updatePassword(user, editData.nova_senha);
                        }

                        // Atualizar senha no Firestore
                        await updateDoc(doc(db, 'user_candidato', userDoc.id), {
                            password: editData.nova_senha
                        });

                        // Limpar campos de senha
                        setEditData(prev => ({
                            ...prev,
                            senha_atual: '',
                            nova_senha: '',
                            confirmar_senha: ''
                        }));

                        Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            Alert.alert('Erro', 'Não foi possível atualizar a senha. Tente novamente.');
        }
    };

    if (loading) {
        return (
            <View style={StylePerfilUser.container}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={StylePerfilUser.container}>
            <View style={StylePerfilUser.header}>
                <View style={StylePerfilUser.profileImageContainer}>
                    <Image
                        source={userData?.profileImage ? { uri: userData.profileImage } : require('../../../assets/homem.png')}
                        style={StylePerfilUser.profileImage}
                    />
                    <TouchableOpacity 
                        style={StylePerfilUser.editPhotoButton}
                        onPress={pickImage}
                    >
                        <MaterialCommunityIcons name="camera" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={StylePerfilUser.name}>{userData?.nome_completo || 'Nome do Usuário'}</Text>
            </View>

            <View style={StylePerfilUser.section}>
                <Text style={StylePerfilUser.sectionTitle}>Informações Pessoais</Text>
                
                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>Nome Completo</Text>
                    <Text style={StylePerfilUser.infoValue}>{userData?.nome_completo || 'Não informado'}</Text>
                </View>

                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>E-mail</Text>
                    <Text style={StylePerfilUser.infoValue}>{userData?.email || 'Não informado'}</Text>
                </View>

                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>Telefone</Text>
                    <Text style={StylePerfilUser.infoValue}>{userData?.telefone || 'Não informado'}</Text>
                </View>

                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>Data de Nascimento</Text>
                    <Text style={StylePerfilUser.infoValue}>{userData?.data_nascimento || 'Não informado'}</Text>
                </View>
            </View>

            <View style={StylePerfilUser.section}>
                <Text style={StylePerfilUser.sectionTitle}>Currículo</Text>
                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>Formações:</Text>
                    <View style={StylePerfilUser.infoValue}>
                        {userData?.formacoes?.map((formacao: string, index: number) => (
                            <Text key={index} style={StylePerfilUser.infoValue}>{formacao || 'Não informada'}</Text>
                        ))}
                    </View>
                </View>
                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>Experiências:</Text>
                    <View style={StylePerfilUser.infoValue}>
                        {userData?.experiencias?.map((experiencia: string, index: number) => (
                            <Text key={index} style={StylePerfilUser.infoValue}>{experiencia || 'Não informada'}</Text>
                        ))}
                    </View>
                </View>
            </View>

            <TouchableOpacity 
                style={StylePerfilUser.editButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={StylePerfilUser.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={StylePerfilUser.modalContainer}>
                    <View style={StylePerfilUser.modalContent}>
                        <View style={StylePerfilUser.dragIndicator} />
                        
                        <View style={StylePerfilUser.modalHeader}>
                            <Text style={StylePerfilUser.modalTitle}>Editar Perfil</Text>
                        </View>
                        
                        <ScrollView style={StylePerfilUser.modalScrollView}>
                            <View style={StylePerfilUser.avatarEditContainer}>
                                <Image
                                    source={editData.profileImage ? { uri: editData.profileImage } : require('../../../assets/homem.png')}
                                    style={StylePerfilUser.modalProfileImage}
                                />
                                <TouchableOpacity 
                                    style={StylePerfilUser.changePhotoButton}
                                    onPress={pickImage}
                                >
                                    <Text style={StylePerfilUser.changePhotoText}>Alterar foto</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={StylePerfilUser.sectionContainer}>
                                <Text style={StylePerfilUser.sectionTitle}>Informações Pessoais</Text>
                                <Text style={StylePerfilUser.inputLabel}>Nome Completo</Text>
                                <TextInput
                                    style={StylePerfilUser.input}
                                    placeholder="Nome Completo"
                                    value={editData.nome_completo}
                                    onChangeText={(text) => setEditData({...editData, nome_completo: text})}
                                />
                                
                                <Text style={StylePerfilUser.inputLabel}>Telefone</Text>
                                <TextInput
                                    style={StylePerfilUser.input}
                                    placeholder="(99) 99999-9999"
                                    value={editData.telefone}
                                    onChangeText={handleTelefoneChange}
                                    keyboardType="phone-pad"
                                    maxLength={15}
                                />
                            </View>

                            <View style={StylePerfilUser.sectionContainer}>
                                <Text style={StylePerfilUser.sectionTitle}>Endereço</Text>
                                <Text style={StylePerfilUser.inputLabel}>CEP</Text>
                                <TextInput
                                    style={StylePerfilUser.input}
                                    placeholder="CEP"
                                    value={editData.cep}
                                    onChangeText={(text) => setEditData({...editData, cep: text})}
                                />

                                <Text style={StylePerfilUser.inputLabel}>Logradouro</Text>
                                <TextInput
                                    style={StylePerfilUser.input}
                                    placeholder="Logradouro"
                                    value={editData.logradouro}
                                    onChangeText={(text) => setEditData({...editData, logradouro: text})}
                                />

                                <Text style={StylePerfilUser.inputLabel}>Bairro</Text>
                                <TextInput
                                    style={StylePerfilUser.input}
                                    placeholder="Bairro"
                                    value={editData.bairro}
                                    onChangeText={(text) => setEditData({...editData, bairro: text})}
                                />

                                <Text style={StylePerfilUser.inputLabel}>Complemento</Text>
                                <TextInput
                                    style={StylePerfilUser.input}
                                    placeholder="Complemento"
                                    value={editData.complemento}
                                    onChangeText={(text) => setEditData({...editData, complemento: text})}
                                />

                                <View style={StylePerfilUser.inputGroup}>
                                    <View style={StylePerfilUser.inputHalf}>
                                        <Text style={StylePerfilUser.inputLabel}>Estado</Text>
                                        <TextInput
                                            style={StylePerfilUser.input}
                                            placeholder="Estado"
                                            value={editData.estado}
                                            onChangeText={(text) => setEditData({...editData, estado: text})}
                                        />
                                    </View>
                                    <View style={StylePerfilUser.inputHalf}>
                                        <Text style={StylePerfilUser.inputLabel}>UF</Text>
                                        <TextInput
                                            style={StylePerfilUser.input}
                                            placeholder="UF"
                                            value={editData.uf}
                                            onChangeText={(text) => setEditData({...editData, uf: text})}
                                        />
                                    </View>
                                </View>
                            </View>
                            
                            <View style={StylePerfilUser.sectionContainer}>
                                <Text style={StylePerfilUser.sectionTitle}>Formações</Text>
                                {editData.formacoes.map((formacao, index) => (
                                    <View key={index} style={StylePerfilUser.inputContainer}>
                                        <Text style={StylePerfilUser.inputLabel}>
                                            {index === 0 ? 'Formação Principal' : `Formação ${index + 1}`}
                                        </Text>
                                        <View style={StylePerfilUser.inputRow}>
                                            <View style={[
                                                StylePerfilUser.inputWithDelete,
                                                index === 0 && { marginRight: 0 }
                                            ]}>
                                                <TextInput
                                                    style={StylePerfilUser.input}
                                                    placeholder="Descreva sua formação"
                                                    value={formacao}
                                                    onChangeText={(text) => updateFormacao(index, text)}
                                                />
                                            </View>
                                            {index > 0 && (
                                                <TouchableOpacity 
                                                    style={StylePerfilUser.deleteButton}
                                                    onPress={() => removeFormacao(index)}
                                                >
                                                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ff5252" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ))}
                                <TouchableOpacity 
                                    style={StylePerfilUser.addButton}
                                    onPress={addFormacao}
                                >
                                    <MaterialCommunityIcons name="plus" size={24} color="#000000" />
                                    <Text style={StylePerfilUser.addButtonText}>Adicionar Formação</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={StylePerfilUser.sectionContainer}>
                                <Text style={StylePerfilUser.sectionTitle}>Experiências</Text>
                                {editData.experiencias.map((experiencia, index) => (
                                    <View key={index} style={StylePerfilUser.inputContainer}>
                                        <Text style={StylePerfilUser.inputLabel}>
                                            {index === 0 ? 'Experiência Principal' : `Experiência ${index + 1}`}
                                        </Text>
                                        <View style={StylePerfilUser.inputRow}>
                                            <View style={[
                                                StylePerfilUser.inputWithDelete,
                                                index === 0 && { marginRight: 0 }
                                            ]}>
                                                <TextInput
                                                    style={StylePerfilUser.input}
                                                    placeholder="Descreva sua experiência"
                                                    value={experiencia}
                                                    onChangeText={(text) => updateExperiencia(index, text)}
                                                    multiline
                                                />
                                            </View>
                                            {index > 0 && (
                                                <TouchableOpacity 
                                                    style={StylePerfilUser.deleteButton}
                                                    onPress={() => removeExperiencia(index)}
                                                >
                                                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ff5252" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                ))}
                                <TouchableOpacity 
                                    style={StylePerfilUser.addButton}
                                    onPress={addExperiencia}
                                >
                                    <MaterialCommunityIcons name="plus" size={24} color="#000000" />
                                    <Text style={StylePerfilUser.addButtonText}>Adicionar Experiência</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={StylePerfilUser.sectionContainer}>
                                <Text style={StylePerfilUser.sectionTitle}>Alterar Senha</Text>
                                
                                <Text style={StylePerfilUser.inputLabel}>Senha Atual</Text>
                                <TextInput
                                    style={StylePerfilUser.input}
                                    placeholder="Digite sua senha atual"
                                    value={editData.senha_atual}
                                    onChangeText={(text) => setEditData({...editData, senha_atual: text})}
                                    secureTextEntry
                                />

                                <Text style={StylePerfilUser.inputLabel}>Nova Senha</Text>
                                <TextInput
                                    style={StylePerfilUser.input}
                                    placeholder="Digite sua nova senha"
                                    value={editData.nova_senha}
                                    onChangeText={(text) => setEditData({...editData, nova_senha: text})}
                                    secureTextEntry
                                />

                                <Text style={StylePerfilUser.inputLabel}>Confirmar Nova Senha</Text>
                                <TextInput
                                    style={StylePerfilUser.input}
                                    placeholder="Confirme sua nova senha"
                                    value={editData.confirmar_senha}
                                    onChangeText={(text) => setEditData({...editData, confirmar_senha: text})}
                                    secureTextEntry
                                />

                                <TouchableOpacity 
                                    style={[StylePerfilUser.modalButton, StylePerfilUser.saveButton, { marginTop: 10 }]}
                                    onPress={handleUpdatePassword}
                                >
                                    <Text style={StylePerfilUser.modalButtonText}>Alterar Senha</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={StylePerfilUser.modalButtons}>
                            <TouchableOpacity 
                                style={[StylePerfilUser.modalButton, StylePerfilUser.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={StylePerfilUser.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[StylePerfilUser.modalButton, StylePerfilUser.saveButton]}
                                onPress={handleSave}
                            >
                                <Text style={StylePerfilUser.modalButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
} 