// PriceChart Component - Market price visualization
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { formatCurrency } from '../utils/helpers';
import { t } from '../services/translationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.md * 4;
const CHART_HEIGHT = 120;

export default function PriceChart({
    priceHistory = [],
    currentPrice = 0,
    basePrice = 520,
    cropType = 'rice'
}) {
    // Get price range for scaling
    const prices = priceHistory.map(p => p.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) * 0.9 : basePrice * 0.7;
    const maxPrice = prices.length > 0 ? Math.max(...prices) * 1.1 : basePrice * 1.5;
    const priceRange = maxPrice - minPrice;

    // Calculate point positions
    const getPointPosition = (price, index) => {
        const x = priceHistory.length > 1
            ? (index / (priceHistory.length - 1)) * CHART_WIDTH
            : CHART_WIDTH / 2;
        const y = CHART_HEIGHT - ((price - minPrice) / priceRange) * CHART_HEIGHT;
        return { x, y };
    };

    // Generate SVG path (simplified line chart)
    const generatePoints = () => {
        if (priceHistory.length < 2) return [];

        return priceHistory.map((p, i) => {
            const pos = getPointPosition(p.price, i);
            return { ...pos, price: p.price, day: p.day };
        });
    };

    const points = generatePoints();

    // Determine price trend
    const getTrend = () => {
        if (priceHistory.length < 2) return 'stable';
        const recent = priceHistory[priceHistory.length - 1].price;
        const previous = priceHistory[priceHistory.length - 2].price;
        if (recent > previous * 1.05) return 'up';
        if (recent < previous * 0.95) return 'down';
        return 'stable';
    };

    const trend = getTrend();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{t('currentPrice')}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>{formatCurrency(currentPrice)}</Text>
                        <Text style={styles.perUnit}>{t('perQuintal')}</Text>
                    </View>
                </View>

                <View style={[
                    styles.trendBadge,
                    trend === 'up' && styles.trendUp,
                    trend === 'down' && styles.trendDown
                ]}>
                    <Text style={styles.trendIcon}>
                        {trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️'}
                    </Text>
                    <Text style={[
                        styles.trendText,
                        trend === 'up' && styles.trendTextUp,
                        trend === 'down' && styles.trendTextDown
                    ]}>
                        {trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'}
                    </Text>
                </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
                {/* Price axis labels */}
                <View style={styles.yAxis}>
                    <Text style={styles.axisLabel}>{formatCurrency(maxPrice)}</Text>
                    <Text style={styles.axisLabel}>{formatCurrency((maxPrice + minPrice) / 2)}</Text>
                    <Text style={styles.axisLabel}>{formatCurrency(minPrice)}</Text>
                </View>

                {/* Chart area */}
                <View style={styles.chartArea}>
                    {/* Grid lines */}
                    <View style={[styles.gridLine, { top: 0 }]} />
                    <View style={[styles.gridLine, { top: CHART_HEIGHT / 2 }]} />
                    <View style={[styles.gridLine, { top: CHART_HEIGHT }]} />

                    {/* Base price line */}
                    {basePrice >= minPrice && basePrice <= maxPrice && (
                        <View
                            style={[
                                styles.basePriceLine,
                                { top: CHART_HEIGHT - ((basePrice - minPrice) / priceRange) * CHART_HEIGHT }
                            ]}
                        />
                    )}

                    {/* Line connecting points */}
                    {points.length > 1 && (
                        <View style={styles.lineContainer}>
                            {points.slice(0, -1).map((point, index) => {
                                const nextPoint = points[index + 1];
                                const length = Math.sqrt(
                                    Math.pow(nextPoint.x - point.x, 2) +
                                    Math.pow(nextPoint.y - point.y, 2)
                                );
                                const angle = Math.atan2(
                                    nextPoint.y - point.y,
                                    nextPoint.x - point.x
                                ) * (180 / Math.PI);

                                return (
                                    <View
                                        key={index}
                                        style={[
                                            styles.line,
                                            {
                                                width: length,
                                                left: point.x,
                                                top: point.y,
                                                transform: [{ rotate: `${angle}deg` }]
                                            }
                                        ]}
                                    />
                                );
                            })}
                        </View>
                    )}

                    {/* Data points */}
                    {points.map((point, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dataPoint,
                                { left: point.x - 4, top: point.y - 4 },
                                index === points.length - 1 && styles.dataPointCurrent
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Footer hint */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    💡 {trend === 'down'
                        ? 'Prices are falling. Consider waiting or storing your harvest.'
                        : trend === 'up'
                            ? 'Prices are rising. Good time to sell!'
                            : 'Prices are stable. Market conditions are normal.'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        margin: spacing.md,
        ...shadows.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: typography.fontSize.sm,
        color: colors.textLight,
        marginBottom: spacing.xs,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currentPrice: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    perUnit: {
        fontSize: typography.fontSize.sm,
        color: colors.textLight,
        marginLeft: spacing.xs,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray100,
        borderRadius: borderRadius.round,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    trendUp: {
        backgroundColor: '#E8F5E9',
    },
    trendDown: {
        backgroundColor: '#FFEBEE',
    },
    trendIcon: {
        fontSize: 16,
        marginRight: spacing.xs,
    },
    trendText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textSecondary,
    },
    trendTextUp: {
        color: colors.success,
    },
    trendTextDown: {
        color: colors.danger,
    },
    chartContainer: {
        flexDirection: 'row',
        height: CHART_HEIGHT + spacing.md,
    },
    yAxis: {
        width: 50,
        justifyContent: 'space-between',
        paddingRight: spacing.sm,
    },
    axisLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.textLight,
        textAlign: 'right',
    },
    chartArea: {
        flex: 1,
        height: CHART_HEIGHT,
        position: 'relative',
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: colors.gray200,
    },
    basePriceLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: colors.secondary,
        borderStyle: 'dashed',
    },
    lineContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    line: {
        position: 'absolute',
        height: 2,
        backgroundColor: colors.primary,
        transformOrigin: 'left center',
    },
    dataPoint: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.white,
    },
    dataPointCurrent: {
        backgroundColor: colors.secondary,
        width: 12,
        height: 12,
        borderRadius: 6,
        marginLeft: -2,
        marginTop: -2,
    },
    footer: {
        marginTop: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.gray200,
    },
    footerText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        lineHeight: typography.fontSize.sm * 1.4,
    },
});
