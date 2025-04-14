import { StyleSheet } from 'react-native';

export const StylePerfilUser = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoLabel: {
        width: 100,
        fontSize: 16,
        color: '#666',
    },
    infoValue: {
        flex: 1,
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 