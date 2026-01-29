// SeasonProgress Component - Shows season timeline and crop stage
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../styles/theme';
import { SEASON_STAGES, SEASONS } from '../utils/constants';
import { t } from '../services/translationService';

export default function SeasonProgress({
    season = 'rabi',
    stage = 'sowing',
    day = 1,
    totalDays = 120,
    cropType = 'rice',
    cropHealth = 100,
    growthPercent = 0
}) {
    const seasonInfo = SEASONS[season] || SEASONS.rabi;
    const progress = (day / totalDays) * 100;

    // Get stage info
    const stages = ['sowing', 'growing', 'harvest'];
    const currentStageIndex = stages.indexOf(stage);

    // Crop stage emojis
    const getCropEmoji = () => {
        if (growthPercent < 25) return '🌱';
        if (growthPercent < 50) return '🌿';
        if (growthPercent < 75) return '🌾';
        return '🌾✨';
    };

    return (
        <View style={styles.container}>
            {/* Season Header */}
            <View style={styles.header}>
                <View style={styles.seasonInfo}>
                    <Text style={styles.seasonIcon}>{seasonInfo.icon}</Text>
                    <View>
                        <Text style={styles.seasonName}>{seasonInfo.name} {t('season')}</Text>
                        <Text style={styles.seasonMonths}>{seasonInfo.months}</Text>
                    </View>
                </View>
                <View style={styles.dayInfo}>
                    <Text style={styles.dayNumber}>{t('day')} {day}</Text>
                    <Text style={styles.dayTotal}>/ {totalDays}</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>

                {/* Stage Markers */}
                <View style={styles.stageMarkers}>
                    {stages.map((s, index) => {
                        const stageInfo = SEASON_STAGES[s];
                        const isActive = index <= currentStageIndex;
                        const isCurrent = s === stage;

                        return (
                            <View key={s} style={styles.stageMarker}>
                                <View style={[
                                    styles.markerDot,
                                    isActive && styles.markerDotActive,
                                    isCurrent && styles.markerDotCurrent
                                ]} />
                                <Text style={[
                                    styles.stageName,
                                    isActive && styles.stageNameActive,
                                    isCurrent && styles.stageNameCurrent
                                ]}>
                                    {stageInfo.name}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Crop Status */}
            <View style={styles.cropStatus}>
                <View style={styles.cropInfo}>
                    <Text style={styles.cropEmoji}>{getCropEmoji()}</Text>
                    <View>
                        <Text style={styles.cropLabel}>Crop Growth</Text>
                        <Text style={styles.cropPercent}>{Math.round(growthPercent)}%</Text>
                    </View>
                </View>

                <View style={styles.healthInfo}>
                    <Text style={styles.healthLabel}>{t('cropHealth')}</Text>
                    <View style={styles.healthBar}>
                        <View style={[
                            styles.healthFill,
                            { width: `${cropHealth}%` },
                            cropHealth < 50 && styles.healthLow,
                            cropHealth < 25 && styles.healthCritical
                        ]} />
                    </View>
                    <Text style={[
                        styles.healthPercent,
                        cropHealth < 50 && styles.healthTextLow,
                        cropHealth < 25 && styles.healthTextCritical
                    ]}>
                        {cropHealth}%
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginTop: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    seasonInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seasonIcon: {
        fontSize: 32,
        marginRight: spacing.sm,
    },
    seasonName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    seasonMonths: {
        fontSize: typography.fontSize.sm,
        color: colors.textLight,
    },
    dayInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    dayNumber: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
    dayTotal: {
        fontSize: typography.fontSize.md,
        color: colors.textLight,
    },
    progressContainer: {
        marginBottom: spacing.md,
    },
    progressTrack: {
        height: 8,
        backgroundColor: colors.gray200,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    stageMarkers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.sm,
    },
    stageMarker: {
        alignItems: 'center',
    },
    markerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.gray300,
        marginBottom: 4,
    },
    markerDotActive: {
        backgroundColor: colors.primaryLight,
    },
    markerDotCurrent: {
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.primaryDark,
    },
    stageName: {
        fontSize: typography.fontSize.xs,
        color: colors.textLight,
    },
    stageNameActive: {
        color: colors.textSecondary,
    },
    stageNameCurrent: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    cropStatus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray200,
    },
    cropInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cropEmoji: {
        fontSize: 32,
        marginRight: spacing.sm,
    },
    cropLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.textLight,
    },
    cropPercent: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
    healthInfo: {
        alignItems: 'flex-end',
    },
    healthLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.textLight,
        marginBottom: 4,
    },
    healthBar: {
        width: 80,
        height: 8,
        backgroundColor: colors.gray200,
        borderRadius: 4,
        overflow: 'hidden',
    },
    healthFill: {
        height: '100%',
        backgroundColor: colors.success,
        borderRadius: 4,
    },
    healthLow: {
        backgroundColor: colors.warning,
    },
    healthCritical: {
        backgroundColor: colors.danger,
    },
    healthPercent: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        color: colors.success,
        marginTop: 4,
    },
    healthTextLow: {
        color: colors.warning,
    },
    healthTextCritical: {
        color: colors.danger,
    },
});
