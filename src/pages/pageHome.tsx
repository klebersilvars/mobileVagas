import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList'; // Certifique-se de que este caminho está correto


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
type OnBoardingNavigationProp = StackNavigationProp<RootStackParamList>;

export default function PageHome() {

    const navigation = useNavigation<OnBoardingNavigationProp>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Redefinir o loading quando a tela ganhar o foco
    useFocusEffect(
        React.useCallback(() => {
            setIsLoading(true); // Ativa o carregamento ao voltar para a tela
            const timer = setTimeout(() => {
                setIsLoading(false); // Desativa o carregamento após 2 segundos
            }, 2000);

            return () => clearTimeout(timer); // Limpa o timeout ao sair da tela
        }, [])
    );


    function irPageLogin() {
        navigation.navigate('PageLogin');
    }

    function irPageEntrarEmpresa() {
        navigation.navigate('PageEntrarEmpresa')
    }

    function irPageRegistro() {
        navigation.navigate('PageRegistroOne');
    }

    return (
        <>
            {isLoading ? (
                <View style={[styles.container]}>
                    <ActivityIndicator size={80} color="black" />
                </View>
            ) : (
                <View style={styles.container}>
                    <StatusBar barStyle='light-content' />
                    <Text allowFontScaling= {false} style={styles.titleNovosTalentos}>Novos Talentos</Text>
                    <Text allowFontScaling= {false} style={styles.textSlogan}>O melhor aplicativo para iniciantes encontrarem oportunidades de emprego</Text>
                    <View style={styles.ContainerButtons}>

                        <TouchableOpacity onPress={irPageLogin} style={styles.buttonEntrar}>
                            <Text allowFontScaling= {false} style={styles.textButtonEntrar}>Entrar como candidato</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={irPageEntrarEmpresa} style={styles.buttonEntrarEmpresa}>
                            <Text allowFontScaling= {false} style={styles.textButtonEntrar}>Entrar como empresa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={irPageRegistro} style={styles.buttonRegistrar}>
                            <Text allowFontScaling= {false} style={styles.textButtonEntrar}>Registrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )

            }

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#ECF0F1'
    },
    titleNovosTalentos: {
        fontSize: 38,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    textNovosTalentos: {
        position: 'absolute',
        top: 20,
        color: 'white',
        textTransform: 'uppercase',
        fontSize: windowWidth / 10
    },
    ContainerTextTitulo: {
        padding: 10,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoLoginContainer: {
        position: 'absolute',
        width: '100%',
        height: 100,
        top: windowHeight / 10,
        padding: 10,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoCadastroContainer: {
        position: 'absolute',
        width: '100%',
        height: 100,
        top: windowHeight / 3.8,
        padding: 10,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ContainerButtons: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    textLogin: {
        fontSize: windowWidth / 28,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    buttonEntrar: {
        width: '70%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        position: 'absolute',
        top: windowHeight / 4.2
    },
    buttonEntrarEmpresa: {
        width: '70%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        position: 'absolute',
        top: windowHeight / 3.3
    },
    buttonRegistrar: {
        width: '70%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        position: 'absolute',
        top: windowHeight / 2.7
    },
    textButtonEntrar: {
        textAlign: 'center',
        color: 'black',
        fontSize: 19,
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    textSlogan: {
        color: 'grey',
        fontWeight: 'bold',
        width: '75%',
        textAlign: 'justify'
    }

});
