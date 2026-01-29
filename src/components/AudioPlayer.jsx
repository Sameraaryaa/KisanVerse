// AudioPlayer Component - Audio playback controls
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';

export default function AudioPlayer({
    isPlaying = false,
    isLoading = false,
    progress = 0,
    duration = 0,
    onPlay,
    onPause,
    onReplay,
    onShowTranscript,
    showTranscriptButton = true
}) {
    const [localProgress, setLocalProgress] = useState(progress);

    useEffect(() => {
        setLocalProgress(progress);
    }, [progress]);

    const formatTime = (milliseconds) => {
        if (!milliseconds || isNaN(milliseconds)) return '0:00';

        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercent = duration > 0 ? (localProgress / duration) * 100 : 0;

    return (
        <View style={styles.container}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(localProgress)}</Text>
                    <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
            </View>

            {/* Controls */}
            <View style={styles.controlsContainer}>
                {/* Replay Button */}
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={onReplay}
                    disabled={isLoading}
                >
                    <Text style={styles.controlIcon}>⏮️</Text>
                </TouchableOpacity>

                {/* Play/Pause Button */}
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={isPlaying ? onPause : onPlay}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={colors.white} size="small" />
                    ) : (
                        <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
                    )}
                </TouchableOpacity>

                {/* Transcript Button */}
                {showTranscriptButton && (
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={onShowTranscript}
                    >
                        <Text style={styles.controlIcon}>📝</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

// Compact Audio Player for smaller spaces
export function AudioPlayerCompact({
    isPlaying = false,
    isLoading = false,
    onPlay,
    onPause,
    label = ''
}) {
    return (
        <TouchableOpacity
            style={styles.compactContainer}
            onPress={isPlaying ? onPause : onPlay}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color={colors.primary} size="small" />
            ) : (
                <Text style={styles.compactIcon}>{isPlaying ? '🔊' : '🔈'}</Text>
            )}
            {label ? <Text style={styles.compactLabel}>{label}</Text> : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        ...shadows.sm,
    },
    progressContainer: {
        marginBottom: spacing.md,
    },
    progressTrack: {
        height: 6,
        backgroundColor: colors.gray200,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 3,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.xs,
    },
    timeText: {
        fontSize: typography.fontSize.sm,
        color: colors.textLight,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButton: {
        padding: spacing.md,
    },
    controlIcon: {
        fontSize: 28,
    },
    playButton: {
        backgroundColor: colors.primary,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.lg,
        ...shadows.md,
    },
    playIcon: {
        fontSize: 28,
    },

    // Compact styles
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primaryLight,
        borderRadius: borderRadius.round,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    compactIcon: {
        fontSize: 20,
    },
    compactLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.primaryDark,
        marginLeft: spacing.sm,
    },
});
