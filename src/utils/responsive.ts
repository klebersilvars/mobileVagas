import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base sizes for iPhone 12 Pro Max
const BASE_WIDTH = 428;
const BASE_HEIGHT = 926;

// Base values
const baseWidth = 375;
const baseHeight = 812;

// Função para calcular dimensões responsivas
export const scale = (size: number) => (width / BASE_WIDTH) * size;
export const verticalScale = (size: number) => (height / BASE_HEIGHT) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Funções para diferentes tamanhos de tela
export const isSmallScreen = width < 375;
export const isMediumScreen = width >= 375 && width < 414;
export const isLargeScreen = width >= 414;

// Funções para tamanhos de fonte responsivos
export const getResponsiveFontSize = (size: number): number => {
    const scale = Math.min(width / baseWidth, height / baseHeight);
    return Math.round(size * scale);
};

// Funções para padding e margin responsivos
export const getResponsivePadding = (size: number): number => {
    const scale = Math.min(width / baseWidth, height / baseHeight);
    return Math.round(size * scale);
};

export const getResponsiveMargin = (size: number): number => {
    const scale = Math.min(width / baseWidth, height / baseHeight);
    return Math.round(size * scale);
};

// Funções para altura e largura responsivas
export const getResponsiveWidth = (size: number): number => {
    const scale = width / BASE_WIDTH;
    return Math.round(size * scale);
};

export const getResponsiveHeight = (size: number): number => {
    const scale = height / BASE_HEIGHT;
    return Math.round(size * scale);
};

// Função para verificar se é um dispositivo iOS
export const isIOS = Platform.OS === 'ios';

// Função para verificar se é um dispositivo Android
export const isAndroid = Platform.OS === 'android';

// Função para calcular tamanhos de ícones responsivos
export const getResponsiveIconSize = (size: number) => {
    if (isSmallScreen) return moderateScale(size, 0.8);
    if (isMediumScreen) return moderateScale(size);
    return moderateScale(size, 1.2);
};

// Função para calcular border radius responsivo
export const getResponsiveBorderRadius = (size: number): number => {
    const scale = Math.min(width / baseWidth, height / baseHeight);
    return Math.round(size * scale);
};

// Função para calcular line height responsivo
export const getResponsiveLineHeight = (size: number): number => {
    const scale = width / BASE_WIDTH;
    return Math.round(size * scale);
}; 