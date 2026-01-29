// Impact Summary Screen
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { t } from '../services/translationService';
import { gameLogic } from '../services/gameLogic';
import { formatCurrency } from '../utils/helpers';

export default function ImpactSummaryScreen({ navigation }) {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const data = gameLogic.getSeasonSummary();
        setSummary(data);
    }, []);

    const getScoreColor = (score) => {
        if (score >= 70) return colors.success;
        if (score >= 40) return colors.warning;
        return colors.danger;
    };

    const s = summary || { season: 'Rabi', totalEarnings: 25000, totalExpenses: 15000, netProfit: 10000, resilienceScore: 65, financialLiteracyScore: 55, digitalAdoptionScore: 40, savingsBuffer: 1.5 };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView style={styles.container}>
                <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.header}>
                    <Text style={styles.emoji}>🎉</Text>
                    <Text style={styles.title}>{t('seasonComplete')}</Text>
                    <Text style={styles.season}>{s.season} Season</Text>
                </LinearGradient>

                {/* Financial Summary */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Financial Summary</Text>
                    <View style={styles.row}><Text>Total Earnings</Text><Text style={styles.positive}>{formatCurrency(s.totalEarnings)}</Text></View>
                    <View style={styles.row}><Text>Total Expenses</Text><Text style={styles.negative}>-{formatCurrency(s.totalExpenses)}</Text></View>
                    <View style={styles.divider} />
                    <View style={styles.row}><Text style={styles.bold}>Net Profit</Text><Text style={[styles.bold, s.netProfit >= 0 ? styles.positive : styles.negative]}>{formatCurrency(s.netProfit)}</Text></View>
                </View>

                {/* Scores */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Your Scores</Text>
                    <View style={styles.scoreItem}>
                        <View style={styles.scoreHeader}><Text>💪 Resilience Score</Text><Text style={[styles.scoreValue, { color: getScoreColor(s.resilienceScore) }]}>{s.resilienceScore}</Text></View>
                        <View style={styles.scoreBar}><View style={[styles.scoreFill, { width: `${s.resilienceScore}%`, backgroundColor: getScoreColor(s.resilienceScore) }]} /></View>
                    </View>
                    <View style={styles.scoreItem}>
                        <View style={styles.scoreHeader}><Text>📚 Financial Literacy</Text><Text style={[styles.scoreValue, { color: getScoreColor(s.financialLiteracyScore) }]}>{s.financialLiteracyScore}</Text></View>
                        <View style={styles.scoreBar}><View style={[styles.scoreFill, { width: `${s.financialLiteracyScore}%`, backgroundColor: getScoreColor(s.financialLiteracyScore) }]} /></View>
                    </View>
                    <View style={styles.scoreItem}>
                        <View style={styles.scoreHeader}><Text>📱 Digital Adoption</Text><Text style={[styles.scoreValue, { color: getScoreColor(s.digitalAdoptionScore) }]}>{s.digitalAdoptionScore}</Text></View>
                        <View style={styles.scoreBar}><View style={[styles.scoreFill, { width: `${s.digitalAdoptionScore}%`, backgroundColor: getScoreColor(s.digitalAdoptionScore) }]} /></View>
                    </View>
                </View>

                {/* Savings Buffer */}
                <View style={styles.bufferCard}>
                    <Text style={styles.bufferIcon}>🛡️</Text>
                    <Text style={styles.bufferTitle}>Savings Buffer</Text>
                    <Text style={styles.bufferValue}>{s.savingsBuffer.toFixed(1)} months</Text>
                    <Text style={styles.bufferDesc}>of emergency funds</Text>
                </View>

                {/* Continue Button */}
                <TouchableOpacity style={styles.continueBtn} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.continueText}>Continue to Next Season →</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1 },
    header: { padding: spacing.xl, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    emoji: { fontSize: 60 },
    title: { fontSize: 28, fontWeight: 'bold', color: colors.white, marginTop: spacing.md },
    season: { fontSize: 18, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs },
    card: { backgroundColor: colors.white, margin: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg, ...shadows.md },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
    positive: { color: colors.success, fontWeight: 'bold' },
    negative: { color: colors.danger },
    bold: { fontWeight: 'bold' },
    divider: { height: 1, backgroundColor: colors.gray200, marginVertical: spacing.sm },
    scoreItem: { marginBottom: spacing.md },
    scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    scoreValue: { fontWeight: 'bold' },
    scoreBar: { height: 8, backgroundColor: colors.gray200, borderRadius: 4, overflow: 'hidden' },
    scoreFill: { height: '100%', borderRadius: 4 },
    bufferCard: { backgroundColor: '#E3F2FD', margin: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center' },
    bufferIcon: { fontSize: 40 },
    bufferTitle: { fontSize: 16, color: colors.textSecondary, marginTop: spacing.sm },
    bufferValue: { fontSize: 32, fontWeight: 'bold', color: colors.accent },
    bufferDesc: { fontSize: 14, color: colors.textSecondary },
    continueBtn: { backgroundColor: colors.primary, margin: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg, alignItems: 'center', ...shadows.md },
    continueText: { fontSize: 18, fontWeight: 'bold', color: colors.white }
});
