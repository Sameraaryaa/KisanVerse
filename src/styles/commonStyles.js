// KisanVerse Common Styles
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from './theme';

export const commonStyles = StyleSheet.create({
    // Layout
    container: {
        flex: 1,
        backgroundColor: colors.background
    },

    containerCentered: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center'
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    rowSpaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    // Cards
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        ...shadows.md
    },

    cardSmall: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        ...shadows.sm
    },

    // Buttons
    buttonPrimary: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm
    },

    buttonSecondary: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm
    },

    buttonOutline: {
        backgroundColor: 'transparent',
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.primary,
        paddingVertical: spacing.md - 2,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center'
    },

    buttonText: {
        color: colors.textWhite,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold
    },

    buttonTextOutline: {
        color: colors.primary,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold
    },

    // Typography
    title: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary
    },

    subtitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary
    },

    heading: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary
    },

    body: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.md * typography.lineHeight.normal
    },

    caption: {
        fontSize: typography.fontSize.sm,
        color: colors.textLight
    },

    // Inputs
    input: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.gray300,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        fontSize: typography.fontSize.lg,
        color: colors.textPrimary
    },

    inputFocused: {
        borderColor: colors.primary,
        borderWidth: 2
    },

    // Badges
    badge: {
        backgroundColor: colors.danger,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center'
    },

    badgeText: {
        color: colors.textWhite,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold
    },

    // Dividers
    divider: {
        height: 1,
        backgroundColor: colors.gray200,
        marginVertical: spacing.md
    },

    // Icons
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center'
    },

    iconCircleSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center'
    },

    // Loading
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.overlay,
        alignItems: 'center',
        justifyContent: 'center'
    },

    // Shadows
    shadowSmall: shadows.sm,
    shadowMedium: shadows.md,
    shadowLarge: shadows.lg
});

export default commonStyles;
