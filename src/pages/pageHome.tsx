import React from 'react';
import { View, StyleSheet, Image, Button, StatusBar, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList'; // Certifique-se de que este caminho está correto

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
type OnBoardingNavigationProp = StackNavigationProp<RootStackParamList, 'OnBoarding'>;

export default function PageHome() {

    const navigation = useNavigation<OnBoardingNavigationProp>();

    function irPageLogin() {
        navigation.navigate('PageLogin');
    }

    function irPageRegistro() {
        navigation.navigate('PageRegistroOne');
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' />
            <Image
                resizeMode="stretch"
                style={styles.imagePrincipal}
                source={require('../../assets/imagem-tela-principal.jpg')}
            />
            <View style={styles.overlay} />
            <View style={styles.ContainerButtons}>
                <View style={styles.infoLoginContainer}>
                    <Text style={styles.textLogin}>Já tem uma conta? Faça o login clicando no botão abaixo</Text>
                    <TouchableOpacity onPress={irPageLogin} style={styles.buttonEntrar}>
                        <Text style={styles.textButtonEntrar}>ENTRAR</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoCadastroContainer}>
                    <Text style={styles.textLogin}>Não possui uma conta? Registre-se agora e participe da melhor plataforma de empregos para iniciantes.</Text>
                    <TouchableOpacity onPress={irPageRegistro} style={styles.buttonEntrar}>
                        <Text style={styles.textButtonEntrar}>REGISTRAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    imagePrincipal: {
        height: '100%',
        width: '100%',
        position: 'absolute', // Deixa a imagem como fundo
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Cobre toda a tela
        backgroundColor: 'rgba(0, 0, 0, 0.808)', // Fundo preto com opacidade
    },
    TextTitulo: {
        color: 'white',
        fontSize: windowWidth / 9,
        textAlign: 'center',

    },
    logoPageHome: {
        position: 'absolute',
        top: -230
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
        top: 190,
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
        top: 310,
        padding: 10,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ContainerButtons: {
        position: 'relative',
        width: '100%',
    },
    textLogin: {
        color: 'white',
        fontSize: windowWidth / 28,
        textAlign: 'center',
    },
    buttonEntrar: {
        width: '75%',
        height: 46,
        backgroundColor: '#3498DB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    textButtonEntrar: {
        textAlign: 'center',
        color: 'white',
        textTransform: 'uppercase',
        fontSize: 19,
        fontWeight: 'bold'
    },

});
