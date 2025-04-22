import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseStyles } from '@/styles/baseStyles';
import { getResponsiveFontSize, getResponsivePadding, getResponsiveMargin, getResponsiveBorderRadius } from '@/utils/responsive';

const styles = StyleSheet.create({
    container: {
        ...baseStyles.container,
    },
    safeArea: {
        ...baseStyles.safeArea,
    },
    contentContainer: {
        ...baseStyles.contentContainer,
    },
    header: {
        ...baseStyles.header,
    },
    headerTitle: {
        ...baseStyles.headerTitle,
    },
    headerSubtitle: {
        ...baseStyles.headerSubtitle,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: getResponsivePadding(16),
    },
    searchInput: {
        ...baseStyles.input,
        flex: 1,
        marginRight: getResponsivePadding(8),
    },
    vagaCard: {
        ...baseStyles.card,
    },
    vagaHeader: {
        ...baseStyles.cardHeader,
    },
    vagaTitle: {
        ...baseStyles.title,
        flex: 1,
    },
    vagaSubtitle: {
        ...baseStyles.subtitle,
    },
    vagaText: {
        ...baseStyles.text,
    },
    vagaSmallText: {
        ...baseStyles.smallText,
    },
    button: {
        ...baseStyles.button,
    },
    buttonText: {
        ...baseStyles.buttonText,
    },
    buttonDisabled: {
        ...baseStyles.buttonDisabled,
    },
    loadingOverlay: {
        ...baseStyles.loadingOverlay,
    },
    loadingText: {
        ...baseStyles.loadingText,
    },
    emptyContainer: {
        ...baseStyles.emptyContainer,
    },
    emptyTitle: {
        ...baseStyles.emptyTitle,
    },
    emptySubtitle: {
        ...baseStyles.emptySubtitle,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: getResponsivePadding(8),
    },
    editButton: {
        ...baseStyles.button,
        backgroundColor: '#4A80F0',
        flex: 1,
        marginRight: getResponsivePadding(8),
    },
    deleteButton: {
        ...baseStyles.button,
        backgroundColor: '#FF4444',
        flex: 1,
    },
});

interface Vaga {
    id: string;
    titulo: string;
    descricao: string;
    requisitos: string;
    salario: string;
    localizacao: string;
    data: string;
}

const VagasPublicadas = () => {
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [searchText, setSearchText] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchVagas = async () => {
        try {
            const q = query(collection(db, 'vagas'));
            const querySnapshot = await getDocs(q);
            const vagasData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                titulo: doc.data().titulo || '',
                descricao: doc.data().descricao || '',
                requisitos: doc.data().requisitos || '',
                salario: doc.data().salario || '',
                localizacao: doc.data().localizacao || '',
                data: doc.data().data || ''
            })) as Vaga[];
            setVagas(vagasData);
        } catch (error) {
            console.error('Erro ao buscar vagas:', error);
            Alert.alert('Erro', 'Não foi possível carregar as vagas');
        } finally {
            setLoading(false);
        }
    };

    // ... rest of the existing code ... 
} 