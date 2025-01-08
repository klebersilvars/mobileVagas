import React, { useState } from 'react';
import { View, StatusBar, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ButtonStepOne } from '../components/ButtonStepOne';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import axios from 'axios';

type NavigationStep = StackNavigationProp<RootStackParamList>;

interface Endereco {
    cep: string;
    logradouro: string;
    bairro: string;
    complemento: string;
    estado: string;
    uf: string;
}

interface ButtonBuscarCep {
    onPress: () => void;
}

export default function PageRegistroTwo() {
    //useState
    const [SwitchPassowrd, setSwitchPassword] = useState<boolean>(false);
    const [cepRegistro, setCepRegistro] = useState<string>('');
    const [registroCepUser, setRegistroCepUser] = useState<Endereco | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Estado para carregar a requisição
    const [error, setError] = useState<string | null>(null); // Estado para mostrar mensagens de erro
    const navigation = useNavigation<NavigationStep>();

    // Função para buscar o CEP
    const buscarCep = async () => {
        if (!cepRegistro) {
            alert('Por favor, insira um CEP');
            return;
        }

        setLoading(true); // Começa o carregamento
        setError(null); // Limpa mensagens de erro

        try {
            // Fazendo a requisição para a API ViaCEP
            const response = await axios.get(`https://viacep.com.br/ws/${cepRegistro.replace('-', '')}/json/`);

            if (response.data.erro) {
                alert('CEP não encontrado!');
            } else {
                setRegistroCepUser(response.data);
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            setError('Erro ao buscar o CEP. Tente novamente!');
        } finally {
            setLoading(false); // Finaliza o carregamento
        }
    };

    function irPageStepThree(): void {
        alert('Teste botão');
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#ECF0F1" barStyle="dark-content" />
                <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
                    <View style={styles.containerLogo}>
                        <Text style={styles.textLogo}>Preciso de mais informações...</Text>
                        <Text style={styles.textDescricaoLogo}>
                            Sua plataforma para iniciar sua jornada profissional com facilidade.
                        </Text>
                    </View>

                    <View style={styles.formLoginContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.textLabel}>CEP</Text>
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '99999-999'
                                }}
                                style={styles.input}
                                placeholder="Somente números"
                                onChangeText={(value: string) => setCepRegistro(value)}
                            />

                            <TouchableOpacity onPress={buscarCep} style={styles.buttonBuscarCep}>
                                {loading ? (
                                    <ActivityIndicator size={30} color="#fff" />
                                ) : (
                                    <Text style={styles.textBuscarCep}>Buscar</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.textLabel}>Logradouro</Text>
                            <TextInput
                                style={styles.inputDisabled}
                                placeholder="Logradouro"
                                value={registroCepUser?.logradouro || ''}
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
                                value={registroCepUser?.bairro || ''}
                                editable={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.textLabel}>Complemento</Text>
                            <TextInput
                                style={styles.inputDisabled}
                                placeholder="Complemento"
                                keyboardType="default"
                                value={registroCepUser?.complemento || ''}
                                editable={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.textLabel}>Estado</Text>
                            <TextInput
                                style={styles.inputDisabled}
                                placeholder="Estado"
                                keyboardType="default"
                                value={registroCepUser?.estado || ''}
                                editable={false}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.textLabel}>UF</Text>
                            <TextInput
                                style={styles.inputDisabled}
                                placeholder="UF"
                                keyboardType="default"
                                value={registroCepUser?.uf || ''}
                                editable={false}
                            />
                        </View>

                        <View style={styles.containerButtonStepOne}>
                            <ButtonStepOne disabled={false} onPress={irPageStepThree} />
                        </View>
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
        marginTop: 90,
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
    containerButtonStepOne: {
        width: '100%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonBuscarCep: {
        backgroundColor: '#3498DB',
        width: '50%',
        height: 46,
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 1,
        marginTop: 5,
    },
    textBuscarCep: {
        textAlign: 'center',
    }
});
