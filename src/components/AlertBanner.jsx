// AlertBanner Component - Contextual alerts and notifications
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../styles/theme';

export default function AlertBanner({ alert, onPress, onDismiss }) {
    if (!alert) return null;

    const { type = 'info', icon = 'ℹ️', message, action } = alert;

    // Get style based on alert type
    const getAlertStyle = () => {
        switch (type) {
            case 'warning':
                return {
                    container: styles.warningContainer,
                    text: styles.warningText,
                    border: styles.warningBorder,
                };
            case 'alert':
            case 'danger':
                return {
                    container: styles.dangerContainer,
                    text: styles.dangerText,
                    border: styles.dangerBorder,
                };
            case 'success':
                return {
                    container: styles.successContainer,
                    text: styles.successText,
                    border: styles.successBorder,
                };
            case 'info':
            default:
                return {
                    container: styles.infoContainer,
                    text: styles.infoText,
                    border: styles.infoBorder,
                };
        }
    };

    const alertStyles = getAlertStyle();

    return (
        <TouchableOpacity
            style={[styles.container, alertStyles.container, alertStyles.border]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.content}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={[styles.message, alertStyles.text]} numberOfLines={2}>
                    {message}
                </Text>
            </View>

            {action && (
                <View style={styles.actionContainer}>
                    <Text style={[styles.actionText, alertStyles.text]}>→</Text>
                </View>
            )}

            {onDismiss && (
                <TouchableOpacity
                    style={styles.dismissButton}
                    onPress={onDismiss}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Text style={styles.dismissIcon}>✕</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
}

// Alert List Component for multiple alerts
export function AlertList({ alerts = [], onPress, onDismiss }) {
    if (!alerts || alerts.length === 0) return null;

    return (
        <View style={styles.listContainer}>
            {alerts.map((alert, index) => (
                <AlertBanner
                    key={`alert-${index}`}
                    alert={alert}
                    onPress={() => onPress && onPress(alert)}
                    onDismiss={() => onDismiss && onDismiss(alert, index)}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
        borderLeftWidth: 4,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    message: {
        flex: 1,
        fontSize: typography.fontSize.md,
        lineHeight: typography.fontSize.md * 1.4,
    },
    actionContainer: {
        marginLeft: spacing.sm,
    },
    actionText: {
        fontSize: 18,
        fontWeight: typography.fontWeight.bold,
    },
    dismissButton: {
        marginLeft: spacing.sm,
        padding: spacing.xs,
    },
    dismissIcon: {
        fontSize: 14,
        color: colors.textLight,
    },
    listContainer: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },

    // Info style
    infoContainer: {
        backgroundColor: '#E3F2FD',
    },
    infoText: {
        color: '#1565C0',
    },
    infoBorder: {
        borderLeftColor: '#2196F3',
    },

    // Warning style
    warningContainer: {
        backgroundColor: '#FFF8E1',
    },
    warningText: {
        color: '#F57C00',
    },
    warningBorder: {
        borderLeftColor: '#FF9800',
    },

    // Danger/Alert style
    dangerContainer: {
        backgroundColor: '#FFEBEE',
    },
    dangerText: {
        color: '#C62828',
    },
    dangerBorder: {
        borderLeftColor: '#F44336',
    },

    // Success style
    successContainer: {
        backgroundColor: '#E8F5E9',
    },
    successText: {
        color: '#2E7D32',
    },
    successBorder: {
        borderLeftColor: '#4CAF50',
    },
});
