import { db } from './firebase';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

const VERSION_DOC_ID = 'dzXz1HCFbOYhjOo2MXjh';

// Versão atual do aplicativo
export const CURRENT_APP_VERSION = '1.0.0';

// Função para atualizar a versão no Firebase
export const updateAppVersion = async (version: string) => {
    try {
        const versionRef = doc(db, 'version_app', VERSION_DOC_ID);
        await setDoc(versionRef, {
            version: version,
            updatedAt: new Date().toISOString()
        });
        console.log('Versão atualizada com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar versão:', error);
        throw error;
    }
};

// Função para obter a versão atual do Firebase
export const getCurrentAppVersion = async () => {
    try {
        const versionRef = collection(db, 'version_app');
        const querySnapshot = await getDocs(versionRef);
        
        if (!querySnapshot.empty) {
            const versionDoc = querySnapshot.docs[0].data();
            return versionDoc.version;
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar versão:', error);
        throw error;
    }
};

// Função para configurar a versão inicial no Firebase
export const setupInitialVersion = async () => {
    try {
        const versionRef = doc(db, 'version_app', VERSION_DOC_ID);
        const versionDoc = await getDoc(versionRef);

        if (!versionDoc.exists()) {
            await setDoc(versionRef, {
                version: CURRENT_APP_VERSION,
                updatedAt: new Date().toISOString(),
                minVersion: '1.0.0', // versão mínima suportada
                isForceUpdate: false // se true, força o usuário a atualizar
            });
            console.log('Versão inicial configurada com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao configurar versão inicial:', error);
    }
};

// Função para verificar se o app está atualizado
export const checkAppVersion = async () => {
    try {
        const versionRef = doc(db, 'version_app', VERSION_DOC_ID);
        const versionDoc = await getDoc(versionRef);

        if (versionDoc.exists()) {
            const serverVersion = versionDoc.data();
            return {
                currentVersion: CURRENT_APP_VERSION,
                latestVersion: serverVersion.version,
                minVersion: serverVersion.minVersion,
                isForceUpdate: serverVersion.isForceUpdate,
                needsUpdate: compareVersions(CURRENT_APP_VERSION, serverVersion.version)
            };
        }
        return null;
    } catch (error) {
        console.error('Erro ao verificar versão:', error);
        return null;
    }
};

// Função para comparar versões
const compareVersions = (currentVersion: string, serverVersion: string): boolean => {
    const current = currentVersion.split('.').map(Number);
    const server = serverVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(current.length, server.length); i++) {
        const currentPart = current[i] || 0;
        const serverPart = server[i] || 0;

        if (currentPart < serverPart) return true; // precisa atualizar
        if (currentPart > serverPart) return false;
    }

    return false; // versões iguais, não precisa atualizar
}; 