import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text, FlatList } from 'react-native';
import { db } from '../../../firebase/firebase';
import { where, query, collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Vaga = {
    id: string;
    publicacao_text: string; // Adicione outros campos conforme necessário
};

export default function VagasPublicadas() {
    const [userEmpresaLogadoState, setUserEmpresaLogadoState] = useState<string>('');
    const [vagasPublicadas, setVagasPublicadas] = useState<Vaga[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            const userEmpresaLogado = await AsyncStorage.getItem('userEmpresaLogado');

            if (userEmpresaLogado !== null) {
                const userEmpresa = JSON.parse(userEmpresaLogado);
                console.log('Usuário logado:', userEmpresa);
                setUserEmpresaLogadoState(userEmpresa.email);

                // Chamando a função para buscar as vagas publicadas
                buscarVagas(userEmpresa.email);
            } else {
                console.log('Não há dados no AsyncStorage para "userEmpresaLogado"');
            }
        };

        fetchData();
    }, []);

    const buscarVagas = async (emailEmpresa: string) => {
        try {
            const vagasPublicadasRef = collection(db, 'publicar_vaga_empresa');
            const q = query(vagasPublicadasRef, where('quem_publicou.email', '==', emailEmpresa));
            const querySnapshot = await getDocs(q);

            const vagas = querySnapshot.docs.map(doc => ({
                id: doc.id,
                publicacao_text: doc.data().publicacao_text, // Garantindo que a propriedade seja incluída
            }));
            

            setVagasPublicadas(vagas);
        } catch (error) {
            console.error('Erro ao buscar vagas:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Novos Talentos</Text>
            <FlatList
                data={vagasPublicadas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.vagaItem}>
                        <Text style={styles.vagaText}>{item.publicacao_text}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    vagaItem: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        height: 200,
        maxHeight: 350,
    },
    vagaText: {
        fontSize: 16,
    },
});
