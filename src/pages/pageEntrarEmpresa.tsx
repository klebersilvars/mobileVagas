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
  ScrollView,
  PixelRatio
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../routes/RootTabParamList';
import CustomAlert from '../components/CustomAlert';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList';

const { width, height } = Dimensions.get('window');

// Responsive calculation functions
const scale = Math.min(width, height) / 375; // Base scale on the smaller dimension
const verticalScale = height / 812; // Based on iPhone X height
const horizontalScale = width / 375; // Based on iPhone X width

const normalize = (size:number, factor = 0.5) => {
  return size + (scale - 1) * size * factor;
};

// Convert percentage to pixels
const wp = (percentage:number) => {
  const value = (percentage * width) / 100;
  return Math.round(value);
};

const hp = (percentage:number) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
};

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList>,
  StackNavigationProp<RootStackParamList>
>;

export default function PageEntrarEmpresa() {
    //useState
    const [SwitchPassowrd, setSwitchPassword] = useState<boolean>(false)
    const [emailLogin, setEmailLogin] = useState<string>('')
    const [PassLogin, setPassLogin] = useState<string>('')
    const empresa_db = collection(db, 'user_empresa'); //verificar se é o banco de dados correto
    const [typeConta, setTypeConta] = useState<string>('empresa')
    const navigation = useNavigation<NavigationProp>()
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    function esquecerSenha() {
        navigation.navigate('PageEsqueciSenha');
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

                showAlert('Empresa logado com sucesso');
                
                // Aguarda o alerta ser exibido antes de navegar
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'BottomTabsEmpresa', params: { screen: 'Publicar Vaga' } }],
                    });
                }, 3000);
            } else {
                showAlert('Este e-mail não está cadastrado como uma EMPRESA.');
            }
        } catch (e) {
            console.log(e)
            showAlert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
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
                        keyboardVerticalOffset={Platform.OS === "ios" ? hp(8) : 0}
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
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: hp(5),
        minHeight: height * 0.8, // Ensure content takes up at least 80% of screen height
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(20, 0.3),
        marginTop: height * 0.02, // Responsive top margin
    },
    logoImage: {
        height: Math.min(height * 0.22, 180), // Responsive height with max value
        width: '90%',
        maxWidth: normalize(400),
        aspectRatio: 2, // Maintain aspect ratio
    },
    logoSubtitle: {
        fontSize: normalize(15, 0.3),
        color: '#4A5568',
        fontWeight: '500',
        textAlign: 'center',
        marginTop: normalize(16, 0.3),
        paddingHorizontal: normalize(20, 0.3),
        maxWidth: normalize(400),
        width: '90%',
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: normalize(12),
        padding: normalize(24, 0.3),
        marginTop: normalize(10, 0.3),
        marginBottom: normalize(24, 0.3),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        width: '100%',
    },
    formTitle: {
        fontSize: normalize(22),
        fontWeight: 'bold',
        color: '#2D3748',
        textAlign: 'center',
        marginBottom: normalize(24, 0.3),
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
    formActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(24, 0.3),
        flexWrap: 'wrap', // Allow wrapping on very small screens
    },
    showPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: normalize(4, 0.3), // Add vertical margin for when it wraps
    },
    showPasswordText: {
        fontSize: normalize(14, 0.3),
        color: '#4A5568',
        marginRight: normalize(8, 0.3),
    },
    forgotPasswordContainer: {
        padding: normalize(4, 0.3),
        marginVertical: normalize(4, 0.3), // Add vertical margin for when it wraps
    },
    forgotPasswordText: {
        fontSize: normalize(14, 0.3),
        color: '#000000',
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: normalize(8, 0.3),
    },
    loginButton: {
        backgroundColor: '#000000',
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
    loginButtonText: {
        color: 'white',
        fontSize: normalize(16, 0.3),
        fontWeight: '600',
        textTransform: 'uppercase',
    },
});