import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Clipboard,
    Alert,
    StatusBar,
    SafeAreaView,
    ScrollView,
    Dimensions,
    Platform,
    Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../routes/RootStackParamList';

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Responsive sizing
const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375;
const normalize = (size: number, factor = 0.5) => {
    return size + (scale - 1) * size * factor;
};

// Convert percentage to pixels
const wp = (percentage: number) => {
    return Math.round((percentage * width) / 100);
};

const hp = (percentage: number) => {
    return Math.round((percentage * height) / 100);
};

const EMAIL_SUPORTE = 'novostalentosofcc@gmail.com';
const WHATSAPP_NUMBER = '5521982410516';

export default function SuporteUser() {
    const navigation = useNavigation<NavigationProp>();

    const copiarEmail = async () => {
        await Clipboard.setString(EMAIL_SUPORTE);
        Alert.alert('Sucesso', 'E-mail copiado para a área de transferência!');
    };

    const abrirWhatsApp = () => {
        const message = 'Olá! Preciso de ajuda com a plataforma Novos Talentos.';
        const url = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
        
        Linking.canOpenURL(url)
            .then(supported => {
                if (!supported) {
                    Alert.alert(
                        'Erro',
                        'WhatsApp não está instalado no seu dispositivo'
                    );
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch(err => console.error('Erro ao abrir WhatsApp:', err));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
            
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Suporte</Text>
            </View>

            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                {/* Header Section */}
                <View style={styles.headerContainer}>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Suporte</Text>
                        <Text style={styles.subtitle}>Como podemos ajudar você hoje?</Text>
                    </View>
                </View>
                
                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* Horário de Atendimento Card */}
                    <View style={styles.card}>
                        <View style={styles.cardIconHeader}>
                            <View style={styles.iconCircle}>
                                <Feather name="clock" size={normalize(20)} color="#000" />
                            </View>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Horário de Atendimento</Text>
                            
                            <View style={styles.scheduleContainer}>
                                <View style={styles.scheduleItem}>
                                    <View style={styles.scheduleDay}>
                                        <Text style={styles.scheduleDayText}>Segunda a Sexta</Text>
                                    </View>
                                    <View style={styles.scheduleTime}>
                                        <Text style={styles.scheduleTimeText}>09:00 às 18:00</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.scheduleDivider} />
                                
                                <View style={styles.scheduleItem}>
                                    <View style={styles.scheduleDay}>
                                        <Text style={styles.scheduleDayText}>Sábado</Text>
                                    </View>
                                    <View style={styles.scheduleTime}>
                                        <Text style={styles.scheduleTimeText}>09:00 às 13:00</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    
                    {/* Email Card */}
                    <View style={styles.card}>
                        <View style={styles.cardIconHeader}>
                            <View style={styles.iconCircle}>
                                <Feather name="mail" size={normalize(20)} color="#000" />
                            </View>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Contato por E-mail</Text>
                            
                            <View style={styles.emailContainer}>
                                <View style={styles.emailBox}>
                                    <Text style={styles.emailText}>{EMAIL_SUPORTE}</Text>
                                </View>
                                
                                <TouchableOpacity 
                                    style={styles.emailButton}
                                    onPress={copiarEmail}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="copy" size={normalize(16)} color="#FFF" />
                                    <Text style={styles.buttonText}>Copiar E-mail</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    {/* WhatsApp Card */}
                    <View style={styles.card}>
                        <View style={styles.cardIconHeader}>
                            <View style={styles.iconCircle}>
                                <Feather name="message-circle" size={normalize(20)} color="#000" />
                            </View>
                        </View>
                        <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>Atendimento WhatsApp</Text>
                            
                            <View style={styles.whatsappContainer}>
                                <Text style={styles.whatsappDescription}>
                                    Atendimento rápido e personalizado para resolver suas dúvidas
                                </Text>
                                
                                <TouchableOpacity 
                                    style={styles.whatsappButton}
                                    onPress={abrirWhatsApp}
                                    activeOpacity={0.7}
                                >
                                    <Feather name="message-circle" size={normalize(16)} color="#FFF" />
                                    <Text style={styles.buttonText}>Iniciar Conversa</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoIconContainer}>
                            <Feather name="info" size={normalize(18)} color="#000" />
                        </View>
                        <Text style={styles.infoText}>
                            Nossa equipe está sempre pronta para ajudar você com qualquer dúvida ou problema que possa surgir durante o uso da plataforma.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? hp(4) : hp(6),
        paddingBottom: hp(2),
        paddingHorizontal: wp(6),
        backgroundColor: '#f5f5f5',
    },
    backButton: {
        padding: normalize(8),
    },
    headerTitle: {
        fontSize: normalize(20),
        fontWeight: '600',
        color: '#000',
        marginLeft: normalize(8),
    },
    headerContainer: {
        paddingTop: Platform.OS === 'ios' ? hp(4) : hp(6),
        paddingBottom: hp(3),
        paddingHorizontal: wp(6),
    },
    headerContent: {
        marginBottom: hp(1),
    },
    title: {
        fontSize: normalize(32),
        fontWeight: '700',
        color: '#000',
        letterSpacing: -0.5,
        marginBottom: hp(0.5),
    },
    subtitle: {
        fontSize: normalize(16),
        color: '#555',
        letterSpacing: 0.1,
    },
    mainContent: {
        paddingHorizontal: wp(6),
        paddingBottom: hp(6),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: normalize(20),
        marginBottom: hp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },
    cardIconHeader: {
        paddingTop: normalize(20),
        paddingHorizontal: normalize(20),
        alignItems: 'flex-start',
    },
    iconCircle: {
        width: normalize(44),
        height: normalize(44),
        borderRadius: normalize(22),
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardBody: {
        padding: normalize(20),
    },
    cardTitle: {
        fontSize: normalize(18),
        fontWeight: '600',
        color: '#000',
        marginBottom: normalize(16),
    },
    scheduleContainer: {
        backgroundColor: '#f9f9f9',
        borderRadius: normalize(12),
        padding: normalize(16),
    },
    scheduleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: normalize(8),
    },
    scheduleDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: normalize(8),
    },
    scheduleDay: {},
    scheduleDayText: {
        fontSize: normalize(15),
        fontWeight: '500',
        color: '#000',
    },
    scheduleTime: {},
    scheduleTimeText: {
        fontSize: normalize(15),
        color: '#555',
    },
    emailContainer: {
        alignItems: 'center',
    },
    emailBox: {
        backgroundColor: '#f9f9f9',
        borderRadius: normalize(12),
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(16),
        marginBottom: normalize(16),
        width: '100%',
        alignItems: 'center',
    },
    emailText: {
        fontSize: normalize(15),
        color: '#000',
        fontWeight: '500',
    },
    emailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(24),
        borderRadius: normalize(12),
        width: '100%',
    },
    whatsappContainer: {
        alignItems: 'center',
    },
    whatsappDescription: {
        fontSize: normalize(15),
        color: '#555',
        textAlign: 'center',
        marginBottom: normalize(16),
        lineHeight: normalize(22),
    },
    whatsappButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25D366',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(24),
        borderRadius: normalize(12),
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: normalize(16),
        fontWeight: '600',
        marginLeft: normalize(8),
    },
    infoSection: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: normalize(16),
        padding: normalize(16),
        marginTop: hp(1),
    },
    infoIconContainer: {
        width: normalize(32),
        height: normalize(32),
        borderRadius: normalize(16),
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(12),
    },
    infoText: {
        flex: 1,
        fontSize: normalize(14),
        color: '#555',
        lineHeight: normalize(20),
    },
});