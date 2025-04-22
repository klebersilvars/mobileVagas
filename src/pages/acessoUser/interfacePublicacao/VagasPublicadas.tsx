import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { baseStyles } from '../../../styles/baseStyles';
import { getResponsiveFontSize, getResponsivePadding, getResponsiveMargin, getResponsiveBorderRadius } from '../../../utils/responsive';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MailComposer from 'expo-mail-composer';

export const styles = StyleSheet.create({
  ...baseStyles,
  vagaContainer: {
    ...baseStyles.card,
    marginBottom: getResponsiveMargin(16),
  },
  vagaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveMargin(8),
  },
  vagaTitle: {
    ...baseStyles.title,
    fontSize: getResponsiveFontSize(20),
    flex: 1,
  },
  vagaDate: {
    ...baseStyles.text,
    fontSize: getResponsiveFontSize(14),
    color: '#666',
  },
  vagaDescription: {
    ...baseStyles.text,
    marginBottom: getResponsiveMargin(12),
  },
  vagaRequirements: {
    ...baseStyles.text,
    marginBottom: getResponsiveMargin(12),
  },
  vagaSalary: {
    ...baseStyles.text,
    fontWeight: 'bold',
    marginBottom: getResponsiveMargin(12),
  },
  vagaLocation: {
    ...baseStyles.text,
    marginBottom: getResponsiveMargin(12),
  },
  vagaActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: getResponsiveMargin(8),
  },
  editButton: {
    ...baseStyles.button,
    backgroundColor: '#2196F3',
    padding: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(4),
  },
  deleteButton: {
    ...baseStyles.button,
    backgroundColor: '#f44336',
    padding: getResponsivePadding(8),
    borderRadius: getResponsiveBorderRadius(4),
  },
  buttonText: {
    ...baseStyles.buttonText,
    fontSize: getResponsiveFontSize(14),
  },
  candidaturaButton: {
    ...baseStyles.button,
    marginTop: getResponsiveMargin(16),
  },
  candidaturaButtonDisabled: {
    ...baseStyles.buttonDisabled,
    marginTop: getResponsiveMargin(16),
  },
  candidaturaButtonText: {
    ...baseStyles.buttonText,
  },
  candidaturaButtonTextDisabled: {
    ...baseStyles.buttonText,
    color: '#fff',
  },
  candidaturaSuccess: {
    ...baseStyles.successText,
    textAlign: 'center',
    marginTop: getResponsiveMargin(8),
  },
});

interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  requisitos: string;
  salario: string;
  local: string;
  data_publicacao: Date;
}

const VagasPublicadas = () => {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [candidaturas, setCandidaturas] = useState<string[]>([]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleEdit = (vaga: Vaga) => {
    // Implementar lógica de edição
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'vagas', id));
      setVagas(vagas.filter(vaga => vaga.id !== id));
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a vaga');
    }
  };

  const handleCandidatura = async (vaga: Vaga) => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        Alert.alert('Erro', 'Você precisa estar logado para se candidatar');
        return;
      }

      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Erro', 'O serviço de email não está disponível');
        return;
      }

      await MailComposer.composeAsync({
        recipients: ['contato@empresa.com'],
        subject: `Candidatura - ${vaga.titulo}`,
        body: `Olá,\n\nGostaria de me candidatar à vaga de ${vaga.titulo}.\n\nAtenciosamente,\n${userEmail}`,
      });

      setCandidaturas([...candidaturas, vaga.id]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a candidatura');
    }
  };

  useEffect(() => {
    const loadVagas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'vagas'));
        const vagasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Vaga[];
        setVagas(vagasData);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as vagas');
      }
    };

    loadVagas();
  }, []);

  const renderVagaItem = (vaga: Vaga) => (
    <View style={styles.vagaContainer} key={vaga.id}>
      <View style={styles.vagaHeader}>
        <Text style={styles.vagaTitle}>{vaga.titulo}</Text>
        <Text style={styles.vagaDate}>{formatDate(vaga.data_publicacao)}</Text>
      </View>
      <Text style={styles.vagaDescription}>{vaga.descricao}</Text>
      <Text style={styles.vagaRequirements}>{vaga.requisitos}</Text>
      <Text style={styles.vagaSalary}>Salário: {vaga.salario}</Text>
      <Text style={styles.vagaLocation}>Local: {vaga.local}</Text>
      <View style={styles.vagaActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEdit(vaga)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(vaga.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={candidaturas.includes(vaga.id) ? styles.candidaturaButtonDisabled : styles.candidaturaButton}
        onPress={() => handleCandidatura(vaga)}
        disabled={candidaturas.includes(vaga.id)}
      >
        <Text style={candidaturas.includes(vaga.id) ? styles.candidaturaButtonTextDisabled : styles.candidaturaButtonText}>
          {candidaturas.includes(vaga.id) ? 'CANDIDATURA ENVIADA' : 'Candidatar-se'}
        </Text>
      </TouchableOpacity>
      {candidaturas.includes(vaga.id) && (
        <Text style={styles.candidaturaSuccess}>Candidatura enviada com sucesso!</Text>
      )}
    </View>
  );

  return (
    <View>
      {vagas.map(renderVagaItem)}
    </View>
  );
};

export default VagasPublicadas; 