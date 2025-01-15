import React, { useState, useEffect } from 'react';
import { View, StatusBar, SafeAreaView, StyleSheet, Text, TextInput, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ButtonStepOne } from '../components/ButtonStepOne';
import { ButtonStepOneDisabled } from '../components/ButtonStepOne';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { Picker } from '@react-native-picker/picker';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


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
    const [typeConta, setTypeConta] = useState<string>('candidato')
    const [dataCriacaoEmpresa, setDataCriacaoEmpresa] = useState<string>('');
    const [nomeEmpresa, setNomeEmpresa] = useState<string>('');
    const [emailEmpresa, setEmailEmpresa] = useState<string>('');
    const [cnpjEmpresa, setCnpjEmpresa] = useState<string>('');
    const [passwordEmpresa, setPasswordEmpresa] = useState<string>('')
    const navigation = useNavigation<NavigationStep>();
    const [camposCandidatos, setCamposCandidatos] = useState<boolean>(false)


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

    //função para data de criação da empresa



    const handleInputChange = (value: string) => {
        // Remove tudo que não for número
        const cleanedValue = value.replace(/\D/g, '');

        // Aplica a máscara
        let formattedValue = cleanedValue;
        if (cleanedValue.length > 2) {
            formattedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2)}`;
        }
        if (cleanedValue.length > 4) {
            formattedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}/${cleanedValue.slice(4, 6)}`;
        }

        setDataCriacaoEmpresa(formattedValue);
    };

    //mascara para o CNPJ
    const handleCnpjChange = (text: string) => {
        // Remove qualquer caractere que não seja número
        const numericText = text.replace(/[^0-9]/g, '');

        // Aplica a máscara de CNPJ
        let formattedText = numericText;
        if (numericText.length > 2) {
            formattedText = `${numericText.slice(0, 2)}.${numericText.slice(2)}`;
        }
        if (numericText.length > 5) {
            formattedText = `${numericText.slice(0, 2)}.${numericText.slice(2, 5)}.${numericText.slice(5)}`;
        }
        if (numericText.length > 8) {
            formattedText = `${numericText.slice(0, 2)}.${numericText.slice(2, 5)}.${numericText.slice(5, 8)}/${numericText.slice(8)}`;
        }
        if (numericText.length > 12) {
            formattedText = `${numericText.slice(0, 2)}.${numericText.slice(2, 5)}.${numericText.slice(5, 8)}/${numericText.slice(8, 12)}-${numericText.slice(12, 14)}`;
        }

        setCnpjEmpresa(formattedText);
    };

    //função que faça a validação dos inputs dos candidatos
    const validacaoCamposCandidatos = ()=> {
        if (nomeCompletoRegistro == '' && emailRegistro == '' && dataNascimentoRegistro == '') {
            setCamposCandidatos(false)
        }
    }

    return (
        <>

            <SafeAreaView style={{
                backgroundColor: '#ECF0F1', display: 'flex',
                justifyContent: 'center', flex: 0.3, alignItems: 'center',
            }}>
                <Text style={{ marginTop: 10, }}>Escolha o tipo de conta que você deseja criar</Text>
                <Picker
                    style={{ backgroundColor: 'white', height: 60, width: '50%', marginTop: 10 }}
                    selectedValue={typeConta}
                    onValueChange={(itemValue, itemIndex) =>
                        setTypeConta(itemValue)
                    }>
                    <Picker.Item label="Candidato" value="candidato" />
                    <Picker.Item label="Empresa" value="empresa" />
                </Picker>
            </SafeAreaView>



            {typeConta === 'candidato' ? (
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
                                onChangeText={(value: string) => setNomeCompletoRegistro(value)}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.textLabel}>E-mail</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="teste@gmail.com"
                                keyboardType='email-address'
                                onChangeText={(value: string) => setEmailRegitro(value)}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.textLabel}>Data de nascimento</Text>
                            <TextInputMask
                                type={'custom'}
                                options={{
                                    mask: '99/99/9999',
                                }}
                                value={dataNascimentoRegistro}
                                onChangeText={handleDateChange}
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
                        {maiorIdade && !camposCandidatos ? (
                            <View style={styles.containerButtonStepOne}>
                                <ButtonStepOne disabled={false} onPress={irPageStepTwo} />
                            </View>
                        ) : (
                            <View style={styles.containerButtonStepOne}>
                                <ButtonStepOneDisabled onPress={irPageStepTwo} disabled={true} />
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            ) : (
                <SafeAreaView style={styles.container}>
                    <StatusBar backgroundColor="#ECF0F1" barStyle="dark-content" />
                    <ScrollView>
                        <View style={styles.containerLogo}>
                            <Text style={styles.textLogo}>NOVOS TALENTOS</Text>
                            <Text style={styles.textDescricaoLogo}>
                                Registre sua empresa na melhor plataforma de empregos para iniciantes!
                            </Text>
                        </View>
                        <View style={styles.formLoginContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.textLabel}>Nome da empresa</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Arleuda da silva"
                                    keyboardType="default"
                                    onChangeText={(value: string) => setNomeEmpresa(value)}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.textLabel}>E-mail da empresa</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="teste@gmail.com"
                                    keyboardType='email-address'
                                    onChangeText={(value: string) => setEmailEmpresa(value)}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.textLabel}>Data de criação da empresa</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="00/00/00"
                                    keyboardType="numeric"
                                    value={dataCriacaoEmpresa}
                                    onChangeText={handleInputChange}
                                    maxLength={8} // Limita a entrada ao tamanho esperado
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.textLabel}>CNPJ da empresa</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Somente números"
                                    keyboardType='numeric'
                                    value={cnpjEmpresa}
                                    maxLength={18}
                                    onChangeText={handleCnpjChange}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.textLabel}>Senha</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="********"
                                    keyboardType='default'
                                    onChangeText={(value: string) => setPasswordEmpresa(value)}
                                    secureTextEntry={true}
                                />
                            </View>

                            <TouchableOpacity style={styles.ButtonCriarEmpresa}>
                                <Text style={styles.textButtonCriarEmpresa}>Criar Conta Empresa</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )}

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
        borderColor: 'gray',
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
    },
    ButtonCriarEmpresa: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        width: width * 0.73, // tentando responsividade
        height: 50,
        borderRadius: 10,
    },
    textButtonCriarEmpresa: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
