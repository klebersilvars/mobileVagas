import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { auth, db } from '../../firebase/firebase';
import { uploadImage } from '../../firebase/cloudinary';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { StylePerfilUser } from './StylePerfilUser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilUser() {
    const [userData, setUserData] = useState<any>(null);
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
        profileImage: ''
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
                                profileImage: data.profileImage || ''
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
                        await updateDoc(doc(db, 'user_candidato', userDoc.id), editData);
                        setUserData((prev: any) => ({ ...prev, ...editData }));
                        setModalVisible(false);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
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

    const pickImage = async () => {
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
    };

    const uploadImageToCloudinary = async (uri: string) => {
        try {
            const userDataString = await AsyncStorage.getItem('userCandidatoLogado');
            if (!userDataString) return;

            const userData = JSON.parse(userDataString);
            const userEmail = userData.email;

            if (!userEmail) return;

            const imageUrl = await uploadImage(uri);

            const usersRef = collection(db, 'user_candidato');
            const q = query(usersRef, where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                await updateDoc(doc(db, 'user_candidato', userDoc.id), {
                    profileImage: imageUrl
                });
                setUserData((prev: any) => ({ ...prev, profileImage: imageUrl }));
                setEditData((prev) => ({ ...prev, profileImage: imageUrl }));
            }
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            Alert.alert('Erro', 'Não foi possível fazer upload da imagem. Verifique sua conexão com a internet.');
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