import React, { useState,useEffect } from 'react';
import { View, StatusBar, SafeAreaView, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { ButtonStepOne } from '../components/ButtonStepOne';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import axios from 'axios'

type NavigationStep = StackNavigationProp<RootStackParamList>

interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  complemento: string
  estado: string;
  uf: string;
}

export default function PageRegistroTwo() {

    //useState
    const [SwitchPassowrd, setSwitchPassword] = useState<boolean>(false)
    const [cepRegistro, setCepRegistro] = useState<string>('')
    const [registroCepUser, setRegistroCepUser] = useState<Endereco | null>(null)
    const navigation = useNavigation<NavigationStep>()

    function irPageStepThree(): void {
        alert('Teste botão')
    }

    function pegarCep(cepRegistro: string) {
        axios.get(`https://viacep.com.br/ws/${cepRegistro}/json/ `)
            .then(function (response) {
                if(response.data !== null) {
                    setRegistroCepUser(response.data)
                    Alert.alert('Sucesso!', 'Encontramos seu enderço!')
                }
            })
            .catch(function (error) {
                // aqui temos acesso ao erro, quando alguma coisa inesperada acontece:
                console.log(error);
            })
    }

    useEffect(() => {
        if (cepRegistro) {
            pegarCep(cepRegistro);
        }
    }, [cepRegistro]); // Quando o cepRegistro mudar, a função pegarCep será chamada


    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#ECF0F1" barStyle="dark-content" />
                <View style={styles.containerLogo}>
                    <Text style={styles.textLogo}>Preciso de mais informações...</Text>
                    <Text style={styles.textDescricaoLogo}>
                        Sua plataforma para iniciar sua jornada profissional com facilidade.</Text>
                </View>

                <View style={styles.formLoginContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>CEP</Text>
                        <TextInputMask
                            type={'custom'}
                            options={{
                                mask:'99999-999'
                            }}
                            style={styles.input}
                            placeholder="Somente números"
                            keyboardType='numeric'
                            onChangeText={value => setCepRegistro(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>Logradouro</Text>
                        <TextInput
                            style={styles.inputDisabled}
                            placeholder="Logradouro"
                            value={registroCepUser?.logradouro}
                            keyboardType="default"
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>Bairro</Text>
                        <TextInput
                            style={styles.inputDisabled}
                            placeholder="Bairro"
                            keyboardType="default"
                            value={registroCepUser?.bairro}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>Complemento</Text>
                        <TextInput
                            style={styles.inputDisabled}
                            placeholder="Complemento"
                            keyboardType="default"
                            value={registroCepUser?.complemento}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>Estado</Text>
                        <TextInput
                            style={styles.inputDisabled}
                            placeholder="Estado"
                            keyboardType="default"
                            value={registroCepUser?.estado}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>UF</Text>
                        <TextInput
                            style={styles.inputDisabled}
                            placeholder="UF"
                            keyboardType="default"
                            value={registroCepUser?.uf}
                            editable={false}
                        />
                    </View>



                    <View style={styles.containerButtonStepOne}>
                        <ButtonStepOne disabled={false} onPress={irPageStepThree} />
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
        fontSize: 35,
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
    inputDisabled: {
        borderWidth: 1,
        height: 46,
        width: '80%',
        borderRadius: 3,
        marginTop: 5,
        borderColor: '#3498DB',
        paddingHorizontal: 10,
        backgroundColor: '#c0c0c0'
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
        width: '100%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
