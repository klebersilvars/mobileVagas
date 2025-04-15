const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBqLxhUqtXxF_Yg_Jd_x_T5p2uZY_VGEeI",
    authDomain: "mobilevagas-b0bf9.firebaseapp.com",
    projectId: "mobilevagas-b0bf9",
    storageBucket: "mobilevagas-b0bf9.appspot.com",
    messagingSenderId: "1051661014996",
    appId: "1:1051661014996:web:c4f8c8e4c45c8f2a4a2c6f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const VERSION_DOC_ID = 'dzXz1HCFbOYhjOo2MXjh';

// Função para configurar a versão inicial
async function setupVersionCollection() {
    try {
        const versionRef = doc(db, 'version_app', VERSION_DOC_ID);
        
        // Configurar dados iniciais
        await setDoc(versionRef, {
            version: '1.0.0',           // versão atual do app
            minVersion: '1.0.0',        // versão mínima suportada
            isForceUpdate: false,       // se true, força atualização
            updatedAt: new Date().toISOString(),
            description: 'Versão inicial do aplicativo',
            playStoreUrl: 'https://play.google.com/store/apps/details?id=com.mobilevagas'
        });

        console.log('✅ Versão configurada com sucesso no Firebase!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao configurar versão:', error);
        process.exit(1);
    }
}

// Executar a configuração
setupVersionCollection(); 