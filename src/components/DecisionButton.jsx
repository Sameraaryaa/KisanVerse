// DecisionButton Component - Interactive choice buttons for stories
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { formatCurrency } from '../utils/helpers';

export default function DecisionButton({
    choice,
    option = 'A',
    onPress,
    disabled = false,
    selected = false
}) {
    if (!choice) return null;

    const { textKey, consequences = {} } = choice;

    // Determine if this is a positive, negative, or neutral choice based on consequences
    const getChoiceType = () => {
        const { walletChange = 0, resilienceChange = 0, reputationChange = 0 } = consequences;
        const total = walletChange + (resilienceChange * 50) + (reputationChange * 100);

        if (total > 0) return 'positive';
        if (total < 0) return 'negative';
        return 'neutral';
    };

    const choiceType = getChoiceType();

    return (
        <TouchableOpacity
            style={[
                styles.container,
                choiceType === 'positive' && styles.containerPositive,
                choiceType === 'negative' && styles.containerNegative,
                selected && styles.containerSelected,
                disabled && styles.containerDisabled
            ]}
            onPress={() => onPress && onPress(choice)}
            disabled={disabled}
            activeOpacity={0.8}
        >
            {/* Option Label */}
            <View style={[
                styles.optionBadge,
                choiceType === 'positive' && styles.optionBadgePositive,
                choiceType === 'negative' && styles.optionBadgeNegative
            ]}>
                <Text style={styles.optionText}>Option {option}</Text>
            </View>

            {/* Choice Text */}
            <Text style={styles.choiceText}>{textKey}</Text>

            {/* Consequence Hints */}
            <View style={styles.hintsContainer}>
                {consequences.walletChange !== undefined && consequences.walletChange !== 0 && (
                    <View style={[
                        styles.hint,
                        consequences.walletChange > 0 ? styles.hintPositive : styles.hintNegative
                    ]}>
                        <Text style={styles.hintText}>
                            💰 {consequences.walletChange > 0 ? '+' : ''}{formatCurrency(consequences.walletChange).substring(1)}
                        </Text>
                    </View>
                )}

                {consequences.savingsChange !== undefined && consequences.savingsChange !== 0 && (
                    <View style={[
                        styles.hint,
                        consequences.savingsChange > 0 ? styles.hintPositive : styles.hintNegative
                    ]}>
                        <Text style={styles.hintText}>
                            🏦 {consequences.savingsChange > 0 ? '+' : ''}{formatCurrency(consequences.savingsChange).substring(1)}
                        </Text>
                    </View>
                )}

                {consequences.resilienceChange !== undefined && consequences.resilienceChange !== 0 && (
                    <View style={[
                        styles.hint,
                        consequences.resilienceChange > 0 ? styles.hintPositive : styles.hintNegative
                    ]}>
                        <Text style={styles.hintText}>
                            💪 {consequences.resilienceChange > 0 ? '+' : ''}{consequences.resilienceChange}
                        </Text>
                    </View>
                )}

                {consequences.reputationChange !== undefined && consequences.reputationChange !== 0 && (
                    <View style={[
                        styles.hint,
                        consequences.reputationChange > 0 ? styles.hintPositive : styles.hintNegative
                    ]}>
                        <Text style={styles.hintText}>
                            ⭐ {consequences.reputationChange > 0 ? '+' : ''}{consequences.reputationChange}
                        </Text>
                    </View>
                )}

                {consequences.digitalScoreChange !== undefined && consequences.digitalScoreChange !== 0 && (
                    <View style={[
                        styles.hint,
                        consequences.digitalScoreChange > 0 ? styles.hintPositive : styles.hintNegative
                    ]}>
                        <Text style={styles.hintText}>
                            📱 {consequences.digitalScoreChange > 0 ? '+' : ''}{consequences.digitalScoreChange}
                        </Text>
                    </View>
                )}
            </View>

            {/* Selected Indicator */}
            {selected && (
                <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIcon}>✓</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

// Choice Card for displaying results
export function ChoiceResult({ choice, isPositive = true }) {
    if (!choice) return null;

    return (
        <View style={[
            styles.resultContainer,
            isPositive ? styles.resultPositive : styles.resultNegative
        ]}>
            <Text style={styles.resultIcon}>{isPositive ? '✅' : '⚠️'}</Text>
            <Text style={styles.resultTitle}>
                {isPositive ? 'Good Choice!' : 'Consider This...'}
            </Text>
            <Text style={styles.resultText}>{choice.feedbackTextKey}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: colors.gray400,
        ...shadows.sm,
    },
    containerPositive: {
        borderLeftColor: colors.success,
    },
    containerNegative: {
        borderLeftColor: colors.warning,
    },
    containerSelected: {
        backgroundColor: colors.primaryExtraLight,
        borderLeftColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    containerDisabled: {
        opacity: 0.6,
    },
    optionBadge: {
        alignSelf: 'flex-start',
        backgroundColor: colors.gray200,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginBottom: spacing.sm,
    },
    optionBadgePositive: {
        backgroundColor: '#E8F5E9',
    },
    optionBadgeNegative: {
        backgroundColor: '#FFF3E0',
    },
    optionText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },
    choiceText: {
        fontSize: typography.fontSize.lg,
        color: colors.textPrimary,
        lineHeight: typography.fontSize.lg * 1.4,
        marginBottom: spacing.sm,
    },
    hintsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacing.sm,
    },
    hint: {
        backgroundColor: colors.gray100,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginRight: spacing.sm,
        marginBottom: spacing.xs,
    },
    hintPositive: {
        backgroundColor: '#E8F5E9',
    },
    hintNegative: {
        backgroundColor: '#FFEBEE',
    },
    hintText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    selectedIndicator: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedIcon: {
        color: colors.white,
        fontWeight: typography.fontWeight.bold,
    },

    // Result styles
    resultContainer: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        ...shadows.md,
    },
    resultPositive: {
        borderWidth: 2,
        borderColor: colors.success,
    },
    resultNegative: {
        borderWidth: 2,
        borderColor: colors.warning,
    },
    resultIcon: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    resultTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    resultText: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: typography.fontSize.md * 1.5,
    },
});
