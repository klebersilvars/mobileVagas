import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet
} from 'react-native';
import PublicarVagaStyle from './publicarVagaStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../../../firebase/firebase';
import { collection, addDoc, updateDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import CustomAlertGreen from '../../../components/CustomAlertGreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    PerfilEmpresa: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PublicarVaga() {
    const data = moment();
    const dataFormatted = data.format('YYYY-MM-DD');
    const horaFormatted = data.format('HH:mm:ss');

    const [userLogadoState, setUserLogadoState] = useState<string>('');
    const [publicacao_texto, setPublicacao_texto] = useState<string>('');
    const [tituloVaga, setTituloVaga] = useState<string>('');
    const [salarioVaga, setSalarioVaga] = useState<string>('');
    const [requisitosVaga, setRequisitosVaga] = useState<string>('');
    const [areaLinkVaga, setAreaLinkVaga] = useState<string>('');
    const [areaContatoVaga, setAreaContatoVaga] = useState<string>('');
    const [nomeEmpresa, setNomeEmpresa] = useState<string>('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [isPremium, setIsPremium] = useState<boolean>(false);
    const [publicacaoRestante, setPublicacaoRestante] = useState<number>(0);
    const [carregandoEmpresa, setCarregandoEmpresa] = useState<boolean>(true);

    const navigation = useNavigation<NavigationProp>();

    function showAlert(message: string) {
        setAlertMessage(message);
        setAlertVisible(true);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userEmpresaLogado = await AsyncStorage.getItem('userEmpresaLogado');
                if (userEmpresaLogado !== null) {
                    const userEmpresa = JSON.parse(userEmpresaLogado);
                    if (userEmpresa?.email) {
                        setUserLogadoState(userEmpresa.email);
                        await queryBuscarNomeEmpresa(userEmpresa.email);
                        await buscarStatusPremiumELimite(userEmpresa.email);
                    }
                }
            } catch (error) {
                console.error('Erro ao recuperar os dados do AsyncStorage:', error);
            }
        };
        fetchData();
    }, []);

    async function queryBuscarNomeEmpresa(email: string) {
        try {
            const empresaQuery = query(collection(db, 'user_empresa'), where('email_empresa', '==', email));
            const querySnapshot = await getDocs(empresaQuery);

            if (!querySnapshot.empty) {
                const empresaData = querySnapshot.docs[0].data();
                if (empresaData?.nome_empresa) {
                    setNomeEmpresa(empresaData.nome_empresa);
                }
            } else {
                console.log('Nenhum nome de empresa encontrado para este email.');
            }
        } catch (error) {
            console.error('Erro ao buscar nome da empresa:', error);
        }
    }

    async function buscarStatusPremiumELimite(email: string) {
        try {
            const empresaQuery = query(collection(db, 'user_empresa'), where('email_empresa', '==', email));
            const querySnapshot = await getDocs(empresaQuery);
            if (!querySnapshot.empty) {
                const empresaData = querySnapshot.docs[0].data();
                setIsPremium(!!empresaData.premium);
                setPublicacaoRestante(Number(empresaData.publicacao_restante ?? 0));
            }
        } catch (error) {
            console.error('Erro ao buscar status premium e limite:', error);
        } finally {
            setCarregandoEmpresa(false);
        }
    }

    async function publicarVaga() {
        if (!isPremium && publicacaoRestante <= 0) {
            Alert.alert(
                'Limite de vagas atingido',
                'Você atingiu o limite de 2 vagas mensais. Torne-se premium para publicar mais vagas!',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    },
                    {
                        text: 'Tornar Premium',
                        onPress: () => {
                            navigation.navigate('PerfilEmpresa');
                        }
                    }
                ]
            );
            return;
        }

        try {
            if (!nomeEmpresa) {
                Alert.alert('Erro', 'O nome da empresa não foi encontrado. Tente novamente.');
                return;
            }

            if (!tituloVaga || !publicacao_texto || !salarioVaga || !areaContatoVaga) {
                Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            const publicationRef = await addDoc(collection(db, 'publicar_vaga_empresa'), {
                publicacao_text: publicacao_texto,
                data: dataFormatted,
                hora: horaFormatted,
                quem_publicou: userLogadoState,
                nome_empresa: nomeEmpresa,
                requisito_vaga: requisitosVaga,
                salarioVaga: salarioVaga,
                titulo_vaga: tituloVaga,
                area_contato_vaga: areaContatoVaga
            });
            const publicationId = publicationRef.id;
            await updateDoc(publicationRef, { id_doc: publicationId });

            if (!isPremium) {
                const empresaQuery = query(collection(db, 'user_empresa'), where('email_empresa', '==', userLogadoState));
                const querySnapshot = await getDocs(empresaQuery);
                if (!querySnapshot.empty) {
                    const empresaDocRef = querySnapshot.docs[0].ref;
                    const novoLimite = publicacaoRestante - 1;
                    
                    if (novoLimite === 0) {
                        await updateDoc(empresaDocRef, { 
                            publicacao_restante: novoLimite,
                            data_fim_normal: serverTimestamp()
                        });
                    } else {
                        await updateDoc(empresaDocRef, { 
                            publicacao_restante: novoLimite 
                        });
                    }
                    
                    setPublicacaoRestante(novoLimite);
                }
            }

            showAlert('Vaga publicada com sucesso!');
            setPublicacao_texto('');
            setTituloVaga('');
            setSalarioVaga('');
            setRequisitosVaga('');
            setAreaContatoVaga('');
            setAreaLinkVaga('');
        } catch (error) {
            console.error("Erro ao publicar a vaga:", error);
            Alert.alert('Erro', 'Ocorreu um erro ao publicar a vaga. Tente novamente.');
        }
    }
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
        >
            <CustomAlertGreen 
                visible={alertVisible} 
                message={alertMessage} 
                onClose={() => setAlertVisible(false)} 
            />
            <SafeAreaView style={PublicarVagaStyle.container}>
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                
                {/* Header */}
                <View style={PublicarVagaStyle.header}>
                    <Text style={PublicarVagaStyle.headerTitle}>NovosTalentos</Text>
                    <TouchableOpacity 
                        onPress={publicarVaga} 
                        style={[
                            PublicarVagaStyle.publishButton, 
                            (!isPremium && publicacaoRestante <= 0) && { backgroundColor: '#ccc' }
                        ]} 
                        disabled={(!isPremium && publicacaoRestante <= 0) || carregandoEmpresa}
                    >
                        <MaterialCommunityIcons name="send" size={18} color="white" />
                        <Text style={PublicarVagaStyle.publishButtonText}>Publicar</Text>
                    </TouchableOpacity>
                </View>
                
                <ScrollView style={PublicarVagaStyle.scrollView}>
                    <View style={PublicarVagaStyle.formCard}>
                        {/* Job Title Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Título da Vaga *</Text>
                            <TextInput
                                style={PublicarVagaStyle.input}
                                placeholder="Ex: Desenvolvedor Front-end React"
                                placeholderTextColor="#A0AEC0"
                                value={tituloVaga}
                                onChangeText={setTituloVaga}

                            />
                        </View>
                        
                        {/* Job Description Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Descrição da Vaga *</Text>
                            <TextInput
                                style={PublicarVagaStyle.textArea}
                                placeholder="Descreva detalhadamente a vaga, responsabilidades, benefícios e outras informações relevantes..."
                                placeholderTextColor="#A0AEC0"
                                multiline
                                numberOfLines={8}
                                textAlignVertical="top"
                                value={publicacao_texto}
                                onChangeText={setPublicacao_texto}
                            />
                        </View>
                        
                        {/* Salary Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Salário da Vaga *</Text>
                            <TextInput
                                style={PublicarVagaStyle.input}
                                placeholder="Ex: R$ 3.500,00 ou A combinar"
                                placeholderTextColor="#A0AEC0"
                                value={salarioVaga}
                                onChangeText={setSalarioVaga}
                            />
                        </View>

                        {/* Link Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Área dos links da vaga (opcional)</Text>
                            <TextInput
                                style={PublicarVagaStyle.input}
                                placeholder="https://google.com.br"
                                placeholderTextColor="#A0AEC0"
                                value={areaLinkVaga}
                                onChangeText={setAreaLinkVaga}
                            />
                        </View>

                        {/* Link Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Área de contato</Text>
                            <TextInput
                                style={PublicarVagaStyle.textArea}
                                placeholder="Caso não tenha links, coloque obrigatoriamente uma forma do usuário entrar em contato."
                                placeholderTextColor="#A0AEC0"
                                value={areaContatoVaga}
                                textAlignVertical="top"
                                multiline
                                onChangeText={setAreaContatoVaga}
                            />
                        </View>
                        
                        {/* Requirements Input */}
                        <View style={PublicarVagaStyle.inputGroup}>
                            <Text style={PublicarVagaStyle.inputLabel}>Requisitos da Vaga</Text>
                            <TextInput
                                style={PublicarVagaStyle.textArea}
                                placeholder="Ex: JavaScript, React, 2 anos de experiência, inglês intermediário..."
                                placeholderTextColor="#A0AEC0"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                value={requisitosVaga}
                                onChangeText={setRequisitosVaga}
                            />
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.publicacoesRestantesContainer}>
                    <Text style={styles.publicacoesRestantesText}>
                        Vagas restantes este mês: <Text style={styles.publicacoesCount}>{publicacaoRestante}</Text>
                    </Text>
                    {!isPremium && publicacaoRestante <= 0 && (
                        <TouchableOpacity 
                            style={styles.upgradeButton}
                            onPress={() => navigation.navigate('PerfilEmpresa')}
                        >
                            <Text style={styles.upgradeButtonText}>Tornar Premium</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    publicacoesRestantesContainer: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        alignItems: 'center',
    },
    publicacoesRestantesText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    publicacoesCount: {
        fontWeight: 'bold',
        color: '#000',
    },
    upgradeButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    upgradeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
});