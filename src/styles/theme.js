// KisanVerse Theme Configuration

export const colors = {
    // Primary colors - Green (farm theme)
    primary: '#4CAF50',
    primaryDark: '#2E7D32',
    primaryLight: '#C8E6C9',
    primaryExtraLight: '#E8F5E9',

    // Secondary colors - Orange (harvest theme)
    secondary: '#FF9800',
    secondaryDark: '#F57C00',
    secondaryLight: '#FFE0B2',

    // Accent colors
    accent: '#2196F3',
    accentDark: '#1976D2',
    accentLight: '#BBDEFB',

    // Semantic colors
    success: '#4CAF50',
    warning: '#FFC107',
    danger: '#F44336',
    info: '#2196F3',

    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',

    // Gray scale
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',

    // Text colors
    textPrimary: '#333333',
    textSecondary: '#666666',
    textLight: '#999999',
    textWhite: '#FFFFFF',

    // Background colors
    background: '#F5F5F5',
    backgroundDark: '#E0E0E0',
    surface: '#FFFFFF',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)'
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999
};

export const typography = {
    // Font sizes
    fontSize: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 18,
        xxl: 24,
        xxxl: 32,
        display: 48
    },

    // Font weights
    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75
    }
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8
    }
};

export const animations = {
    fast: 150,
    normal: 300,
    slow: 500
};

// Export default theme object
export default {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
    animations
};
