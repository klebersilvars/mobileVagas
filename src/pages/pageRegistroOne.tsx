import React, { useState, useEffect } from 'react';
import { View, StatusBar, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { ButtonStepOne } from '../components/ButtonStepOne';
import { ButtonStepOneDisabled } from '../components/ButtonStepOne';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';

type NavigationStep = StackNavigationProp<RootStackParamList>;

export default function PageRegistroOne() {

    // useState
    const [nomeCompletoRegistro, setNomeCompletoRegistro] = useState<string>('');
    const [emailRegistro, setEmailRegitro] = useState<string>('');
    const [dataNascimentoRegistro, setDataNascimentoRegistro] = useState<string>('');
    const [anoNascimento, setAnoNascimento] = useState<string>('');
    const [anoAtual, setAnoAtual] = useState<number>(0);
    const [maiorIdade, setMaiorIdade] = useState<boolean>(false);
    const [mensagemIdade, setMensagemIdade] = useState<string>(''); // Estado para a mensagem de idade
    const navigation = useNavigation<NavigationStep>();

    useEffect(() => {
        const date = new Date();
        setAnoAtual(date.getFullYear());
    }, []);

    // Função para verificar a idade e habilitar/desabilitar o botão
    const verIdade = (anoNascimento: string) => {
        const anoNascimentoNum = parseInt(anoNascimento);

        if (anoNascimentoNum && (anoAtual - anoNascimentoNum) >= 18) {
            setMaiorIdade(true); // Habilita o botão
            setMensagemIdade(''); // Limpa qualquer mensagem caso a pessoa seja maior de idade
        } else {
            setMaiorIdade(false); // Desabilita o botão
            setMensagemIdade('Você é menor de idade, não será possível prosseguir com a criação da conta.'); // Mensagem para menor de idade
        }
    };

    // Função para lidar com a mudança da data de nascimento
    const handleDateChange = (text: string) => {
        setDataNascimentoRegistro(text);
        if (text.length === 10) {
            const ano = text.slice(6, 10);  // Extrai o ano da data
            setAnoNascimento(ano);  // Armazena o ano de nascimento
            verIdade(ano);  // Verifica a idade
        } else if (text.length === 0) {
            setMaiorIdade(false);  // Se a data for apagada, desabilita o botão
            setMensagemIdade('');  // Limpa a mensagem
        }
    };

    function irPageStepTwo(): void {
        navigation.navigate('PageRegistroTwo');
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#ECF0F1" barStyle="dark-content" />
                <View style={styles.containerLogo}>
                    <Text style={styles.textLogo}>NOVOS TALENTOS</Text>
                    <Text style={styles.textDescricaoLogo}>
                        Registre-se na melhor plataforma de empregos para iniciantes!
                    </Text>
                </View>

                <View style={styles.formLoginContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>Nome Completo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Arleuda da silva"
                            keyboardType="default"
                            onChangeText={(value:string) => setNomeCompletoRegistro(value)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="teste@gmail.com"
                            keyboardType='email-address'
                            onChangeText={(value:string) => setEmailRegitro(value)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.textLabel}>Data de nascimento</Text>
                        <TextInputMask
                            type={'custom'}
                            options={{
                                mask: '99/99/9999', // Máscara para data: DD/MM/YYYY
                            }}
                            value={dataNascimentoRegistro}
                            onChangeText={handleDateChange} // Atualiza o valor do input
                            style={styles.input}
                            placeholder="00/00/2000"
                            keyboardType='numeric'
                        />
                        {/* Exibe a mensagem de menor de idade se necessário */}
                        {mensagemIdade ? (
                                <Text style={styles.mensagemIdade}>{mensagemIdade}</Text>
                            ) : null}
                    </View>

                    {/* Lógica para habilitar/desabilitar o botão baseado na maioridade */}
                    {maiorIdade ? (
                        <View style={styles.containerButtonStepOne}>
                            <ButtonStepOne disabled={false} onPress={irPageStepTwo} />
                        </View>
                    ) : (
                        <View style={styles.containerButtonStepOne}>
                            <ButtonStepOneDisabled onPress={irPageStepTwo} disabled={true}/>
                        </View>
                    )}
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
        borderRadius: 5,
        marginTop: 5,
        borderColor: '#3498DB',
        paddingHorizontal: 10,
    },
    containerButtonStepOne: {
        width: '100%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mensagemIdade: {
        color: 'red',
        marginTop: 10,
        width: '70%',
        fontSize: 14,
        textAlign: 'center'
    }
});
