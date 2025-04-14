import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { auth, db } from '../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { StylePerfilUser } from './StylePerfilUser';

export default function PerfilUser() {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

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
                <Image
                    source={userData?.fotoPerfil ? { uri: userData.fotoPerfil } : require('../../../assets/homem.png')}
                    style={StylePerfilUser.profileImage}
                />
                <Text style={StylePerfilUser.name}>{userData?.nome || 'Usuário'}</Text>
                <Text style={StylePerfilUser.email}>{userData?.email || ''}</Text>
            </View>

            <View style={StylePerfilUser.section}>
                <Text style={StylePerfilUser.sectionTitle}>Informações Pessoais</Text>
                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>Telefone:</Text>
                    <Text style={StylePerfilUser.infoValue}>{userData?.telefone || 'Não informado'}</Text>
                </View>
                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>Cidade:</Text>
                    <Text style={StylePerfilUser.infoValue}>{userData?.cidade || 'Não informada'}</Text>
                </View>
            </View>

            <View style={StylePerfilUser.section}>
                <Text style={StylePerfilUser.sectionTitle}>Currículo</Text>
                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>Formação:</Text>
                    <Text style={StylePerfilUser.infoValue}>{userData?.formacao || 'Não informada'}</Text>
                </View>
                <View style={StylePerfilUser.infoItem}>
                    <Text style={StylePerfilUser.infoLabel}>Experiência:</Text>
                    <Text style={StylePerfilUser.infoValue}>{userData?.experiencia || 'Não informada'}</Text>
                </View>
            </View>

            <TouchableOpacity style={StylePerfilUser.editButton}>
                <Text style={StylePerfilUser.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
        </ScrollView>
    );
} 