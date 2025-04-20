import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StatusBar
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../routes/RootStackParamList';

type NavigationEsqueciSenha = StackNavigationProp<RootStackParamList>;

export default function PageEsqueciSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationEsqueciSenha>();

  const handleRecuperarSenha = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Sucesso',
        'Um e-mail foi enviado para você com as instruções para redefinir sua senha.',
        [{ text: 'OK', onPress: () => navigation.navigate('PageLogin') }]
      );
    } catch (error: any) {
      let mensagemErro = 'Ocorreu um erro ao enviar o e-mail de recuperação.';
      
      if (error.code === 'auth/user-not-found') {
        mensagemErro = 'Não encontramos uma conta com este e-mail.';
      } else if (error.code === 'auth/invalid-email') {
        mensagemErro = 'O e-mail fornecido é inválido.';
      }
      
      Alert.alert('Erro', mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        
        <View style={styles.content}>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            Digite seu e-mail cadastrado para receber as instruções de recuperação de senha
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu.email@exemplo.com"
              placeholderTextColor="#A0AEC0"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleRecuperarSenha}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Enviando...' : 'Enviar E-mail'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate('PageLogin')}
          >
            <Text style={styles.backButtonText}>Voltar para o login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2D3748',
  },
  button: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: '#3498DB',
    fontSize: 16,
    fontWeight: '500',
  },
}); 