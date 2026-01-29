// WalletDisplay Component - Shows financial overview
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { formatCurrency } from '../utils/helpers';
import { t } from '../services/translationService';

export default function WalletDisplay({ wallet }) {
    if (!wallet) return null;

    const { cash = 0, savings = 0, coopBalance = 0, debt = 0 } = wallet;
    const netWorth = cash + savings + coopBalance - debt;

    return (
        <View style={styles.container}>
            {/* Main Wallet Card */}
            <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainCard}
            >
                <Text style={styles.walletLabel}>{t('wallet')}</Text>
                <Text style={styles.totalAmount}>{formatCurrency(netWorth)}</Text>
                <Text style={styles.netWorthLabel}>Net Worth</Text>
            </LinearGradient>

            {/* Breakdown Cards */}
            <View style={styles.breakdownContainer}>
                {/* Cash */}
                <View style={[styles.breakdownCard, styles.cashCard]}>
                    <Text style={styles.breakdownIcon}>💵</Text>
                    <Text style={styles.breakdownLabel}>{t('cash')}</Text>
                    <Text style={styles.breakdownAmount}>{formatCurrency(cash)}</Text>
                </View>

                {/* Savings */}
                <View style={[styles.breakdownCard, styles.savingsCard]}>
                    <Text style={styles.breakdownIcon}>🏦</Text>
                    <Text style={styles.breakdownLabel}>{t('savings')}</Text>
                    <Text style={styles.breakdownAmount}>{formatCurrency(savings)}</Text>
                </View>

                {/* Cooperative Balance */}
                <View style={[styles.breakdownCard, styles.coopCard]}>
                    <Text style={styles.breakdownIcon}>👥</Text>
                    <Text style={styles.breakdownLabel}>Co-op</Text>
                    <Text style={styles.breakdownAmount}>{formatCurrency(coopBalance)}</Text>
                </View>

                {/* Debt */}
                <View style={[styles.breakdownCard, styles.debtCard]}>
                    <Text style={styles.breakdownIcon}>📝</Text>
                    <Text style={styles.breakdownLabel}>{t('debt')}</Text>
                    <Text style={[styles.breakdownAmount, debt > 0 && styles.debtAmount]}>
                        {debt > 0 ? `-${formatCurrency(debt).substring(1)}` : formatCurrency(0)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
    },
    mainCard: {
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
        ...shadows.lg,
    },
    walletLabel: {
        fontSize: typography.fontSize.md,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: spacing.xs,
    },
    totalAmount: {
        fontSize: typography.fontSize.xxxl,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    netWorthLabel: {
        fontSize: typography.fontSize.sm,
        color: 'rgba(255,255,255,0.7)',
        marginTop: spacing.xs,
    },
    breakdownContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacing.md,
        marginHorizontal: -spacing.xs,
    },
    breakdownCard: {
        width: '48%',
        marginHorizontal: '1%',
        marginBottom: spacing.sm,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    cashCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    savingsCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#2196F3',
    },
    coopCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#9C27B0',
    },
    debtCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#F44336',
    },
    breakdownIcon: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    breakdownLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.textLight,
        marginBottom: spacing.xs,
    },
    breakdownAmount: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    debtAmount: {
        color: colors.danger,
    },
});
