// Farm Simulation Screen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Alert,
    Modal
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { t } from '../services/translationService';
import { gameLogic } from '../services/gameLogic';
import { formatCurrency } from '../utils/helpers';
import { GAME_BALANCE, CROPS } from '../utils/constants';

export default function FarmSimulationScreen({ navigation }) {
    const [gameState, setGameState] = useState(null);
    const [showInsuranceModal, setShowInsuranceModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadState();
    }, []);

    const loadState = () => {
        const state = gameLogic.getState();
        setGameState(state);
    };

    const getCropEmoji = (growthPercent) => {
        if (growthPercent < 25) return '🌱';
        if (growthPercent < 50) return '🌿';
        if (growthPercent < 75) return '🌾';
        return '🌾✨';
    };

    const getHealthColor = (health) => {
        if (health >= 70) return colors.success;
        if (health >= 40) return colors.warning;
        return colors.danger;
    };

    const handleBuySeeds = async (cropType) => {
        const cropConfig = GAME_BALANCE.crops[cropType];
        const currentCash = gameState?.wallet?.cash || 0;

        if (currentCash < cropConfig.seedCost) {
            Alert.alert('Insufficient Cash', `You need ${formatCurrency(cropConfig.seedCost)} to buy ${cropType} seeds.`);
            return;
        }

        Alert.alert(
            'Buy Seeds',
            `Buy ${cropType} seeds for ${formatCurrency(cropConfig.seedCost)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Buy',
                    onPress: async () => {
                        setLoading(true);
                        const result = await gameLogic.buySeeds(cropType);
                        if (result.success) {
                            loadState();
                        }
                        setLoading(false);
                    }
                }
            ]
        );
    };

    const handleApplyFertilizer = async () => {
        const cost = 1500;
        const currentCash = gameState?.wallet?.cash || 0;

        if (currentCash < cost) {
            Alert.alert('Insufficient Cash', `You need ${formatCurrency(cost)} to apply fertilizer.`);
            return;
        }

        setLoading(true);
        const result = await gameLogic.applyFertilizer();
        if (result.success) {
            Alert.alert('Success', 'Fertilizer applied! Crop health improved.');
            loadState();
        }
        setLoading(false);
    };

    const handleBuyInsurance = async () => {
        const cost = GAME_BALANCE.insurance.baseCost;
        const currentCash = gameState?.wallet?.cash || 0;

        if (currentCash < cost) {
            Alert.alert('Insufficient Cash', `You need ${formatCurrency(cost)} for insurance.`);
            return;
        }

        setLoading(true);
        const result = await gameLogic.buyInsurance();
        if (result.success) {
            Alert.alert('Success', `Crop insurance purchased for ${formatCurrency(cost)}!`);
            loadState();
        }
        setLoading(false);
        setShowInsuranceModal(false);
    };

    const handleHarvest = async () => {
        setLoading(true);
        const result = await gameLogic.harvest();
        if (result.success) {
            Alert.alert('Harvest Complete!', `You harvested ${result.yield} quintals!`);
            loadState();
        } else {
            Alert.alert('Cannot Harvest', result.error || 'Please wait for harvest season.');
        }
        setLoading(false);
    };

    // Default state for display
    const state = gameState || {
        seasonStage: 'sowing',
        wallet: { cash: 10000 },
        farm: {
            cropType: 'rice',
            cropHealth: 100,
            growthPercent: 0,
            expectedHarvest: 50,
            insured: false
        }
    };

    const farm = state.farm || {};
    const cropInfo = CROPS.find(c => c.id === farm.cropType) || CROPS[0];

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('farm')}</Text>
                <View style={styles.cashDisplay}>
                    <Text style={styles.cashAmount}>{formatCurrency(state.wallet?.cash || 0)}</Text>
                </View>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Farm Visualization */}
                <View style={styles.farmCard}>
                    <View style={styles.farmHeader}>
                        <Text style={styles.farmTitle}>My Farm</Text>
                        <View style={[
                            styles.insuranceBadge,
                            farm.insured ? styles.insuredBadge : styles.notInsuredBadge
                        ]}>
                            <Text style={styles.insuranceText}>
                                {farm.insured ? '✓ Insured' : 'Not Insured'}
                            </Text>
                        </View>
                    </View>

                    {/* Crop Display */}
                    <View style={styles.cropDisplay}>
                        <Text style={styles.cropEmoji}>{getCropEmoji(farm.growthPercent || 0)}</Text>
                        <Text style={styles.cropName}>{cropInfo.name}</Text>
                        <Text style={styles.cropStage}>
                            {state.seasonStage === 'sowing' ? 'Ready to plant' :
                                state.seasonStage === 'growing' ? 'Growing' :
                                    state.seasonStage === 'harvest' ? 'Ready for harvest' : 'Lean period'}
                        </Text>
                    </View>

                    {/* Growth Progress */}
                    <View style={styles.progressSection}>
                        <Text style={styles.progressLabel}>Growth Progress</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${farm.growthPercent || 0}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{Math.round(farm.growthPercent || 0)}%</Text>
                    </View>

                    {/* Health Bar */}
                    <View style={styles.healthSection}>
                        <Text style={styles.healthLabel}>{t('cropHealth')}</Text>
                        <View style={styles.healthBar}>
                            <View style={[
                                styles.healthFill,
                                { width: `${farm.cropHealth || 0}%`, backgroundColor: getHealthColor(farm.cropHealth) }
                            ]} />
                        </View>
                        <Text style={[styles.healthText, { color: getHealthColor(farm.cropHealth) }]}>
                            {farm.cropHealth || 0}%
                        </Text>
                    </View>

                    {/* Expected Harvest */}
                    <View style={styles.harvestInfo}>
                        <Text style={styles.harvestLabel}>{t('expectedHarvest')}</Text>
                        <Text style={styles.harvestValue}>{farm.expectedHarvest || 0} quintals</Text>
                    </View>
                </View>

                {/* Actions Section */}
                <View style={styles.actionsSection}>
                    <Text style={styles.sectionTitle}>Farm Actions</Text>

                    {/* Seed Selection (if sowing stage) */}
                    {state.seasonStage === 'sowing' && (
                        <View style={styles.actionCard}>
                            <Text style={styles.actionTitle}>🌱 {t('buySeeds')}</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {CROPS.slice(0, 4).map((crop) => (
                                    <TouchableOpacity
                                        key={crop.id}
                                        style={[
                                            styles.seedOption,
                                            farm.cropType === crop.id && styles.seedOptionSelected
                                        ]}
                                        onPress={() => handleBuySeeds(crop.id)}
                                        disabled={loading}
                                    >
                                        <Text style={styles.seedIcon}>{crop.icon}</Text>
                                        <Text style={styles.seedName}>{crop.name}</Text>
                                        <Text style={styles.seedPrice}>
                                            {formatCurrency(GAME_BALANCE.crops[crop.id]?.seedCost || 2000)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Fertilizer (if growing stage) */}
                    {state.seasonStage === 'growing' && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleApplyFertilizer}
                            disabled={loading}
                        >
                            <View style={styles.actionContent}>
                                <Text style={styles.actionIcon}>🧪</Text>
                                <View style={styles.actionText}>
                                    <Text style={styles.actionName}>{t('applyFertilizer')}</Text>
                                    <Text style={styles.actionDesc}>+15% crop health</Text>
                                </View>
                            </View>
                            <Text style={styles.actionPrice}>{formatCurrency(1500)}</Text>
                        </TouchableOpacity>
                    )}

                    {/* Insurance */}
                    {!farm.insured && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => setShowInsuranceModal(true)}
                        >
                            <View style={styles.actionContent}>
                                <Text style={styles.actionIcon}>🛡️</Text>
                                <View style={styles.actionText}>
                                    <Text style={styles.actionName}>{t('buyInsurance')}</Text>
                                    <Text style={styles.actionDesc}>Protect against crop loss</Text>
                                </View>
                            </View>
                            <Text style={styles.actionPrice}>{formatCurrency(GAME_BALANCE.insurance.baseCost)}</Text>
                        </TouchableOpacity>
                    )}

                    {/* Harvest Button */}
                    {state.seasonStage === 'harvest' && (
                        <TouchableOpacity
                            style={styles.harvestButton}
                            onPress={handleHarvest}
                            disabled={loading}
                        >
                            <Text style={styles.harvestButtonText}>🌾 Harvest Now!</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            {/* Insurance Modal */}
            <Modal
                visible={showInsuranceModal}
                transparent
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>🛡️ Crop Insurance</Text>
                        <Text style={styles.modalDesc}>
                            Protect your crops against weather damage and pest attacks.
                        </Text>
                        <View style={styles.modalInfo}>
                            <View style={styles.modalRow}>
                                <Text style={styles.modalLabel}>Cost</Text>
                                <Text style={styles.modalValue}>{formatCurrency(GAME_BALANCE.insurance.baseCost)}</Text>
                            </View>
                            <View style={styles.modalRow}>
                                <Text style={styles.modalLabel}>Coverage</Text>
                                <Text style={styles.modalValue}>{GAME_BALANCE.insurance.coveragePercent}%</Text>
                            </View>
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setShowInsuranceModal(false)}
                            >
                                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalConfirmButton}
                                onPress={handleBuyInsurance}
                            >
                                <Text style={styles.modalConfirmText}>{t('buyInsurance')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
        ...shadows.sm,
    },
    backButton: {
        fontSize: typography.fontSize.lg,
        color: colors.primary,
    },
    headerTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    cashDisplay: {
        backgroundColor: colors.primaryLight,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
    },
    cashAmount: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
    },
    container: {
        flex: 1,
    },
    farmCard: {
        margin: spacing.md,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        ...shadows.md,
    },
    farmHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    farmTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    insuranceBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
    },
    insuredBadge: {
        backgroundColor: '#E8F5E9',
    },
    notInsuredBadge: {
        backgroundColor: '#FFF3E0',
    },
    insuranceText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
    },
    cropDisplay: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    cropEmoji: {
        fontSize: 80,
    },
    cropName: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginTop: spacing.sm,
    },
    cropStage: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    progressSection: {
        marginTop: spacing.md,
    },
    progressLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    progressBar: {
        height: 12,
        backgroundColor: colors.gray200,
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 6,
    },
    progressText: {
        fontSize: typography.fontSize.sm,
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
    healthSection: {
        marginTop: spacing.md,
    },
    healthLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    healthBar: {
        height: 8,
        backgroundColor: colors.gray200,
        borderRadius: 4,
        overflow: 'hidden',
    },
    healthFill: {
        height: '100%',
        borderRadius: 4,
    },
    healthText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
    harvestInfo: {
        marginTop: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray200,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    harvestLabel: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
    },
    harvestValue: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.secondary,
    },
    actionsSection: {
        padding: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    actionCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    actionTitle: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    seedOption: {
        backgroundColor: colors.gray100,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        marginRight: spacing.sm,
        width: 100,
    },
    seedOptionSelected: {
        backgroundColor: colors.primaryLight,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    seedIcon: {
        fontSize: 28,
    },
    seedName: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        marginTop: spacing.xs,
    },
    seedPrice: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
        marginTop: 4,
    },
    actionButton: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 28,
        marginRight: spacing.md,
    },
    actionText: {
        flex: 1,
    },
    actionName: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
    },
    actionDesc: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    actionPrice: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.bold,
        color: colors.secondary,
    },
    harvestButton: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        ...shadows.md,
    },
    harvestButtonText: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
    },
    modalTitle: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    modalDesc: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    modalInfo: {
        backgroundColor: colors.gray100,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    modalLabel: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
    },
    modalValue: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: colors.gray200,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    modalCancelText: {
        fontSize: typography.fontSize.lg,
        color: colors.textSecondary,
    },
    modalConfirmButton: {
        flex: 2,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    modalConfirmText: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
});
