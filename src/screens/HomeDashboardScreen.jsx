// Home Dashboard Screen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    RefreshControl,
    StatusBar
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { t } from '../services/translationService';
import { gameLogic } from '../services/gameLogic';
import storageManager from '../services/storageManager';
import WalletDisplay from '../components/WalletDisplay';
import SeasonProgress from '../components/SeasonProgress';
import { AlertList } from '../components/AlertBanner';

export default function HomeDashboardScreen({ navigation }) {
    const [gameState, setGameState] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadGameState();
    }, []);

    const loadGameState = async () => {
        try {
            const userId = await storageManager.getUserId();
            if (userId) {
                await gameLogic.init(userId);
                const state = gameLogic.getState();
                setGameState(state);

                if (state) {
                    generateAlerts(state);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading game state:', error);
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadGameState();
        setRefreshing(false);
    };

    const generateAlerts = (state) => {
        const newAlerts = [];

        // Low cash warning
        if (state.wallet.cash < 2000) {
            newAlerts.push({
                type: 'warning',
                icon: '⚠️',
                message: t('lowCashWarning'),
                action: 'market'
            });
        }

        // Upcoming expense
        if (state.seasonDay >= 35 && state.seasonDay <= 45 && state.seasonStage === 'growing') {
            newAlerts.push({
                type: 'info',
                icon: '📢',
                message: t('fertilizerNeeded') + ' - ₹1,500',
                action: 'farm'
            });
        }

        // Insurance reminder
        if (!state.farm.insured && state.seasonStage === 'growing') {
            newAlerts.push({
                type: 'alert',
                icon: '☔',
                message: t('monsoonWarning'),
                action: 'insurance'
            });
        }

        // Cooperative activity
        if (state.seasonDay % 7 === 0) {
            newAlerts.push({
                type: 'info',
                icon: '👥',
                message: t('coopMeeting'),
                action: 'cooperative'
            });
        }

        setAlerts(newAlerts);
    };

    const handleAlertPress = (alert) => {
        if (alert.action === 'market') navigation.navigate('Market');
        if (alert.action === 'farm') navigation.navigate('Farm');
        if (alert.action === 'cooperative') navigation.navigate('Cooperative');
        if (alert.action === 'insurance') navigation.navigate('Farm');
    };

    const advanceDay = async () => {
        const result = await gameLogic.advanceDay();
        if (result) {
            setGameState(result.state);
            generateAlerts(result.state);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={styles.loadingText}>{t('loading')}</Text>
            </SafeAreaView>
        );
    }

    // Default state for demo
    const state = gameState || {
        currentSeason: 'rabi',
        seasonDay: 1,
        seasonStage: 'sowing',
        wallet: { cash: 10000, savings: 5000, coopBalance: 0, debt: 0 },
        farm: { cropType: 'rice', cropHealth: 100, growthPercent: 0 }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
                bounces={true}
                overScrollMode="always"
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.greeting}>🌾 KisanVerse</Text>
                        <Text style={styles.seasonText}>
                            {state.currentSeason.toUpperCase()} | {t('day')} {state.seasonDay}/120
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Text style={styles.settingsIcon}>⚙️</Text>
                    </TouchableOpacity>
                </View>

                {/* Financial Overview */}
                <WalletDisplay wallet={state.wallet} />

                {/* Season Progress */}
                <SeasonProgress
                    season={state.currentSeason}
                    stage={state.seasonStage}
                    day={state.seasonDay}
                    totalDays={120}
                    cropType={state.farm?.cropType}
                    cropHealth={state.farm?.cropHealth}
                    growthPercent={state.farm?.growthPercent}
                />

                {/* Alerts */}
                {alerts.length > 0 && (
                    <AlertList
                        alerts={alerts}
                        onPress={handleAlertPress}
                    />
                )}

                {/* Quick Actions */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>

                <View style={styles.actionsGrid}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                        onPress={() => navigation.navigate('Farm')}
                    >
                        <Text style={styles.actionIcon}>🚜</Text>
                        <Text style={styles.actionLabel}>{t('farm')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
                        onPress={() => navigation.navigate('Market')}
                    >
                        <Text style={styles.actionIcon}>🏪</Text>
                        <Text style={styles.actionLabel}>{t('market')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
                        onPress={() => navigation.navigate('Stories')}
                    >
                        <Text style={styles.actionIcon}>📖</Text>
                        <Text style={styles.actionLabel}>{t('stories')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#9C27B0' }]}
                        onPress={() => navigation.navigate('Cooperative')}
                    >
                        <Text style={styles.actionIcon}>👥</Text>
                        <Text style={styles.actionLabel}>{t('cooperative')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Advance Day Button (for demo) */}
                <View style={styles.advanceContainer}>
                    <TouchableOpacity
                        style={styles.advanceButton}
                        onPress={advanceDay}
                    >
                        <Text style={styles.advanceText}>⏭️ Advance to Next Day</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        fontSize: typography.fontSize.lg,
        color: colors.textSecondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.white,
        ...shadows.sm,
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
    seasonText: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    settingsButton: {
        padding: spacing.sm,
    },
    settingsIcon: {
        fontSize: 24,
    },
    sectionHeader: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: spacing.sm,
        justifyContent: 'space-between',
    },
    actionButton: {
        width: '48%',
        aspectRatio: 1.2,
        borderRadius: borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.md,
    },
    actionIcon: {
        fontSize: 40,
        marginBottom: spacing.sm,
    },
    actionLabel: {
        color: colors.white,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
    },
    advanceContainer: {
        padding: spacing.md,
    },
    advanceButton: {
        backgroundColor: colors.secondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    advanceText: {
        color: colors.white,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
    },
});
