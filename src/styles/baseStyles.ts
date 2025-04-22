import { StyleSheet } from 'react-native';
import {
    getResponsiveFontSize,
    getResponsivePadding,
    getResponsiveWidth,
    getResponsiveHeight,
    getResponsiveBorderRadius,
    getResponsiveLineHeight,
    getResponsiveMargin
} from '../utils/responsive';

export const baseStyles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    safeArea: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: getResponsivePadding(16),
    },

    // Headers
    header: {
        backgroundColor: '#fff',
        padding: getResponsivePadding(16),
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: getResponsiveFontSize(16),
        color: '#666',
        marginTop: getResponsivePadding(8),
    },

    // Cards
    card: {
        backgroundColor: '#fff',
        borderRadius: getResponsiveBorderRadius(8),
        padding: getResponsivePadding(16),
        margin: getResponsiveMargin(8),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: getResponsivePadding(8),
    },

    // Buttons
    button: {
        backgroundColor: '#2196F3',
        padding: getResponsivePadding(12),
        borderRadius: getResponsiveBorderRadius(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#9e9e9e',
        padding: getResponsivePadding(12),
        borderRadius: getResponsiveBorderRadius(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: getResponsiveFontSize(16),
        fontWeight: 'bold',
    },

    // Inputs
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: getResponsiveBorderRadius(8),
        padding: getResponsivePadding(12),
        fontSize: getResponsiveFontSize(16),
        marginBottom: getResponsiveMargin(16),
    },

    // Text
    title: {
        fontSize: getResponsiveFontSize(24),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: getResponsiveMargin(16),
    },
    subtitle: {
        fontSize: getResponsiveFontSize(18),
        fontWeight: '600',
        color: '#666',
        marginBottom: getResponsiveMargin(12),
    },
    text: {
        fontSize: getResponsiveFontSize(16),
        color: '#333',
        lineHeight: getResponsiveLineHeight(24),
    },
    smallText: {
        fontSize: getResponsiveFontSize(14),
        color: '#666',
    },

    // Loading
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        fontSize: getResponsiveFontSize(16),
        marginTop: getResponsivePadding(16),
    },

    // Icons
    icon: {
        width: getResponsiveWidth(24),
        height: getResponsiveHeight(24),
    },

    // Dividers
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: getResponsivePadding(12),
    },

    // Avatar
    avatar: {
        width: getResponsiveWidth(40),
        height: getResponsiveHeight(40),
        borderRadius: getResponsiveBorderRadius(20),
        backgroundColor: '#4A80F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: getResponsivePadding(12),
    },
    avatarText: {
        color: 'white',
        fontSize: getResponsiveFontSize(18),
        fontWeight: 'bold',
    },

    // Badges
    badge: {
        backgroundColor: '#E8F0FF',
        paddingHorizontal: getResponsivePadding(12),
        paddingVertical: getResponsivePadding(6),
        borderRadius: getResponsiveBorderRadius(20),
    },
    badgeText: {
        color: '#4A80F0',
        fontWeight: '600',
        fontSize: getResponsiveFontSize(14),
    },

    // Empty States
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: getResponsivePadding(20),
    },
    emptyTitle: {
        fontSize: getResponsiveFontSize(20),
        fontWeight: 'bold',
        color: '#333',
        marginBottom: getResponsivePadding(8),
    },
    emptySubtitle: {
        fontSize: getResponsiveFontSize(16),
        color: '#666',
        textAlign: 'center',
    },

    // Messages
    errorText: {
        color: '#f44336',
        fontSize: getResponsiveFontSize(14),
        marginTop: getResponsiveMargin(8),
    },
    successText: {
        color: '#4caf50',
        fontSize: getResponsiveFontSize(14),
        marginTop: getResponsiveMargin(8),
    },
}); 