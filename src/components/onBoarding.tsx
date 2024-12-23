import React from 'react';
import Swiper from 'react-native-swiper';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../routes/RootStackParamList'; // Certifique-se de que este caminho está correto

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type OnBoardingNavigationProp = StackNavigationProp<RootStackParamList>;

export default function OnBoarding() {
    const navigation = useNavigation<OnBoardingNavigationProp>();

    function navegarPageHome() {
        navigation.navigate('PageHome'); // Corrigido
    }

    return (
        <Swiper
            style={styles.wrapper}
            showsButtons={false}
            dotColor="#505050"
            activeDotColor="black"
        >
            <View style={styles.slide1}>
                <Image
                    style={styles.imgCrescerCarreira}
                    source={require('../../assets/crescer-carreira.png')}
                />
                <Text style={styles.textCrescerCarreira}>
                    Descubra novas oportunidades e acelere o seu crescimento profissional com nosso
                    aplicativo de vagas de emprego.
                </Text>
            </View>

            <View style={styles.slide2}>
                <Image
                    style={styles.imgProcuradeEmprego}
                    source={require('../../assets/procura-de-emprego.png')}
                />
                <Text style={styles.textProcuradeEmprego}>
                    Simplifique sua busca por emprego com ferramentas poderosas e intuitivas. Nossa
                    plataforma conecta você diretamente às melhores oportunidades do mercado.
                </Text>
            </View>

            <View style={styles.slide3}>
                <Image
                    style={styles.imgMonteCurriculo}
                    source={require('../../assets/monte-curriculo.png')}
                />
                <Text style={styles.textMonteCurriculo}>
                    Crie um currículo impecável e destaque-se entre os candidatos. Nossa solução torna
                    simples se preparar para o próximo passo na sua carreira.
                </Text>
                <View>
                    <TouchableOpacity onPress={navegarPageHome} style={styles.AcessarAppButton}>
                        <Text style={styles.textAcessarApp}>Acessar o aplicativo</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Swiper>
    );
}

const styles = StyleSheet.create({
    wrapper: {},

    slide1: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#3498DB',
        padding: 20,
    },

    slide2: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1ABC9C',
        padding: 20,
    },

    slide3: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#ECF0F1',
        padding: 20,
    },

    imgCrescerCarreira: {
        width: windowWidth * 0.55,
        height: windowHeight * 0.30,
        resizeMode: 'contain',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textCrescerCarreira: {
        fontSize: windowWidth / 22,
        textAlign: 'justify', // Alinhamento alterado para evitar espaços entre palavras
        fontWeight: 'bold',
        color: '#FFFFFF',
        lineHeight: 24,
    },

    imgProcuradeEmprego: {
        width: windowWidth * 0.55,
        height: windowHeight * 0.30,
        resizeMode: 'contain',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textProcuradeEmprego: {
        fontSize: windowWidth / 22,
        textAlign: 'justify', // Alinhamento alterado para evitar espaços entre palavras
        fontWeight: 'bold',
        color: '#FFFFFF',
        lineHeight: 24,
    },

    imgMonteCurriculo: {
        width: windowWidth * 0.55,
        height: windowHeight * 0.30,
        resizeMode: 'contain',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textMonteCurriculo: {
        fontSize: windowWidth / 22,
        textAlign: 'justify', // Alinhamento alterado para evitar espaços entre palavras
        fontWeight: 'bold',
        color: 'black',
        lineHeight: 24,
    },

    AcessarAppButton: {
        backgroundColor: '#3498DB',
        width: windowWidth * 0.50,
        height: 46,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textAcessarApp: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
    },
});
