// Onboarding Screen - User profile setup
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { CROPS, LAND_SIZES } from '../utils/constants';
import { t } from '../services/translationService';
import storageManager from '../services/storageManager';
import { signInAnonymousUser, createUserProfile } from '../services/firebase';

export default function OnboardingScreen({ navigation }) {
    const [step, setStep] = useState(1);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [selectedLandSize, setSelectedLandSize] = useState(null);
    const [farmerName, setFarmerName] = useState('');
    const [loading, setLoading] = useState(false);

    const canProceed = () => {
        if (step === 1) return selectedCrop !== null;
        if (step === 2) return selectedLandSize !== null;
        return true;
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const completeOnboarding = async () => {
        try {
            setLoading(true);

            // Sign in anonymously
            const user = await signInAnonymousUser();

            // Get saved language
            const language = await storageManager.getLanguage() || 'en';

            // Create profile
            const profile = {
                language,
                crop: selectedCrop,
                landSize: selectedLandSize,
                name: farmerName.trim() || 'Farmer',
                deviceId: user.uid
            };

            // Save to Firebase
            await createUserProfile(user.uid, profile);

            // Save locally
            await storageManager.setUserId(user.uid);
            await storageManager.setProfile(profile);

            // Navigate to home
            navigation.replace('Home');
        } catch (error) {
            console.error('Onboarding error:', error);
            // Still proceed even if Firebase fails (offline mode)
            navigation.replace('Home');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t('whatCropGrow')}</Text>
            <Text style={styles.stepSubtitle}>आप मुख्य रूप से कौन सी फसल उगाते हैं?</Text>

            <View style={styles.optionsGrid}>
                {CROPS.map((crop) => (
                    <TouchableOpacity
                        key={crop.id}
                        style={[
                            styles.optionCard,
                            selectedCrop === crop.id && styles.optionCardSelected
                        ]}
                        onPress={() => setSelectedCrop(crop.id)}
                    >
                        <Text style={styles.optionIcon}>{crop.icon}</Text>
                        <Text style={[
                            styles.optionName,
                            selectedCrop === crop.id && styles.optionNameSelected
                        ]}>{crop.name}</Text>
                        <Text style={styles.optionNameHi}>{crop.nameHi}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t('howMuchLand')}</Text>
            <Text style={styles.stepSubtitle}>आपके पास कितनी जमीन है?</Text>

            <View style={styles.optionsList}>
                {LAND_SIZES.map((size) => (
                    <TouchableOpacity
                        key={size.id}
                        style={[
                            styles.landOption,
                            selectedLandSize === size.id && styles.landOptionSelected
                        ]}
                        onPress={() => setSelectedLandSize(size.id)}
                    >
                        <View style={styles.landOptionContent}>
                            <Text style={styles.landIcon}>📐</Text>
                            <View style={styles.landTextContainer}>
                                <Text style={[
                                    styles.landName,
                                    selectedLandSize === size.id && styles.landNameSelected
                                ]}>{size.name}</Text>
                                <Text style={styles.landNameHi}>{size.nameHi}</Text>
                            </View>
                        </View>
                        {selectedLandSize === size.id && (
                            <Text style={styles.checkMark}>✓</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{t('enterName')}</Text>
            <Text style={styles.stepSubtitle}>अपना नाम दर्ज करें (वैकल्पिक)</Text>

            <TextInput
                style={styles.nameInput}
                value={farmerName}
                onChangeText={setFarmerName}
                placeholder="Enter your name / अपना नाम लिखें"
                placeholderTextColor={colors.textLight}
                maxLength={30}
            />

            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Your Profile Summary</Text>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Crop:</Text>
                    <Text style={styles.summaryValue}>
                        {CROPS.find(c => c.id === selectedCrop)?.name || '-'}
                    </Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Land:</Text>
                    <Text style={styles.summaryValue}>
                        {LAND_SIZES.find(l => l.id === selectedLandSize)?.name || '-'}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <LinearGradient
                    colors={['#E8F5E9', '#F5F5F5']}
                    style={styles.gradient}
                >
                    {/* Progress Indicator */}
                    <View style={styles.progressContainer}>
                        {[1, 2, 3].map((s) => (
                            <View key={s} style={styles.progressItem}>
                                <View style={[
                                    styles.progressDot,
                                    s <= step && styles.progressDotActive,
                                    s === step && styles.progressDotCurrent
                                ]} />
                                {s < 3 && (
                                    <View style={[
                                        styles.progressLine,
                                        s < step && styles.progressLineActive
                                    ]} />
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Step Content */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </ScrollView>

                    {/* Navigation Buttons */}
                    <View style={styles.buttonContainer}>
                        {step > 1 && (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={handleBack}
                            >
                                <Text style={styles.backButtonText}>{t('back')}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.nextButton,
                                !canProceed() && styles.nextButtonDisabled
                            ]}
                            onPress={handleNext}
                            disabled={!canProceed() || loading}
                        >
                            <Text style={styles.nextButtonText}>
                                {loading ? 'Loading...' : step === 3 ? t('startJourney') : t('continue')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </KeyboardAvoidingView>
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
    },
    gradient: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.lg,
    },
    progressItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.gray300,
    },
    progressDotActive: {
        backgroundColor: colors.primaryLight,
    },
    progressDotCurrent: {
        backgroundColor: colors.primary,
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    progressLine: {
        width: 40,
        height: 2,
        backgroundColor: colors.gray300,
        marginHorizontal: spacing.xs,
    },
    progressLineActive: {
        backgroundColor: colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    stepSubtitle: {
        fontSize: typography.fontSize.lg,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    optionCard: {
        width: '48%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    optionCardSelected: {
        backgroundColor: colors.primaryLight,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    optionIcon: {
        fontSize: 40,
        marginBottom: spacing.sm,
    },
    optionName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
    },
    optionNameSelected: {
        color: colors.primaryDark,
    },
    optionNameHi: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    optionsList: {
        marginTop: spacing.md,
    },
    landOption: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...shadows.sm,
    },
    landOptionSelected: {
        backgroundColor: colors.primaryLight,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    landOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    landIcon: {
        fontSize: 28,
        marginRight: spacing.md,
    },
    landTextContainer: {
        flex: 1,
    },
    landName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
    },
    landNameSelected: {
        color: colors.primaryDark,
    },
    landNameHi: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    checkMark: {
        fontSize: 24,
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
    },
    nameInput: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        fontSize: typography.fontSize.lg,
        color: colors.textPrimary,
        marginBottom: spacing.xl,
        ...shadows.sm,
    },
    summaryCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.md,
    },
    summaryTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    summaryLabel: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
    },
    summaryValue: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
        color: colors.primary,
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        gap: spacing.md,
    },
    backButton: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.gray300,
    },
    backButtonText: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textSecondary,
    },
    nextButton: {
        flex: 2,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
        ...shadows.sm,
    },
    nextButtonDisabled: {
        backgroundColor: colors.gray400,
    },
    nextButtonText: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
});
