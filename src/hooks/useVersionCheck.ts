import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { APP_VERSION } from '../config/version';

const VERSION_DOC_ID = 'dzXz1HCFbOYhjOo2MXjh';

export const useVersionCheck = () => {
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const versionRef = doc(db, 'version_app', VERSION_DOC_ID);
                const versionDoc = await getDoc(versionRef);

                if (versionDoc.exists()) {
                    const serverData = versionDoc.data();
                    const needsUpdate = compareVersions(APP_VERSION, serverData.version);

                    if (needsUpdate) {
                        Alert.alert(
                            'Atualização Disponível',
                            `Uma nova versão do aplicativo está disponível (${serverData.version}). ${
                                serverData.isForceUpdate ? 'É necessário atualizar para continuar usando.' : 'Deseja atualizar agora?'
                            }`,
                            [
                                {
                                    text: 'Atualizar Agora',
                                    onPress: () => Linking.openURL(serverData.playStoreUrl),
                                },
                                serverData.isForceUpdate ? null : {
                                    text: 'Mais Tarde',
                                    style: 'cancel',
                                }
                            ].filter(Boolean) as any,
                            { 
                                cancelable: !serverData.isForceUpdate
                            }
                        );
                    }
                }
            } catch (error) {
                console.error('Erro ao verificar versão:', error);
            }
        };

        checkVersion();
    }, []);
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