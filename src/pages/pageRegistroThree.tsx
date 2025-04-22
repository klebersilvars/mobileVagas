import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  ScrollView, 
  Text, 
  TextInput, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  PixelRatio
} from 'react-native';
import { ButtonPasswordFalse, ButtonPasswordTrue } from '../components/ButtonStepOne';
import { RegistroUserGeral } from '../interfaces/storageRegistroInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import {setDoc, doc} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
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

const hp = (percentage: number) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
};

type navigationRegistroThree = StackNavigationProp<RootStackParamList>

export default function PageRegistroThree() {
    const [password, setPassword] = useState<string>('');
    const [passwordSecondary, setPasswordSecondary] = useState<string>('');
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
    const [passwordLength, setPasswordLength] = useState<boolean>(false);
    const [dadosUserGeral, setDadosUserGeral] = useState<RegistroUserGeral | null>(null)
    const navigation = useNavigation<navigationRegistroThree>();

    // Verifica se as senhas são iguais
    useEffect(() => {
        if (passwordSecondary === password && password !== '') {
            setPasswordsMatch(true);
        } else if (password.length !== 6 && passwordSecondary.length !== 6) {
            setPasswordLength(true)
        } else {
            setPasswordsMatch(false)
            setPasswordLength(false)
        }
    }, [passwordSecondary, password]);

    //vai trazer os dados que foram guardados nas últimas telas e armazenar tudo junto
    useEffect(() => {
        const dadosUserStorage = async () => {
            try {
                const trazendoDadosOne = await AsyncStorage.getItem('registroUserOne');
                const trazendoDadosTwo = await AsyncStorage.getItem('registroUserTwo');

                // Verificando se ambos não são nulos ou undefined
                if (trazendoDadosOne && trazendoDadosTwo) {
                    const dadosOne = JSON.parse(trazendoDadosOne);
                    const dadosTwo = JSON.parse(trazendoDadosTwo);

                    // Mesclando os dados e atualizando o estado
                    setDadosUserGeral({ ...dadosOne, ...dadosTwo, password });
                }
            } catch (e) {
                console.log(e);
            }
        };

        dadosUserStorage();
    }, [password]);

    //função para executar o clique do botão e efetuar o cadastro do usuário enviando os dados para o banco de dados
    const criarUser = async () => {
        if (dadosUserGeral?.email) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, dadosUserGeral.email, password);
                const user = userCredential.user;

                //cadastrando os dados do usuário no firestore database
                await setDoc(doc(db, 'user_candidato', user.uid), dadosUserGeral)
                Alert.alert('Sucesso!', 'Você será redirecionado para a tela principal.')
                navigation.navigate('PageHome');

            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('O email não foi encontrado!');
        }
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
                keyboardVerticalOffset={Platform.OS === "ios" ? hp(8) : 0}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                >
                    {/* Form Content */}
                    <View style={styles.formCard}>
                        <Text allowFontScaling={false} style={styles.formTitle}>
                            Finalização de cadastro
                        </Text>
                        
                        <Text allowFontScaling={false} style={styles.formSubtitle}>
                            Use a plataforma a seu favor, encontre os melhores empregos!
                        </Text>
                        
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text allowFontScaling={false} style={styles.inputLabel}>Senha</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor="#A0AEC0"
                                    keyboardType="default"
                                    onChangeText={(value: string) => setPassword(value)}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text allowFontScaling={false} style={styles.inputLabel}>Confirme sua senha</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Digite novamente sua senha"
                                    placeholderTextColor="#A0AEC0"
                                    keyboardType="default"
                                    onChangeText={(value: string) => setPasswordSecondary(value)}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                                {passwordLength && (
                                    <Text style={styles.errorMessage}>
                                        Sua senha precisa ter 6 caracteres ou mais!
                                    </Text>
                                )}
                            </View>

                            <View style={styles.buttonContainer}>
                                {passwordsMatch ? (
                                    <TouchableOpacity 
                                        style={styles.primaryButton}
                                        onPress={criarUser}
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
                    </View>
                    
                    {/* Extra padding view to ensure scrolling works */}
                    <View style={styles.extraPadding} />
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
        paddingHorizontal: wp(4),
        paddingBottom: hp(15), // Extra padding at the bottom to ensure scrolling works
        flexGrow: 1,
        minHeight: Platform.OS === 'ios' ? hp(70) : hp(60), // Ensure content takes up enough space to be scrollable
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: normalize(12),
        padding: normalize(24, 0.3),
        marginTop: hp(3),
        marginBottom: hp(3),
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
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#3498DB',
        borderRadius: normalize(8),
        height: normalize(50, 0.3),
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
        fontSize: normalize(16, 0.3),
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#CBD5E0',
        borderRadius: normalize(8),
        height: normalize(50, 0.3),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButtonText: {
        color: '#718096',
        fontSize: normalize(16, 0.3),
        fontWeight: '600',
    },
    extraPadding: {
        height: hp(6), // Extra space at the bottom of the form that scales with screen height
    }
});