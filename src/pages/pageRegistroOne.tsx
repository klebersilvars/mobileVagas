import React, { useState, useEffect } from 'react';
import { 
  View, 
  StatusBar, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  ScrollView, 
  Alert, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  PixelRatio
} from 'react-native';
import { ButtonStepOne } from '../components/ButtonStepOne';
import { ButtonStepOneDisabled } from '../components/ButtonStepOne';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RegistroUserOne, RegistroEmpresaFirebase} from '../interfaces/storageRegistroInterface';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase/firebase';
import { setDoc, doc } from 'firebase/firestore';

const { width, height } = Dimensions.get('window');

// Responsive calculation functions
const scale = Math.min(width, height) / 375; // Base scale on the smaller dimension
const verticalScale = height / 812; // Based on iPhone X height
const horizontalScale = width / 375; // Based on iPhone X width

const normalize = (size:number, factor = 0.5) => {
  return size + (scale - 1) * size * factor;
};

// Convert percentage to pixels
const wp = (percentage: number) => {
  const value = (percentage * width) / 100;
  return Math.round(value);
};

const hp = (percentage: number) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
};

type NavigationStep = StackNavigationProp<RootStackParamList>;

export default function PageRegistroOne() {
    // useState
    const [nomeCompletoRegistro, setNomeCompletoRegistro] = useState<string>('');
    const [emailRegistro, setEmailRegitro] = useState<string>('');
    const [dataNascimentoRegistro, setDataNascimentoRegistro] = useState<string>('');
    const [anoNascimento, setAnoNascimento] = useState<string>('');
    const [anoAtual, setAnoAtual] = useState<number>(0);
    const [maiorIdade, setMaiorIdade] = useState<boolean>(false);
    const [mensagemIdade, setMensagemIdade] = useState<string>(''); // Estado para a mensagem de idade
    const [typeConta, setTypeConta] = useState<string>('candidato')
    const [dataCriacaoEmpresa, setDataCriacaoEmpresa] = useState<string>('');
    const [nomeEmpresa, setNomeEmpresa] = useState<string>('');
    const [emailEmpresa, setEmailEmpresa] = useState<string>('');
    const [cnpjEmpresa, setCnpjEmpresa] = useState<string>('');
    const [passwordEmpresa, setPasswordEmpresa] = useState<string>('')
    const navigation = useNavigation<NavigationStep>();
    const [camposCandidatos, setCamposCandidatos] = useState<boolean>(false)
    const [camposEmpresa, setCamposEmpresa] = useState<boolean>(false);
    const [dadosUserInterface, setDadosUserInterface] = useState<RegistroUserOne | null>(null)
    const [orientacaoSexual, setOrientacaoSexual] = useState<string>('');

    useEffect(() => {
        const date = new Date();
        setAnoAtual(date.getFullYear());
    }, []);

    // Função para verificar a idade e habilitar/desabilitar o botão
    const verIdade = (anoNascimento: string) => {
        const anoNascimentoNum = parseInt(anoNascimento);
        const idade = anoAtual - anoNascimentoNum;

        if (anoNascimentoNum && idade >= 18 && idade <= 25) {
            setMaiorIdade(true); // Habilita o botão
            setMensagemIdade(''); // Limpa qualquer mensagem caso a idade esteja dentro do permitido
        } else if (idade > 25) {
            setMaiorIdade(false); // Desabilita o botão
            setMensagemIdade('Você tem mais de 25 anos, não será possível prosseguir com a criação da conta.'); // Mensagem para maior de 25 anos
        } else {
            setMaiorIdade(false); // Desabilita o botão
            setMensagemIdade('Você é menor de idade, não será possível prosseguir com a criação da conta.'); // Mensagem para menor de idade
        }
    };

    // Função para lidar com a mudança da data de nascimento
    const handleDateChange = (text: string) => {
        setDataNascimentoRegistro(text);
        if (text.length === 10) {
            const ano = text.slice(6, 10);  // Extrai o ano da data
            setAnoNascimento(ano);  // Armazena o ano de nascimento
            verIdade(ano);  // Verifica a idade
        } else if (text.length === 0) {
            setMaiorIdade(false);  // Se a data for apagada, desabilita o botão
            setMensagemIdade('');  // Limpa a mensagem
        }
    };

    function irPageStepTwo(): void {
        navigation.navigate('PageRegistroTwo');
    }

    //mascara para o CNPJ
    const handleCnpjChange = (text: string) => {
        // Remove qualquer caractere que não seja número
        const numericText = text.replace(/[^0-9]/g, '');

        // Aplica a máscara de CNPJ
        let formattedText = numericText;
        if (numericText.length > 2) {
            formattedText = `${numericText.slice(0, 2)}.${numericText.slice(2)}`;
        }
        if (numericText.length > 5) {
            formattedText = `${numericText.slice(0, 2)}.${numericText.slice(2, 5)}.${numericText.slice(5)}`;
        }
        if (numericText.length > 8) {
            formattedText = `${numericText.slice(0, 2)}.${numericText.slice(2, 5)}.${numericText.slice(5, 8)}/${numericText.slice(8)}`;
        }
        if (numericText.length > 12) {
            formattedText = `${numericText.slice(0, 2)}.${numericText.slice(2, 5)}.${numericText.slice(5, 8)}/${numericText.slice(8, 12)}-${numericText.slice(12, 14)}`;
        }

        setCnpjEmpresa(formattedText);
    };

    //função que faça a validação dos inputs dos candidatos
    const validacaoCamposCandidatos = () => {
        if (nomeCompletoRegistro == '' && emailRegistro == '' && dataNascimentoRegistro == '') {
            setCamposCandidatos(false)
        }
    }

    const validacaoCamposEmpresas = () => {
        if (!nomeEmpresa || !emailEmpresa || !cnpjEmpresa || !passwordEmpresa) {
            setCamposEmpresa(false); // Desabilita botão se qualquer campo estiver vazio
        } else {
            setCamposEmpresa(true); // Habilita botão quando todos os campos estiverem preenchidos
        }
    };
    
    useEffect(() => {
        validacaoCamposEmpresas(); // Chama validação sempre que os valores mudarem
    }, [nomeEmpresa, emailEmpresa, cnpjEmpresa, passwordEmpresa]);

    useEffect(() => {
        const novoUsuario: RegistroUserOne = {
            nome_completo: nomeCompletoRegistro,
            email: emailRegistro,
            data_nascimento: dataNascimentoRegistro,
            type_conta: typeConta,
            orientacao_sexual: orientacaoSexual
        };

        setDadosUserInterface(novoUsuario)
    }, [nomeCompletoRegistro, emailRegistro, dataNascimentoRegistro, orientacaoSexual])

    const dadosUserOne = async ()=> {
        try{
            const valueUserOne = await AsyncStorage.setItem('registroUserOne', JSON.stringify(dadosUserInterface))
        }catch(e) {
            console.log(e)
        }
    }

    const salvarUserOneStepPage = async () => {
        await dadosUserOne();  // Aguarda salvar os dados
        irPageStepTwo();  // Só então vai para a próxima página
    };

    //lógica abaixo feita para cadastrar empresa no authentication e no firestore
    async function criarUserEmpresa() {
        try{
            const empresaUser = await createUserWithEmailAndPassword(auth, emailEmpresa, passwordEmpresa)
            const uidEmpresa = empresaUser.user.uid

            //salvando os dados da empresa no firestore
            const empresaData:RegistroEmpresaFirebase = {
                nome_empresa: nomeEmpresa,
                email_empresa: emailEmpresa,
                cnpj_empresa: cnpjEmpresa,
                password_empresa: passwordEmpresa,
                type_conta: typeConta,
                cep: "",
                cidade: "",
                data_pagamento_premium: "",
                data_assinatura: null,
                data_renovacao: null,
                descricao: "",
                dias_restantes_premium: 0,
                endereco: "",
                estado: "",
                limite_publicacao_mensal: 2,
                linkedin: "",
                premium: false,
                profileImage: "",
                publicacao_restante: 2,
                ramo_atividade: "",
                site: "",
                telefone_empresa: ""
            }

            await setDoc(doc(db, 'user_empresa', uidEmpresa), empresaData)
            Alert.alert('Sucesso', 'Conta da empresa foi criada com sucesso!');

            setNomeEmpresa('');
            setEmailEmpresa('');
            setCnpjEmpresa('');
            setPasswordEmpresa('');

            navigation.navigate('PageHome');
        }catch (e){
            console.log(e)
        }
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.mainContainer}
            >
                <StatusBar backgroundColor="white" barStyle="dark-content" />
                
                {/* Header with Logo */}
                <View style={styles.header}>
                    <Text allowFontScaling={false} style={styles.headerLogo}>NOVOS TALENTOS</Text>
                </View>
                
                {/* Main Content */}
                <ScrollView 
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Account Type Selection Card */}
                    <View style={styles.accountTypeCard}>
                        <Text allowFontScaling={false} style={styles.accountTypeTitle}>
                            Escolha o tipo de conta
                        </Text>
                        
                        <View style={styles.accountTypeOptions}>
                            <TouchableOpacity 
                                style={[
                                    styles.accountTypeOption, 
                                    typeConta === 'candidato' && styles.accountTypeOptionSelected
                                ]}
                                onPress={() => setTypeConta('candidato')}
                            >
                                <Text 
                                    style={[
                                        styles.accountTypeOptionText,
                                        typeConta === 'candidato' && styles.accountTypeOptionTextSelected
                                    ]}
                                >
                                    Candidato
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[
                                    styles.accountTypeOption, 
                                    typeConta === 'empresa' && styles.accountTypeOptionSelected
                                ]}
                                onPress={() => setTypeConta('empresa')}
                            >
                                <Text 
                                    style={[
                                        styles.accountTypeOptionText,
                                        typeConta === 'empresa' && styles.accountTypeOptionTextSelected
                                    ]}
                                >
                                    Empresa
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    {/* Form Content */}
                    <View style={styles.formCard}>
                        <Text allowFontScaling={false} style={styles.formTitle}>
                            {typeConta === 'candidato' 
                                ? 'Crie sua conta de candidato' 
                                : 'Registre sua empresa'}
                        </Text>
                        
                        <Text allowFontScaling={false} style={styles.formSubtitle}>
                            {typeConta === 'candidato'
                                ? 'Registre-se na melhor plataforma de empregos para iniciantes!'
                                : 'Encontre os melhores talentos para sua empresa!'}
                        </Text>
                        
                        {typeConta === 'candidato' ? (
                            // Candidate Form
                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <Text allowFontScaling={false} style={styles.inputLabel}>Nome Completo</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Digite seu nome completo"
                                        placeholderTextColor="#A0AEC0"
                                        keyboardType="default"
                                        onChangeText={(value: string) => setNomeCompletoRegistro(value)}
                                    />
                                </View>
                                
                                <View style={styles.inputContainer}>
                                    <Text allowFontScaling={false} style={styles.inputLabel}>E-mail</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="seu.email@exemplo.com"
                                        placeholderTextColor="#A0AEC0"
                                        keyboardType='email-address'
                                        onChangeText={(value: string) => setEmailRegitro(value)}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text allowFontScaling={false} style={styles.inputLabel}>Data de nascimento</Text>
                                    <TextInputMask
                                        type={'custom'}
                                        options={{
                                            mask: '99/99/9999',
                                        }}
                                        value={dataNascimentoRegistro}
                                        onChangeText={handleDateChange}
                                        style={styles.input}
                                        placeholder="DD/MM/AAAA"
                                        placeholderTextColor="#A0AEC0"
                                        keyboardType='numeric'
                                    />
                                    {mensagemIdade ? (
                                        <Text allowFontScaling={false} style={styles.errorMessage}>
                                            {mensagemIdade}
                                        </Text>
                                    ) : null}
                                </View>

                                <View style={styles.orientacaoSexualContainer}>
                                    <Text allowFontScaling={false} style={styles.orientacaoSexualTitle}>
                                        Orientação Sexual
                                    </Text>
                                    
                                    <View style={styles.orientacaoSexualOptions}>
                                        {['heterossexual', 'homossexual', 'bissexual', 'outros'].map((option) => (
                                            <TouchableOpacity 
                                                key={option}
                                                style={[
                                                    styles.orientacaoSexualOption, 
                                                    orientacaoSexual === option && styles.orientacaoSexualOptionSelected
                                                ]}
                                                onPress={() => setOrientacaoSexual(option)}
                                            >
                                                <Text 
                                                    style={[
                                                        styles.orientacaoSexualOptionText,
                                                        orientacaoSexual === option && styles.orientacaoSexualOptionTextSelected
                                                    ]}
                                                >
                                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.buttonContainer}>
                                    {maiorIdade && !camposCandidatos && orientacaoSexual ? (
                                        <TouchableOpacity 
                                            style={styles.primaryButton}
                                            onPress={salvarUserOneStepPage}
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
                            </View>
                        ) : (
                            // Company Form
                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <Text allowFontScaling={false} style={styles.inputLabel}>Nome da empresa*</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nome da sua empresa"
                                        placeholderTextColor="#A0AEC0"
                                        keyboardType="default"
                                        onChangeText={(value: string) => setNomeEmpresa(value)}
                                    />
                                </View>
                                
                                <View style={styles.inputContainer}>
                                    <Text allowFontScaling={false} style={styles.inputLabel}>E-mail da empresa*</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="empresa@exemplo.com"
                                        placeholderTextColor="#A0AEC0"
                                        keyboardType='email-address'
                                        onChangeText={(value: string) => setEmailEmpresa(value)}
                                        autoCapitalize="none"
                                    />
                                </View>
                                
                                <View style={styles.inputContainer}>
                                    <Text allowFontScaling={false} style={styles.inputLabel}>CNPJ da empresa*</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="00.000.000/0000-00"
                                        placeholderTextColor="#A0AEC0"
                                        keyboardType='numeric'
                                        value={cnpjEmpresa}
                                        maxLength={18}
                                        onChangeText={handleCnpjChange}
                                    />
                                </View>
                                
                                <View style={styles.inputContainer}>
                                    <Text allowFontScaling={false} style={styles.inputLabel}>Senha*</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Crie uma senha segura"
                                        placeholderTextColor="#A0AEC0"
                                        keyboardType='default'
                                        onChangeText={(value: string) => setPasswordEmpresa(value)}
                                        secureTextEntry={true}
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.buttonContainer}>
                                    {camposEmpresa ? (
                                        <TouchableOpacity 
                                            style={styles.primaryButton}
                                            onPress={criarUserEmpresa}
                                        >
                                            <Text style={styles.primaryButtonText}>Criar Conta</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity 
                                            style={styles.disabledButton}
                                            disabled={true}
                                        >
                                            <Text style={styles.disabledButtonText}>Criar Conta</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F7FAFC',
    },
    header: {
        backgroundColor: 'white',
        paddingVertical: normalize(16, 0.3),
        paddingHorizontal: normalize(20, 0.3),
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    headerLogo: {
        color: 'black',
        fontSize: normalize(22),
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: wp(4),
        paddingBottom: hp(5),
    },
    accountTypeCard: {
        backgroundColor: 'white',
        borderRadius: normalize(12),
        padding: normalize(20, 0.3),
        marginTop: hp(3),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    accountTypeTitle: {
        fontSize: normalize(18),
        fontWeight: '600',
        color: '#2D3748',
        textAlign: 'center',
        marginBottom: normalize(16, 0.3),
    },
    accountTypeOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: normalize(8, 0.3),
    },
    accountTypeOption: {
        flex: 1,
        paddingVertical: normalize(12, 0.3),
        paddingHorizontal: normalize(16, 0.3),
        borderRadius: normalize(8),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginHorizontal: normalize(6, 0.3),
        alignItems: 'center',
    },
    accountTypeOptionSelected: {
        backgroundColor: '#EBF8FF',
        borderColor: '#3498DB',
    },
    accountTypeOptionText: {
        fontSize: normalize(16, 0.3),
        fontWeight: '500',
        color: '#718096',
    },
    accountTypeOptionTextSelected: {
        color: '#3498DB',
        fontWeight: '600',
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: normalize(12),
        padding: normalize(24, 0.3),
        marginTop: hp(3),
        marginBottom: hp(2),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    formTitle: {
        fontSize: normalize(22),
        fontWeight: 'bold',
        color: '#2D3748',
        textAlign: 'center',
    },
    formSubtitle: {
        fontSize: normalize(14, 0.3),
        color: '#718096',
        textAlign: 'center',
        marginTop: normalize(8, 0.3),
        marginBottom: normalize(24, 0.3),
        paddingHorizontal: wp(2),
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: normalize(20, 0.3),
    },
    inputLabel: {
        fontSize: normalize(14, 0.3),
        fontWeight: '600',
        color: '#4A5568',
        marginBottom: normalize(8, 0.3),
    },
    input: {
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: normalize(8),
        height: normalize(50, 0.3),
        paddingHorizontal: normalize(16, 0.3),
        fontSize: normalize(16, 0.3),
        color: '#2D3748',
    },
    errorMessage: {
        color: '#E53E3E',
        fontSize: normalize(14, 0.3),
        marginTop: normalize(8, 0.3),
    },
    buttonContainer: {
        marginTop: normalize(16, 0.3),
    },
    primaryButton: {
        backgroundColor: '#3498DB',
        borderRadius: normalize(8),
        height: normalize(50, 0.3),
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
        fontSize: normalize(16, 0.3),
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#CBD5E0',
        borderRadius: normalize(8),
        height: normalize(50, 0.3),
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButtonText: {
        color: '#718096',
        fontSize: normalize(16, 0.3),
        fontWeight: '600',
    },
    orientacaoSexualContainer: {
        backgroundColor: '#F0F9FF',
        borderRadius: normalize(12),
        padding: normalize(20, 0.3),
        marginBottom: normalize(20, 0.3),
        borderWidth: 1,
        borderColor: '#BEE3F8',
        zIndex: 1,
    },
    orientacaoSexualTitle: {
        fontSize: normalize(16),
        fontWeight: '600',
        color: '#2D3748',
        textAlign: 'center',
        marginBottom: normalize(16, 0.3),
    },
    orientacaoSexualOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        zIndex: 2,
    },
    orientacaoSexualOption: {
        width: '48%',
        paddingVertical: normalize(12, 0.3),
        paddingHorizontal: normalize(8, 0.3),
        borderRadius: normalize(8),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: normalize(10, 0.3),
        alignItems: 'center',
        backgroundColor: 'white',
    },
    orientacaoSexualOptionSelected: {
        backgroundColor: '#EBF8FF',
        borderColor: '#3498DB',
    },
    orientacaoSexualOptionText: {
        fontSize: normalize(14, 0.3),
        fontWeight: '500',
        color: '#718096',
        textAlign: 'center',
    },
    orientacaoSexualOptionTextSelected: {
        color: '#3498DB',
        fontWeight: '600',
    },
});