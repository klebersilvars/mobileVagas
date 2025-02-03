import React, { useState } from 'react';
import { View, StatusBar, SafeAreaView, StyleSheet, Text, TextInput, Switch, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function PageLogin() {

    //useState
    const [SwitchPassowrd, setSwitchPassword] = useState<boolean>(false)
    const [emailLogin, setEmailLogin] = useState<string>('')
    const [PassLogin, setPassLogin] = useState<string|number>('')
    const [IsLoadingIndicator, setIsLoadingIndicator] = useState<boolean>(true);

    function esquecerSenha() {
        Alert.alert('AVISO!', 'Implementação em andamento, peço que aguarde a próxima atualização.')
    }

    useFocusEffect(
        React.useCallback(()=> {
            setIsLoadingIndicator(true) // ativa o carregamento
            const timer = setTimeout(() => {
                setIsLoadingIndicator(false) //desativa o carregamento
            }, 2000);

            return () => clearTimeout(timer); // Limpa o timeout ao sair da tela
        }, [])   
    )

    return (
        <>
            { IsLoadingIndicator ? (
                <View style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <ActivityIndicator size={80} color="black"/>
                </View>
            ): (

                <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#ECF0F1" barStyle="dark-content" />
                <View style={styles.containerLogo}>
                    {/* <Text style={styles.textLogo}>NOVOS TALENTOS</Text> */}
                    <Image style={{height: '80%', width: '80%'}} source={require('../../assets/novos_talentos_logo_fundo.png')}/>
                    <Text allowFontScaling= {false} style={styles.textDescricaoLogo}>
                        Venha aproveitar o melhor aplicativo de vagas para iniciantes!
                    </Text>
                </View>

                <View style={styles.formLoginContainer}>
                    <View style={styles.inputContainer}>
                        <Text allowFontScaling= {false} style={styles.textLabel}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: teste.500@gmail.com"
                            keyboardType="email-address"
                            onChangeText={value => setEmailLogin(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text allowFontScaling= {false} style={styles.textLabel}>Senha</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            onChangeText={value => setPassLogin(value)}
                            secureTextEntry={SwitchPassowrd ? false : true}
                        />
                    </View>

                    <View style={styles.acoesFormContainer}>
                        <View style={styles.containerMostrarSenha}>
                            <Text allowFontScaling= {false} style={{fontWeight: 'bold', color: '#777777'}}>Mostrar senha</Text>
                            <Switch
                                value={SwitchPassowrd}
                                thumbColor={SwitchPassowrd ? 'green' : 'red'}
                                onValueChange={value => setSwitchPassword(value)}
                            />
                        </View>
                        <View style={styles.ContainerEsqueciSenha}>
                            <TouchableOpacity onPress={esquecerSenha}>
                                <Text allowFontScaling= {false} style={styles.textEsqueciSenha}>Esqueci minha senha</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <TouchableOpacity style={styles.buttonFazerLogin}>
                        <Text allowFontScaling= {false} style={{textAlign: 'center', color: 'white', fontSize: 18, textTransform: 'uppercase', fontWeight: 'bold'}}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            )
        
        }
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
    },
    containerLogo: {
        width: '100%',
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginBottom: 50,
        gap: 20,
    },
    textLogo: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 40,
    },
    textDescricaoLogo: {
        fontSize: 13,
        color: '#777777',
        fontWeight: 'bold',
    },
    formLoginContainer: {
        height: 'auto',
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
        top: -23,
        left: 37,
    },
    input: {
        borderWidth: 1,
        height: 46,
        width: '80%',
        borderRadius: 5,
        marginTop: 5,
        borderColor: '#gray',
        paddingHorizontal: 10,
    },
    acoesFormContainer: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        position: 'relative'
    },
    containerMostrarSenha: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        position: 'absolute',
        left: 15,
        top: -30,
    },
    textEsqueciSenha: {
        fontSize: 13,
        color: '#777777',
        fontWeight: 'bold',
    },
    ContainerEsqueciSenha: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        position: 'absolute',
        right: 0,
        top: -15,
    },
    buttonFazerLogin: {
        backgroundColor: 'black',
        width: '75%',
        height: 46,
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 1
    }
});
