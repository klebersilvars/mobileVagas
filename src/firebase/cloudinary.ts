const CLOUD_NAME = 'dcytxe89i';
const UPLOAD_PRESET = 'ml_default';

export const uploadImage = async (imageUri: string) => {
    try {
        const formData = new FormData();
        
        const localUri = imageUri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('file', {
            uri: localUri,
            name: filename || 'photo.jpg',
            type,
        } as any);

        formData.append('upload_preset', UPLOAD_PRESET);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro detalhado do Cloudinary:', errorData);
            throw new Error(errorData.error?.message || 'Erro ao fazer upload da imagem');
        }

        const data = await response.json();
        console.log('Upload bem sucedido:', data);
        return data.secure_url;
    } catch (error) {
        console.error('Erro ao fazer upload para o Cloudinary:', error);
        throw error;
    }
}; 