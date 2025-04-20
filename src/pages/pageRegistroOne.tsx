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
  TouchableOpacity
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
            nome_completo: nomeCompletoRegistro, // Preencha com o valor apropriado
            email: emailRegistro,         // Preencha com o valor apropriado
            data_nascimento: dataNascimentoRegistro,
            type_conta: typeConta
        };

        setDadosUserInterface(novoUsuario)
    }, [nomeCompletoRegistro, emailRegistro, dataNascimentoRegistro])

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
                type_conta: typeConta
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

                                <View style={styles.buttonContainer}>
                                    {maiorIdade && !camposCandidatos ? (
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
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    accountTypeCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginTop: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    accountTypeTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        textAlign: 'center',
        marginBottom: 16,
    },
    accountTypeOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    accountTypeOption: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginHorizontal: 6,
        alignItems: 'center',
    },
    accountTypeOptionSelected: {
        backgroundColor: '#EBF8FF',
        borderColor: '#3498DB',
    },
    accountTypeOptionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#718096',
    },
    accountTypeOptionTextSelected: {
        color: '#3498DB',
        fontWeight: '600',
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        marginTop: 24,
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
    errorMessage: {
        color: '#E53E3E',
        fontSize: 14,
        marginTop: 8,
    },
    buttonContainer: {
        marginTop: 16,
    },
    primaryButton: {
        backgroundColor: '#3498DB',
        borderRadius: 8,
        height: 50,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButtonText: {
        color: '#718096',
        fontSize: 16,
        fontWeight: '600',
    },
});