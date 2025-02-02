import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ScrollView, Text, TextInput } from 'react-native';
import { ButtonPasswordFalse, ButtonPasswordTrue } from '../components/ButtonStepOne';
import { RegistroUserGeral } from '../interfaces/storageRegistroInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase/firebase';
import { db } from '../firebase/firebase';
import {setDoc, doc} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function PageRegistroThree() {

    const [password, setPassword] = useState<string>('');
    const [passwordSecondary, setPasswordSecondary] = useState<string>('');
    const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
    const [passwordLength, setPasswordLength] = useState<boolean>(false);
    const [dadosUserGeral, setDadosUserGeral] = useState<RegistroUserGeral | null>(null)

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
                    setDadosUserGeral({ ...dadosOne, ...dadosTwo });
                }

                
            } catch (e) {
                console.log(e);
            }
        };

        dadosUserStorage();
    }, []);


    //função para executar o clique do botão e efetuar o cadastro do usuário enviando os dados para o banco de dados
    const criarUser = async () => {
        if (dadosUserGeral?.email) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, dadosUserGeral.email, password);
                const user = userCredential.user;

                //gerar o documento com o nome personalizado
                await setDoc(doc(db, 'user_candidato', user.uid), dadosUserGeral)


                console.log('Usuário criado com sucesso:', user);
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log('O email não foi encontrado!');
        }
    };
    



        return (
            <>
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor="#ECF0F1" barStyle="dark-content" />
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.containerLogo}>
                            <Text style={styles.textLogo}>Finalização de cadastro</Text>
                            <Text style={styles.textDescricaoLogo}>
                                Use a plataforma a seu favor, encontre os melhores empregos!
                            </Text>
                        </View>

                        <View style={styles.formLoginContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.textLabel}>Senha</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="***********"
                                    keyboardType="default"
                                    onChangeText={(value: string) => setPassword(value)}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.textLabel}>Confirme sua senha</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="***********"
                                    keyboardType="default"
                                    onChangeText={(value: string) => setPasswordSecondary(value)}
                                    secureTextEntry
                                    autoCapitalize="none"
                                />
                            </View>

                            {passwordsMatch ? (
                                <View style={styles.containerButtonStepOne}>
                                    <ButtonPasswordTrue disabled={!passwordsMatch} onPress={criarUser} />
                                </View>
                            ) : (
                                <View style={styles.containerButtonStepOne}>
                                    <ButtonPasswordFalse disabled={!passwordsMatch} onPress={criarUser} />
                                    {passwordLength ? <Text style={{ color: 'red', marginTop: 10, }}>Sua senha precisa ter 6 caracteres ou mais!</Text> : <></>}
                                </View>
                            )

                            }
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ECF0F1',
            position: 'relative',
        },
        containerLogo: {
            width: '100%',
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            marginTop: '40%',
        },
        textLogo: {
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 35,
        },
        textDescricaoLogo: {
            fontSize: 13,
            color: '#777777',
            fontWeight: 'bold',
            width: '70%',
            textAlign: 'center',
        },
        formLoginContainer: {
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            position: 'relative',
            gap: 40,
        },
        inputContainer: {
            width: '100%',
            height: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        textLabel: {
            fontWeight: 'bold',
            fontSize: 19,
            textAlign: 'left',
            position: 'absolute',
            top: -27,
            left: 37,
        },
        input: {
            borderWidth: 1,
            height: 46,
            width: '80%',
            borderRadius: 3,
            marginTop: 5,
            borderColor: 'gray',
            paddingHorizontal: 10,
        },
        containerButtonStepOne: {
            width: '100%',
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }
    });
