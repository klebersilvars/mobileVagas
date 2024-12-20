import React from 'react';
import { View, StyleSheet, Image, Button, StatusBar, Text, TouchableOpacity } from 'react-native';
import {useFonts, Roboto_100Thin, Roboto_700Bold} from '@expo-google-fonts/roboto'

export default function PageHome() {

    const [fontLoadead] = useFonts({
        Roboto_100Thin,
        Roboto_700Bold
    })

    return (
        <View style={styles.container}>
            <StatusBar barStyle='light-content' />
            <Image
                resizeMode="stretch"
                style={styles.imagePrincipal}
                source={require('../../assets/imagem-tela-principal.jpg')}
            />
            <View style={styles.overlay} />
            <View style={styles.ContainerTextTitulo}>
                <Text style={styles.TextTitulo}>NOVOS TALENTOS</Text>
            </View>
            <View style={styles.ContainerButtons}>
                <View style={styles.infoLoginContainer}>
                    <Text style={styles.textLogin}>Já tem uma conta? Faça o login clicando no botão abaixo</Text>
                    <TouchableOpacity style={styles.buttonEntrar}>
                        <Text style={styles.textButtonEntrar}>Entrar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoCadastroContainer}>
                    <Text style={styles.textLogin}>Não possui uma conta? Registre-se agora e participe da melhor plataforma de empregos para iniciantes.</Text>
                    <TouchableOpacity style={styles.buttonEntrar}>
                        <Text style={styles.textButtonEntrar}>Registrar</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.842)', // Fundo preto com opacidade
    },
    TextTitulo: {
        color: 'white',
        fontSize: 45,
        textAlign: 'center',
        fontFamily: 'Roboto_700Bold'
    },
    ContainerTextTitulo: {
        padding: 10,
    },
    infoLoginContainer: {
        position: 'absolute',
        width: '100%',
        height: 100,
        top: 60,
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
        top: 175,
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
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Roboto_700Bold'
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
        fontFamily: 'Roboto_700Bold'
    },
    
});
