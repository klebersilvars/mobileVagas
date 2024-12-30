import React, { useState } from 'react';
import { View, StatusBar, SafeAreaView, StyleSheet, Text, TextInput, Button } from 'react-native';
import ButtonStepOne from '../components/ButtonStepOne';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList';
import { useNavigation } from '@react-navigation/native';

type NavigationStep = StackNavigationProp<RootStackParamList>

export default function PageRegistroTwo() {

    //useState
    const [SwitchPassowrd, setSwitchPassword] = useState<boolean>(false)
    const [nomeCompletoRegistro, setNomeCompletoRegistro] = useState<string>('')
    const [emailRegistro, setEmailRegitro] = useState<string>('')
    const navigation = useNavigation<NavigationStep>()

    function irPageStepTwo():void {
        alert('Teste botão')
    }


    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#ECF0F1" barStyle="dark-content" />
                <View style={styles.containerLogo}>
                    <Text style={styles.textLogo}>Suas informações</Text>
                    <Text style={styles.textDescricaoLogo}>
                    Sua plataforma para iniciar sua jornada profissional com facilidade.</Text>
                </View>

                <View style={styles.formLoginContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>Nome Completo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Arleuda da silva"
                            keyboardType="default"
                            onChangeText={value => setNomeCompletoRegistro(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="teste@gmail.com"
                            keyboardType='email-address'
                            onChangeText={value => setEmailRegitro(value)}
                        />
                    </View>

                    <View style={styles.containerButtonStepOne}>
                        <ButtonStepOne onPress={irPageStepTwo}/>
                    </View>

                    {/* <View style={styles.acoesFormContainer}>
                        <View style={styles.containerMostrarSenha}>
                            <Text style={{fontWeight: 'bold', color: '#777777'}}>Mostrar senha</Text>
                            <Switch
                                value={SwitchPassowrd}
                                thumbColor={SwitchPassowrd ? 'green' : 'red'}
                                onValueChange={value => setSwitchPassword(value)}
                            />
                        </View>
                    </View> */}
                </View>
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
        position: 'relative'
    },
    containerLogo: {
        width: '100%',
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginBottom: 50,
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
        width: '70%',
        textAlign: 'center'
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
        top: -27,
        left: 37,
    },
    input: {
        borderWidth: 1,
        height: 46,
        width: '80%',
        borderRadius: 3,
        marginTop: 5,
        borderColor: '#3498DB',
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
        backgroundColor: '#3498DB',
        width: '50%',
        height: 46,
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 1
    },
    containerButtonStepOne: {
        width:'100%',
        height: 50,
        display: 'flex',
        alignItems:'center',
        justifyContent: 'center'
    }
});
