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
  Dimensions
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
    errorMessage: {
        color: '#E53E3E',
        fontSize: 14,
        marginTop: 8,
    },
    buttonContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#3498DB',
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
    extraPadding: {
        height: 50, // Extra space at the bottom of the form
    }
});