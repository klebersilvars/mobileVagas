import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text, FlatList, TextInput } from 'react-native';
import { db } from '../../../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import moment from 'moment';  // Importando a biblioteca Moment.js

type Vaga = {
    id: string;
    publicacao_text: string;
    data: string;
    hora: string;
    quem_publicou: { email: string; nome?: string };
};

export default function InterfacePublicacao() {
    const [vagasPublicadas, setVagasPublicadas] = useState<Vaga[]>([]);

    // Função para formatar a data usando o Moment.js
    const formatarData = (data: string) => {
        return moment(data).format('DD/MM/YYYY'); // Formato brasileiro
    };

    useEffect(() => {
        const refVagas = collection(db, 'publicar_vaga_empresa');

        const unsubscribe = onSnapshot(refVagas, (snapshot) => {
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

    return (
        <SafeAreaView style={styles.container}>
            {vagasPublicadas.length === 0 ? (
                <Text style={styles.emptyText}>Nenhuma vaga publicada</Text>
            ) : (
                <FlatList
                    data={vagasPublicadas}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        console.log("Renderizando item:", item); // Log de depuração
                        return (
                            <View style={styles.containerPubliBox}>
                                <View style={styles.container_nome_data}>
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {item.quem_publicou.nome || item.quem_publicou.email}
                                    </Text>
                                    <View style={styles.data_Hora}>
                                        <Text style={{ fontWeight: 'bold' }}>{item.data}</Text>
                                        <Text style={{ fontWeight: 'bold' }}>{item.hora}</Text>
                                    </View>
                                </View>

                                <View style={styles.publicacao_Text}>
                                    <TextInput
                                        multiline
                                        numberOfLines={5}
                                        value={item.publicacao_text}
                                        editable={false}
                                    />
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        display: 'flex',
        padding: 10,
        
    },
    containerPubliBox: {
        display: 'flex',
        borderWidth: 1,
        width: '100%',
        maxHeight: 200,
        marginTop: 10,
    },
    container_nome_data: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    },
    data_Hora: {
        display: 'flex',
        marginRight: '10%',
        gap: 5,
    },
    publicacao_Text: {
        width: '100%',
        height: '100%',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#777',
    }
})