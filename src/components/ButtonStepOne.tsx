import React from 'react'
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

// Definindo o tipo das props
interface ButtonStepOneProps {
    onPress: () => void; // onPress é uma função que não recebe parâmetros e não retorna nada
    disabled: boolean; // minha prop vai receber boolean diretamente.
}

const ButtonStepOne: React.FC<ButtonStepOneProps> = ({ onPress, disabled }) => {
    return (
        <TouchableOpacity style={styles.containerButton} disabled={disabled} onPress={onPress}>
            <Text style={styles.textButtonStepOne}>
                Continuar
            </Text>
        </TouchableOpacity>
    );
};

const ButtonStepOneDisabled: React.FC<ButtonStepOneProps> = ({ onPress, disabled }) => {
    return (
        <TouchableOpacity style={styles.containerButtonDisabled} disabled={disabled} onPress={onPress}>
            <Text style={styles.textButtonStepOne}>
                Continuar
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    containerButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3498DB',
        width: width * 0.73, // tentando responsividade
        height: 46,
        borderRadius:10,
    },
    containerButtonDisabled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'gray',
        width: width * 0.73, // tentando responsividade
        height: 46,
        borderRadius:10,
    },
    textButtonStepOne: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export {ButtonStepOne, ButtonStepOneDisabled}
