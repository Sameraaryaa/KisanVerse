// Cooperative Screen
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, Modal, TextInput } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { t } from '../services/translationService';
import { gameLogic } from '../services/gameLogic';
import { formatCurrency, calculateLoanEligibility } from '../utils/helpers';
import { CREDIT_OPTIONS } from '../utils/constants';

export default function CooperativeScreen({ navigation }) {
    const [gameState, setGameState] = useState(null);
    const [showLoanModal, setShowLoanModal] = useState(false);
    const [loanAmount, setLoanAmount] = useState('');
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [contributeAmount, setContributeAmount] = useState('');

    useEffect(() => { loadState(); }, []);
    const loadState = () => setGameState(gameLogic.getState());

    const handleContribute = async () => {
        const amt = parseFloat(contributeAmount);
        if (isNaN(amt) || amt <= 0) return Alert.alert('Invalid', 'Enter valid amount');
        const result = await gameLogic.contributeToCooperative(amt);
        if (result.success) {
            Alert.alert('Success', `Contributed ${formatCurrency(amt)} to cooperative!`);
            loadState();
            setShowContributeModal(false);
        }
    };

    const handleLoanRequest = async () => {
        const amt = parseFloat(loanAmount);
        if (isNaN(amt) || amt <= 0) return Alert.alert('Invalid', 'Enter valid amount');
        const result = await gameLogic.takeLoan(amt, 'cooperative');
        if (result.success) {
            Alert.alert('Loan Approved', `Received ${formatCurrency(amt)} at ${result.interestRate}% interest`);
            loadState();
            setShowLoanModal(false);
        } else {
            Alert.alert('Denied', result.error || 'Loan request failed');
        }
    };

    const state = gameState || { cooperative: { savingsBalance: 0, reputation: 3, weeklyContribution: 100, activeLoan: null }, wallet: { cash: 10000 } };
    const coop = state.cooperative || {};
    const maxLoan = calculateLoanEligibility(coop.savingsBalance || 0, coop.reputation || 3);

    const renderStars = (rating) => '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '✨' : '');

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
                <Text style={styles.title}>{t('cooperative')}</Text>
                <View style={{ width: 50 }} />
            </View>
            <ScrollView style={styles.container}>
                {/* Overview Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardIcon}>👥</Text>
                        <View><Text style={styles.cardTitle}>Village Cooperative</Text><Text style={styles.cardSub}>सहकारी समिति</Text></View>
                    </View>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}><Text style={styles.statLabel}>{t('coopSavings')}</Text><Text style={styles.statValue}>{formatCurrency(coop.savingsBalance || 0)}</Text></View>
                        <View style={styles.stat}><Text style={styles.statLabel}>{t('reputation')}</Text><Text style={styles.statValue}>{renderStars(coop.reputation || 3)}</Text></View>
                    </View>
                </View>

                {/* Active Loan */}
                {coop.activeLoan && (
                    <View style={styles.loanCard}>
                        <Text style={styles.loanTitle}>📝 Active Loan</Text>
                        <View style={styles.loanRow}><Text>Amount:</Text><Text style={styles.bold}>{formatCurrency(coop.activeLoan.amount)}</Text></View>
                        <View style={styles.loanRow}><Text>Interest:</Text><Text>{coop.activeLoan.interestRate}%</Text></View>
                        <View style={styles.loanRow}><Text>Days Left:</Text><Text>{coop.activeLoan.daysRemaining}</Text></View>
                    </View>
                )}

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.actionBtn, styles.contributeBtn]} onPress={() => setShowContributeModal(true)}>
                        <Text style={styles.actionIcon}>💰</Text>
                        <View><Text style={styles.actionTitle}>Contribute Savings</Text><Text style={styles.actionSub}>Build your savings & reputation</Text></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionBtn, styles.loanBtn]} onPress={() => setShowLoanModal(true)} disabled={!!coop.activeLoan}>
                        <Text style={styles.actionIcon}>🏦</Text>
                        <View><Text style={styles.actionTitle}>{t('requestLoan')}</Text><Text style={styles.actionSub}>Max: {formatCurrency(maxLoan)} at 6%</Text></View>
                    </TouchableOpacity>
                </View>

                {/* Benefits */}
                <View style={styles.benefits}>
                    <Text style={styles.benefitsTitle}>💡 Cooperative Benefits</Text>
                    <Text style={styles.benefit}>• Low interest loans (6% vs 25% moneylender)</Text>
                    <Text style={styles.benefit}>• Better market prices (5-8% bonus)</Text>
                    <Text style={styles.benefit}>• Emergency fund access</Text>
                    <Text style={styles.benefit}>• Collective bargaining power</Text>
                </View>
            </ScrollView>

            {/* Contribute Modal */}
            <Modal visible={showContributeModal} transparent animationType="slide">
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>💰 Contribute to Savings</Text>
                        <Text style={styles.modalInfo}>Current Balance: {formatCurrency(coop.savingsBalance || 0)}</Text>
                        <TextInput style={styles.input} value={contributeAmount} onChangeText={setContributeAmount} placeholder="Enter amount" keyboardType="numeric" />
                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowContributeModal(false)}><Text>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleContribute}><Text style={styles.white}>Contribute</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Loan Modal */}
            <Modal visible={showLoanModal} transparent animationType="slide">
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>🏦 Request Loan</Text>
                        <Text style={styles.modalInfo}>Maximum Eligible: {formatCurrency(maxLoan)}</Text>
                        <Text style={styles.modalInfo}>Interest Rate: 6% (cooperative rate)</Text>
                        <TextInput style={styles.input} value={loanAmount} onChangeText={setLoanAmount} placeholder="Enter amount" keyboardType="numeric" />
                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLoanModal(false)}><Text>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleLoanRequest}><Text style={styles.white}>Request</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, backgroundColor: colors.white, ...shadows.sm },
    back: { fontSize: 16, color: colors.primary },
    title: { fontSize: 20, fontWeight: 'bold' },
    container: { flex: 1 },
    card: { backgroundColor: colors.white, margin: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg, ...shadows.md },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
    cardIcon: { fontSize: 40, marginRight: spacing.md },
    cardTitle: { fontSize: 20, fontWeight: 'bold' },
    cardSub: { color: colors.textSecondary },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray200 },
    stat: { alignItems: 'center' },
    statLabel: { fontSize: 12, color: colors.textSecondary },
    statValue: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
    loanCard: { backgroundColor: '#FFF3E0', margin: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg },
    loanTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: spacing.sm },
    loanRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    bold: { fontWeight: 'bold' },
    actions: { padding: spacing.md },
    actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, ...shadows.sm },
    contributeBtn: { borderLeftWidth: 4, borderLeftColor: colors.primary },
    loanBtn: { borderLeftWidth: 4, borderLeftColor: colors.accent },
    actionIcon: { fontSize: 28, marginRight: spacing.md },
    actionTitle: { fontSize: 16, fontWeight: 'bold' },
    actionSub: { fontSize: 12, color: colors.textSecondary },
    benefits: { backgroundColor: '#E8F5E9', margin: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg },
    benefitsTitle: { fontWeight: 'bold', marginBottom: spacing.sm },
    benefit: { fontSize: 14, marginBottom: 4 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modal: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg },
    modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: spacing.md },
    modalInfo: { textAlign: 'center', marginBottom: spacing.sm, color: colors.textSecondary },
    input: { borderWidth: 1, borderColor: colors.gray300, borderRadius: 8, padding: spacing.md, marginVertical: spacing.md, fontSize: 18, textAlign: 'center' },
    btns: { flexDirection: 'row', gap: spacing.md },
    cancelBtn: { flex: 1, backgroundColor: colors.gray200, padding: spacing.md, borderRadius: 8, alignItems: 'center' },
    confirmBtn: { flex: 2, backgroundColor: colors.primary, padding: spacing.md, borderRadius: 8, alignItems: 'center' },
    white: { color: colors.white, fontWeight: 'bold' }
});
