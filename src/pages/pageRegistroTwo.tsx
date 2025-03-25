import React, { useState, useEffect } from 'react';
import { 
  View, 
  StatusBar, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import { ButtonStepOne, ButtonStepOneDisabled } from '../components/ButtonStepOne';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegistroUserTwo } from '../interfaces/storageRegistroInterface';

const { width, height } = Dimensions.get('window');

type NavigationStep = StackNavigationProp<RootStackParamList>;

interface Endereco {
    cep: string;
    logradouro: string;
    bairro: string;
    complemento: string;
    estado: string;
    uf: string;
}

interface ButtonBuscarCep {
    onPress: () => void;
}

export default function PageRegistroTwo() {
    //useState
    const [SwitchPassowrd, setSwitchPassword] = useState<boolean>(false);
    const [cepRegistro, setCepRegistro] = useState<string>('');
    const [registroCepUser, setRegistroCepUser] = useState<Endereco | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Estado para carregar a requisição
    const [error, setError] = useState<string | null>(null); // Estado para mostrar mensagens de erro
    const navigation = useNavigation<NavigationStep>();
    const [verificarCepCandidato, setVerificarCepCandidato] = useState<boolean>(false)
    const [DadosUserTwo, setDadosUserTwo] = useState<RegistroUserTwo | null>(null)

    //validação para verificar se o CEP está VAZIO
    const validacaoInputsCandidatoTwo = () => {
        if (!cepRegistro) {
            setVerificarCepCandidato(false)
        } else {
            setVerificarCepCandidato(true)
        }
    }

    useEffect(() => {
        validacaoInputsCandidatoTwo()
    }, [cepRegistro])

    // Função para buscar o CEP
    const buscarCep = async () => {
        setLoading(true); // Começa o carregamento
        setError(null); // Limpa mensagens de erro

        try {
            // Fazendo a requisição para a API ViaCEP
            const response = await axios.get(`https://viacep.com.br/ws/${cepRegistro}/json/`);
            if (response.data.erro) {
                alert('CEP não encontrado!');
            } else {
                setRegistroCepUser(response.data);
                Alert.alert('Sucesso', 'Cep encontrado com sucesso')
                setLoading(false)
            }
        } catch (error) {
            Alert.alert('Erro', 'CEP inválido!')
            setError('Erro ao buscar o CEP. Tente novamente mais tarde!');
        } finally {
            setLoading(false)
        }
    };

    function irPageStepThree() {
        navigation.navigate('PageRegistroThree');
    }

    useEffect(() => {
        const novoUsuarioTwo: RegistroUserTwo = {
            cep: cepRegistro,
            logradouro: registroCepUser?.logradouro,
            bairro: registroCepUser?.bairro,
            estado: registroCepUser?.estado,
            uf: registroCepUser?.uf,
            complemento: registroCepUser?.complemento,
        };

        setDadosUserTwo(novoUsuarioTwo) //vai guardar os dados aqui
    }, [cepRegistro, registroCepUser?.logradouro, registroCepUser?.bairro, registroCepUser?.estado, registroCepUser?.uf, registroCepUser?.complemento])

    const dadosUserTwo = async () => {
        try {
            const valueUserTwo = await AsyncStorage.setItem('registroUserTwo', JSON.stringify(DadosUserTwo))
        } catch (e) {
            console.log(e)
        }
    }

    const salvarUserTwoStepPage = async () => {
        await dadosUserTwo();  // Aguarda salvar os dados
        irPageStepThree();  // Só então vai para a próxima página
    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            
            {/* Header with Logo */}
            <View style={styles.header}>
                <Text allowFontScaling={false} style={styles.headerLogo}>NOVOS TALENTOS</Text>
            </View>
            
            {/* Main Content */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.keyboardAvoidView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={true}
                    bounces={true}
                >
                    {/* Form Content */}
                    <View style={styles.formCard}>
                        <Text allowFontScaling={false} style={styles.formTitle}>
                            Preciso de mais informações...
                        </Text>
                        
                        <Text allowFontScaling={false} style={styles.formSubtitle}>
                            Sua plataforma para iniciar sua jornada profissional com facilidade.
                        </Text>
                        
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text allowFontScaling={false} style={styles.inputLabel}>CEP</Text>
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '99999-999'
                                    }}
                                    style={styles.input}
                                    placeholder="Digite seu CEP"
                                    placeholderTextColor="#A0AEC0"
                                    keyboardType='numeric'
                                    onChangeText={(value: string) => setCepRegistro(value)}
                                />
                                
                                <View style={styles.buttonContainer}>
                                    {verificarCepCandidato ? (
                                        <TouchableOpacity 
                                            onPress={buscarCep} 
                                            style={styles.searchButton}
                                        >
                                            {loading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <Text allowFontScaling={false} style={styles.searchButtonText}>
                                                    Buscar
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity 
                                            style={styles.searchButtonDisabled}
                                            disabled={true}
                                        >
                                            {loading ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                            ) : (
                                                <Text allowFontScaling={false} style={styles.searchButtonText}>
                                                    Buscar
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text allowFontScaling={false} style={styles.inputLabel}>Logradouro</Text>
                                <TextInput
                                    style={styles.inputDisabled}
                                    placeholder="Logradouro"
                                    placeholderTextColor="#A0AEC0"
                                    value={registroCepUser?.logradouro || ''}
                                    keyboardType="default"
                                    editable={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text allowFontScaling={false} style={styles.inputLabel}>Bairro</Text>
                                <TextInput
                                    style={styles.inputDisabled}
                                    placeholder="Bairro"
                                    placeholderTextColor="#A0AEC0"
                                    keyboardType="default"
                                    value={registroCepUser?.bairro || ''}
                                    editable={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text allowFontScaling={false} style={styles.inputLabel}>Complemento</Text>
                                <TextInput
                                    style={styles.inputDisabled}
                                    placeholder="Complemento"
                                    placeholderTextColor="#A0AEC0"
                                    keyboardType="default"
                                    value={registroCepUser?.complemento || ''}
                                    editable={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text allowFontScaling={false} style={styles.inputLabel}>Estado</Text>
                                <TextInput
                                    style={styles.inputDisabled}
                                    placeholder="Estado"
                                    placeholderTextColor="#A0AEC0"
                                    keyboardType="default"
                                    value={registroCepUser?.estado || ''}
                                    editable={false}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text allowFontScaling={false} style={styles.inputLabel}>UF</Text>
                                <TextInput
                                    style={styles.inputDisabled}
                                    placeholder="UF"
                                    placeholderTextColor="#A0AEC0"
                                    keyboardType="default"
                                    value={registroCepUser?.uf || ''}
                                    editable={false}
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                {verificarCepCandidato && registroCepUser ? (
                                    <TouchableOpacity 
                                        style={styles.primaryButton}
                                        onPress={salvarUserTwoStepPage}
                                    >
                                        <Text style={styles.primaryButtonText}>Continuar</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity 
                                        style={styles.disabledButton}
                                        disabled={true}
                                    >
                                        <Text style={styles.disabledButtonText}>Continuar</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            
                            {/* Extra padding view to ensure scrolling works */}
                            <View style={styles.extraPadding} />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },
    keyboardAvoidView: {
        flex: 1,
    },
    header: {
        backgroundColor: 'white',
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    headerLogo: {
        color: 'black',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 16,
        paddingBottom: 120, // Extra padding at the bottom to ensure scrolling works
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2D3748',
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#2D3748',
    },
    inputDisabled: {
        backgroundColor: '#EDF2F7',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#718096',
    },
    buttonContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    searchButton: {
        backgroundColor: 'black',
        borderRadius: 8,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    searchButtonDisabled: {
        backgroundColor: '#CBD5E0',
        borderRadius: 8,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: 'black',
        borderRadius: 8,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#CBD5E0',
        borderRadius: 8,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButtonText: {
        color: '#718096',
        fontSize: 16,
        fontWeight: '600',
    },
    errorMessage: {
        color: '#E53E3E',
        fontSize: 14,
        marginTop: 8,
    },
    extraPadding: {
        height: 50, // Extra space at the bottom of the form
    }
});