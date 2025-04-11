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
import { query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../routes/RootTabParamList';
import CustomAlert from '../components/CustomAlert';

const { width, height } = Dimensions.get('window');

type createTabNavigatorProp = BottomTabNavigationProp<RootTabParamList>;

export default function PageEntrarEmpresa() {
    //useState
    const [SwitchPassowrd, setSwitchPassword] = useState<boolean>(false)
    const [emailLogin, setEmailLogin] = useState<string>('')
    const [PassLogin, setPassLogin] = useState<string>('')
    const empresa_db = collection(db, 'user_empresa'); //verificar se é o banco de dados correto
    const [typeConta, setTypeConta] = useState<string>('empresa')
    const navigation = useNavigation<createTabNavigatorProp>()
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    function esquecerSenha() {
        Alert.alert('AVISO!', 'Implementação em andamento, peço que aguarde a próxima atualização.')
    }

    useFocusEffect(
        React.useCallback(() => {
            // setIsLoadingIndicator(true) // ativa o carregamento
            const timer = setTimeout(() => {
                // setIsLoadingIndicator(false) //desativa o carregamento
            }, 2000);

            return () => clearTimeout(timer); // Limpa o timeout ao sair da tela
        }, [])
    )

    function showAlert(message: string) {
        setAlertMessage(message);
        setAlertVisible(true);
    }

    async function logarEmpresa() {
        if (emailLogin == '' || PassLogin == '') {
            showAlert('Os campos de E-MAIL ou senha estão vazios, tente novamente!');
            return;
        }
        try {
            const queryEmailEmpresa = query(empresa_db, where('email_empresa', '==', emailLogin), where('type_conta', '==', typeConta))
            const rUserEmpresa = await getDocs(queryEmailEmpresa);

            if (!rUserEmpresa.empty) {
                const emailEmpresaDB = rUserEmpresa.docs.map((doc) => {
                    return doc.data().email_empresa;
                });

                const userCredentialEmpresa = await signInWithEmailAndPassword(auth, String(emailEmpresaDB), PassLogin)
                const uidUserCredentialEmpresa = userCredentialEmpresa.user.uid
                const userLogadoObject = {
                    uid: uidUserCredentialEmpresa,
                    email: String(emailEmpresaDB),
                }

                await AsyncStorage.setItem('userEmpresaLogado', JSON.stringify(userLogadoObject))

                showAlert('Usuário logado com sucesso');
                navigation.navigate('BottomTabsEmpresa', { screen: 'homeEmpresa' });
            } else {
                showAlert('Este e-mail não está cadastrado como uma EMPRESA.');
            }
        } catch (e) {
            console.log(e)
        }
    }

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <>
            <CustomAlert visible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
            {/* {IsLoadingIndicator ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={80} color="#000000" />
                </View>
            ) : ( */}
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
                                            Publique as melhores vagas e atraia os melhores candidatos!
                                        </Text>
                                    </View>
                                    
                                    {/* Login Form Card */}
                                    <View style={styles.formCard}>
                                        <Text allowFontScaling={false} style={styles.formTitle}>
                                            Área das empresas
                                        </Text>
                                        
                                        <View style={styles.formContainer}>
                                            <View style={styles.inputContainer}>
                                                <Text allowFontScaling={false} style={styles.inputLabel}>E-mail</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    placeholder="seu.email@empresa.com"
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
                                                    onPress={logarEmpresa} 
                                                    style={styles.loginButton}
                                                >
                                                    <Text allowFontScaling={false} style={styles.loginButtonText}>
                                                        Entrar
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            {/* )} */}
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
        height: 180,
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
        marginTop: 10,
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