import React, { useState } from 'react';
import { 
  View, 
  StatusBar, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  Switch, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { db } from '../firebase/firebase';
import { collection, where, query, getDocs} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../routes/RootTabParamList';

const { width, height } = Dimensions.get('window');

type createTabNavigatorProp = BottomTabNavigationProp<RootTabParamList>;

export default function PageLogin() {
    //useState
    const [SwitchPassowrd, setSwitchPassword] = useState<boolean>(false)
    const [emailLogin, setEmailLogin] = useState<string>('')
    const [passLogin, setPassLogin] = useState<string>('')
    const [IsLoadingIndicator, setIsLoadingIndicator] = useState<boolean>(true);
    const user_candidato_db = collection(db, 'user_candidato')
    const navigation = useNavigation<createTabNavigatorProp>();
    const [isLoading, setIsLoading] = useState(false);
    const [typeConta, setTypeConta] = useState('candidato')

    function esquecerSenha() {
        Alert.alert('AVISO!', 'Implementação em andamento, peço que aguarde a próxima atualização.')
    }

    async function logarUser() {
        if (!emailLogin.trim() || !passLogin.trim()) {
            Alert.alert('ERRO', 'Você precisa preencher todos os campos corretamente');
            return;
        }
        setIsLoading(true);
        try {
            const queryEmailUser = query(user_candidato_db, where('email', '==', emailLogin), where('type_conta', '==', typeConta))
            const rUserCandidato = await getDocs(queryEmailUser);

            if (!rUserCandidato.empty) {
                //variável que vai armazenar o email que foi buscado no banco de dados
                const emailUserDB = rUserCandidato.docs.map((doc) => {
                    return doc.data().email; // Retorna o campo "email_empresa" de cada documento encontrado
                });

                //vou fazer o login do Usuário agora e levar para a página de empresa
                const userCredentialEmpresa = await signInWithEmailAndPassword(auth, String(emailUserDB), passLogin)
                const uidUserCredentialEmpresa = userCredentialEmpresa.user.uid
                const userLogadoObject = {
                    uid: uidUserCredentialEmpresa,
                    email: String(emailUserDB),
                }

                const valueUserTwo = await AsyncStorage.setItem('userCandidatoLogado', JSON.stringify(userLogadoObject))

                Alert.alert('Sucesso', 'Usuário logado com sucesso')
                navigation.navigate('BottomTabsCandidato', { screen: 'HomeUsuario'});
            } else {
                console.log('não encontrei')
            }
        } catch (error) {
            console.log("Erro ao logar:", error);
            Alert.alert('Erro', 'Email ou senha incorretos');
        } finally {
            setIsLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            setIsLoadingIndicator(true) // ativa o carregamento
            const timer = setTimeout(() => {
                setIsLoadingIndicator(false) //desativa o carregamento
            }, 2000);

            return () => clearTimeout(timer); // Limpa o timeout ao sair da tela
        }, [])
    )

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <>
            {IsLoadingIndicator ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={80} color="#000000" />
                </View>
            ) : (
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar backgroundColor="white" barStyle="dark-content" />
                    
                    {/* Header with Logo */}
                    <View style={styles.header}>
                        <Text allowFontScaling={false} style={styles.headerLogo}>NOVOS TALENTOS</Text>
                    </View>
                    
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={styles.keyboardAvoidView}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                    >
                        <ScrollView 
                            contentContainerStyle={styles.scrollViewContent}
                            showsVerticalScrollIndicator={false}
                            bounces={true}
                        >
                            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                                <View style={styles.contentContainer}>
                                    {/* Logo Section */}
                                    <View style={styles.logoContainer}>
                                        <Image 
                                            style={styles.logoImage} 
                                            source={require('../../assets/novos_talentos_logo_fundo.png')} 
                                            resizeMode="contain"
                                        />
                                        <Text allowFontScaling={false} style={styles.logoSubtitle}>
                                            Venha aproveitar o melhor aplicativo de vagas para iniciantes!
                                        </Text>
                                    </View>
                                    
                                    {/* Login Form Card */}
                                    <View style={styles.formCard}>
                                        <Text allowFontScaling={false} style={styles.formTitle}>
                                            Área do candidato!
                                        </Text>
                                        
                                        <View style={styles.formContainer}>
                                            <View style={styles.inputContainer}>
                                                <Text allowFontScaling={false} style={styles.inputLabel}>E-mail</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="seu.email@exemplo.com"
                                                    placeholderTextColor="#A0AEC0"
                                                    keyboardType="email-address"
                                                    onChangeText={value => setEmailLogin(value)}
                                                    autoCapitalize='none'
                                                />
                                            </View>
                                            
                                            <View style={styles.inputContainer}>
                                                <Text allowFontScaling={false} style={styles.inputLabel}>Senha</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="Digite sua senha"
                                                    placeholderTextColor="#A0AEC0"
                                                    onChangeText={value => setPassLogin(value)}
                                                    secureTextEntry={!SwitchPassowrd}
                                                    autoCapitalize='none'
                                                />
                                            </View>
                                            
                                            <View style={styles.formActionsContainer}>
                                                <View style={styles.showPasswordContainer}>
                                                    <Text allowFontScaling={false} style={styles.showPasswordText}>
                                                        Mostrar senha
                                                    </Text>
                                                    <Switch
                                                        value={SwitchPassowrd}
                                                        thumbColor={SwitchPassowrd ? '#000000' : '#CBD5E0'}
                                                        trackColor={{ false: '#E2E8F0', true: '#CCCCCC' }}
                                                        onValueChange={value => setSwitchPassword(value)}
                                                    />
                                                </View>
                                                
                                                <TouchableOpacity 
                                                    onPress={esquecerSenha}
                                                    style={styles.forgotPasswordContainer}
                                                >
                                                    <Text allowFontScaling={false} style={styles.forgotPasswordText}>
                                                        Esqueci minha senha
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            
                                            <View style={styles.buttonContainer}>
                                                <TouchableOpacity 
                                                    onPress={logarUser} 
                                                    style={styles.loginButton}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <ActivityIndicator size="small" color="#fff" />
                                                    ) : (
                                                        <Text allowFontScaling={false} style={styles.loginButtonText}>
                                                            Entrar
                                                        </Text>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#F7FAFC'
    },
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
        flexGrow: 1,
        paddingHorizontal: 16,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    logoImage: {
        height: 180, // Increased logo size
        width: '90%',
        maxWidth: 400,
    },
    logoSubtitle: {
        fontSize: 15,
        color: '#4A5568',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 20,
        maxWidth: 400,
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        marginTop: 10, // Reduced margin to keep form closer to logo
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
    formActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    showPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showPasswordText: {
        fontSize: 14,
        color: '#4A5568',
        marginRight: 8,
    },
    forgotPasswordContainer: {
        padding: 4,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 8,
    },
    loginButton: {
        backgroundColor: '#000000',
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
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});