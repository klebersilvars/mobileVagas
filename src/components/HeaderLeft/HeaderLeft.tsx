import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../routes/RootStackParamList';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native'
// Definição do tipo NavigationRouteStep, movido para o componente que vai usá-lo (como PageRegistroTwo)
type NavigationRouteStep = StackNavigationProp<RootStackParamList>;

// Componente HeaderLeft para gerenciar a navegação do botão de voltar
const HeaderLeft = () => {
    const navigation = useNavigation<NavigationRouteStep>();  // Usando useNavigation dentro de um componente de tela

    return (
        <TouchableOpacity style={{paddingLeft: 10}} onPress={() => navigation.navigate('PageHome')}>
            <Icon name="arrow-back" size={40} color="black" />
        </TouchableOpacity>
    );
};

const HeaderLeftPageLogin = () => {
    const navigation = useNavigation<NavigationRouteStep>();  // Usando useNavigation dentro de um componente de tela

    return (
        <TouchableOpacity style={{paddingLeft: 10}} onPress={() => navigation.navigate('PageHome')}>
            <Icon name="arrow-back" size={40} color="black" />
        </TouchableOpacity>
    );
};

export {HeaderLeft, HeaderLeftPageLogin};