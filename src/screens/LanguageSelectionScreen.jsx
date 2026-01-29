// Language Selection Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { LANGUAGES } from '../utils/constants';
import audioManager from '../services/audioManager';
import translationService from '../services/translationService';
import storageManager from '../services/storageManager';

export default function LanguageSelectionScreen({ navigation }) {
    const [playingLang, setPlayingLang] = useState(null);
    const [selectedLang, setSelectedLang] = useState(null);

    const playPreview = async (languageCode) => {
        try {
            setPlayingLang(languageCode);
            await audioManager.init();

            // Simulated audio preview - in production, use actual audio URLs
            // await audioManager.playFromUrl(`${AUDIO_BASE_URL}/ui/welcome_${languageCode}.mp3`);

            // For demo, just set a timeout
            setTimeout(() => {
                setPlayingLang(null);
            }, 2000);
        } catch (error) {
            console.error('Audio preview error:', error);
            setPlayingLang(null);
        }
    };

    const selectLanguage = async (languageCode) => {
        try {
            setSelectedLang(languageCode);

            // Save language preference
            await translationService.setLanguage(languageCode);
            await storageManager.setLanguage(languageCode);

            // Navigate to onboarding
            setTimeout(() => {
                navigation.replace('Onboarding');
            }, 300);
        } catch (error) {
            console.error('Language selection error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.primaryExtraLight} />
            <LinearGradient
                colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
                style={styles.container}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>🚜</Text>
                    <Text style={styles.appName}>KisanVerse</Text>
                    <Text style={styles.tagline}>किसानवर्स</Text>
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Select Your Language</Text>
                    <Text style={styles.titleHindi}>अपनी भाषा चुनें</Text>
                    <Text style={styles.subtitle}>Tap speaker icon to preview</Text>
                </View>

                {/* Language Buttons */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.languageList}
                    showsVerticalScrollIndicator={false}
                >
                    {LANGUAGES.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={[
                                styles.languageButton,
                                playingLang === lang.code && styles.languageButtonPlaying,
                                selectedLang === lang.code && styles.languageButtonSelected
                            ]}
                            onPress={() => selectLanguage(lang.code)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.languageButtonContent}>
                                <Text style={styles.flag}>{lang.flag}</Text>
                                <Text style={styles.languageName}>{lang.name}</Text>

                                {/* Preview Speaker Icon */}
                                <TouchableOpacity
                                    style={styles.previewButton}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        playPreview(lang.code);
                                    }}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text style={styles.speakerIcon}>
                                        {playingLang === lang.code ? '🔊' : '🔈'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Selected Check */}
                            {selectedLang === lang.code && (
                                <View style={styles.selectedCheck}>
                                    <Text style={styles.checkIcon}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Learn financial planning through farming 🌱
                    </Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryExtraLight,
    },
    container: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    header: {
        alignItems: 'center',
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
    },
    logo: {
        fontSize: 64,
        marginBottom: spacing.sm,
    },
    appName: {
        fontSize: typography.fontSize.xxxl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
    },
    tagline: {
        fontSize: typography.fontSize.xl,
        color: colors.primary,
        marginTop: spacing.xs,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    titleHindi: {
        fontSize: typography.fontSize.xl,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    subtitle: {
        fontSize: typography.fontSize.md,
        color: colors.textLight,
        marginTop: spacing.sm,
    },
    scrollView: {
        flex: 1,
    },
    languageList: {
        paddingBottom: spacing.xl,
    },
    languageButton: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.md,
    },
    languageButtonPlaying: {
        backgroundColor: colors.primaryLight,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    languageButtonSelected: {
        backgroundColor: colors.primaryLight,
        borderWidth: 2,
        borderColor: colors.primaryDark,
    },
    languageButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        fontSize: 32,
    },
    languageName: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        flex: 1,
        marginLeft: spacing.md,
        color: colors.textPrimary,
    },
    previewButton: {
        padding: spacing.sm,
    },
    speakerIcon: {
        fontSize: 24,
    },
    selectedCheck: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        color: colors.white,
        fontWeight: typography.fontWeight.bold,
        fontSize: 14,
    },
    footer: {
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    footerText: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
    },
});
