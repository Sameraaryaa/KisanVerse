// Market Screen - Simplified
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, Modal, TextInput } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { t } from '../services/translationService';
import { gameLogic } from '../services/gameLogic';
import { formatCurrency } from '../utils/helpers';
import PriceChart from '../components/PriceChart';

export default function MarketScreen({ navigation }) {
    const [gameState, setGameState] = useState(null);
    const [showSellModal, setShowSellModal] = useState(false);
    const [sellQuantity, setSellQuantity] = useState('');
    const [useDigitalPayment, setUseDigitalPayment] = useState(false);

    useEffect(() => { loadState(); }, []);
    const loadState = () => setGameState(gameLogic.getState());

    const handleSell = async () => {
        const qty = parseFloat(sellQuantity);
        if (isNaN(qty) || qty <= 0) return Alert.alert('Invalid', 'Enter valid quantity');
        const result = await gameLogic.sellHarvest(qty, useDigitalPayment);
        if (result.success) {
            Alert.alert('Sold!', `Received ${formatCurrency(result.amount)}`);
            loadState();
            setShowSellModal(false);
        }
    };

    const state = gameState || { market: { currentPrice: 520, priceHistory: [], harvestQuantity: 0, storedQuantity: 0 }, wallet: { cash: 10000 } };
    const market = state.market || {};
    const available = (market.harvestQuantity || 0) + (market.storedQuantity || 0);

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
                <Text style={styles.title}>{t('market')}</Text>
                <Text style={styles.cash}>{formatCurrency(state.wallet?.cash || 0)}</Text>
            </View>
            <ScrollView style={styles.container}>
                <PriceChart priceHistory={market.priceHistory || []} currentPrice={market.currentPrice || 520} />
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Your Inventory</Text>
                    <View style={styles.row}>
                        <View style={styles.item}><Text style={styles.icon}>🌾</Text><Text>Harvest: {market.harvestQuantity || 0} q</Text></View>
                        <View style={styles.item}><Text style={styles.icon}>🏠</Text><Text>Stored: {market.storedQuantity || 0} q</Text></View>
                    </View>
                    <Text style={styles.value}>Value: {formatCurrency(available * (market.currentPrice || 520))}</Text>
                </View>
                <TouchableOpacity style={styles.sellBtn} onPress={() => setShowSellModal(true)} disabled={available <= 0}>
                    <Text style={styles.sellText}>💰 Sell Now - {formatCurrency(market.currentPrice || 520)}/quintal</Text>
                </TouchableOpacity>
                <View style={styles.tips}><Text style={styles.tipsTitle}>💡 Tips</Text><Text>• Prices LOW at harvest (Day 90-120){'\n'}• Prices HIGH in lean period{'\n'}• Digital payments: +5% bonus</Text></View>
            </ScrollView>
            <Modal visible={showSellModal} transparent animationType="slide">
                <View style={styles.overlay}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Sell Harvest</Text>
                        <Text>Available: {available} quintals</Text>
                        <TextInput style={styles.input} value={sellQuantity} onChangeText={setSellQuantity} placeholder="Quantity" keyboardType="numeric" />
                        <TouchableOpacity onPress={() => setSellQuantity(available.toString())}><Text style={styles.link}>Sell All</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.toggle} onPress={() => setUseDigitalPayment(!useDigitalPayment)}>
                            <View style={[styles.box, useDigitalPayment && styles.boxActive]}>{useDigitalPayment && <Text style={styles.check}>✓</Text>}</View>
                            <Text>📱 Digital Payment (+5%)</Text>
                        </TouchableOpacity>
                        <View style={styles.btns}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowSellModal(false)}><Text>Cancel</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleSell}><Text style={styles.white}>Confirm</Text></TouchableOpacity>
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
    cash: { color: colors.primary, fontWeight: 'bold' },
    container: { flex: 1 },
    card: { backgroundColor: colors.white, margin: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg, ...shadows.md },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-around' },
    item: { alignItems: 'center' },
    icon: { fontSize: 28 },
    value: { textAlign: 'center', marginTop: spacing.md, fontSize: 20, fontWeight: 'bold', color: colors.secondary },
    sellBtn: { backgroundColor: colors.secondary, margin: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center' },
    sellText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
    tips: { backgroundColor: '#FFF8E1', margin: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg },
    tipsTitle: { fontWeight: 'bold', marginBottom: spacing.sm },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modal: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: spacing.lg },
    modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: spacing.md },
    input: { borderWidth: 1, borderColor: colors.gray300, borderRadius: 8, padding: spacing.md, marginVertical: spacing.sm, fontSize: 18, textAlign: 'center' },
    link: { color: colors.primary, textAlign: 'center', marginBottom: spacing.md },
    toggle: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, backgroundColor: colors.gray100, borderRadius: 8, marginBottom: spacing.md },
    box: { width: 24, height: 24, borderWidth: 2, borderColor: colors.gray400, borderRadius: 4, marginRight: spacing.md, justifyContent: 'center', alignItems: 'center' },
    boxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    check: { color: colors.white, fontWeight: 'bold' },
    btns: { flexDirection: 'row', gap: spacing.md },
    cancelBtn: { flex: 1, backgroundColor: colors.gray200, padding: spacing.md, borderRadius: 8, alignItems: 'center' },
    confirmBtn: { flex: 2, backgroundColor: colors.secondary, padding: spacing.md, borderRadius: 8, alignItems: 'center' },
    white: { color: colors.white, fontWeight: 'bold' }
});
