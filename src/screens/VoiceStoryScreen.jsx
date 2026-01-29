// Voice Story Screen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Image,
    ActivityIndicator
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../styles/theme';
import { t } from '../services/translationService';
import { gameLogic } from '../services/gameLogic';
import audioManager from '../services/audioManager';
import AudioPlayer from '../components/AudioPlayer';
import DecisionButton, { ChoiceResult } from '../components/DecisionButton';

// Sample story data (in production, this would come from Firebase)
const SAMPLE_STORIES = [
    {
        id: 'credit_001',
        category: 'credit',
        theme: 'Credit Decision',
        content: {
            title: 'Unexpected Expense',
            titleHi: 'अचानक खर्चा',
            transcript: 'Your wife needs medical treatment urgently. The hospital asks for ₹15,000 as advance payment. Your current cash is low. What will you do?',
            transcriptHi: 'आपकी पत्नी को तुरंत इलाज की जरूरत है। अस्पताल ₹15,000 अग्रिम भुगतान मांग रहा है। आपकी नकदी कम है। आप क्या करेंगे?',
            illustration: null
        },
        choices: [
            {
                choiceId: 'A',
                textKey: 'Take loan from moneylender (Quick but 25% interest)',
                consequences: { walletChange: 15000, debtChange: 15000, resilienceChange: -5 },
                feedbackTextKey: 'The moneylender gave you quick cash, but the 25% interest will be very heavy to repay.'
            },
            {
                choiceId: 'B',
                textKey: 'Apply for cooperative loan (6% interest, 1 day wait)',
                consequences: { walletChange: 15000, debtChange: 15000, resilienceChange: 10, reputationChange: 0.2 },
                feedbackTextKey: 'Excellent choice! The cooperative loan has much lower interest and helps build your savings habit.'
            },
            {
                choiceId: 'C',
                textKey: 'Withdraw from savings (No debt)',
                consequences: { savingsChange: -15000, resilienceChange: 5 },
                feedbackTextKey: 'Using savings avoided debt, but you should rebuild your emergency fund soon.'
            }
        ]
    },
    {
        id: 'insurance_001',
        category: 'insurance',
        theme: 'Insurance Decision',
        content: {
            title: 'Monsoon Warning',
            titleHi: 'मानसून की चेतावनी',
            transcript: 'Weather reports predict heavy rains this week. Your crops are in the growing stage. You can still buy crop insurance for ₹500.',
            transcriptHi: 'मौसम रिपोर्ट में इस सप्ताह भारी बारिश की भविष्यवाणी है। आपकी फसल बढ़ने की अवस्था में है। आप अभी भी ₹500 में फसल बीमा खरीद सकते हैं।',
            illustration: null
        },
        choices: [
            {
                choiceId: 'A',
                textKey: 'Buy crop insurance (₹500)',
                consequences: { walletChange: -500, resilienceChange: 15 },
                feedbackTextKey: 'Great decision! Insurance protects you from major losses if the storm damages crops.'
            },
            {
                choiceId: 'B',
                textKey: 'Skip insurance, hope for the best',
                consequences: { resilienceChange: -10 },
                feedbackTextKey: 'You saved ₹500, but if crops are damaged, you could lose thousands with no protection.'
            }
        ]
    }
];

export default function VoiceStoryScreen({ navigation, route }) {
    const storyId = route?.params?.storyId;

    const [currentStory, setCurrentStory] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showTranscript, setShowTranscript] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [loading, setLoading] = useState(true);
    const [storyList, setStoryList] = useState([]);

    useEffect(() => {
        loadStories();
        return () => {
            audioManager.stop();
        };
    }, []);

    const loadStories = async () => {
        try {
            // In production, load from Firebase
            // const stories = await getAvailableStories(stage, day);
            setStoryList(SAMPLE_STORIES);

            if (storyId) {
                const story = SAMPLE_STORIES.find(s => s.id === storyId);
                if (story) {
                    setCurrentStory(story);
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error loading stories:', error);
            setLoading(false);
        }
    };

    const selectStory = (story) => {
        setCurrentStory(story);
        setSelectedChoice(null);
        setShowFeedback(false);
        setShowTranscript(false);
        // In production, start playing audio
        setDuration(60000); // 60 seconds placeholder
    };

    const handlePlay = async () => {
        setIsPlaying(true);
        // In production:
        // await audioManager.playStoryAudio(currentStory.id, language);
    };

    const handlePause = async () => {
        setIsPlaying(false);
        await audioManager.pause();
    };

    const handleReplay = async () => {
        setProgress(0);
        setIsPlaying(true);
        await audioManager.replay();
    };

    const handleMakeDecision = async (choice) => {
        setSelectedChoice(choice);

        // Apply consequences through game logic
        const result = await gameLogic.makeDecision(currentStory.id, choice);

        // Show feedback
        setShowFeedback(true);
        setIsPlaying(false);

        // Play feedback audio
        // await audioManager.playFeedbackAudio(currentStory.id, choice.choiceId, language);
    };

    const handleContinue = () => {
        setCurrentStory(null);
        setSelectedChoice(null);
        setShowFeedback(false);
        navigation.goBack();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>{t('loading')}</Text>
            </SafeAreaView>
        );
    }

    // Story List View
    if (!currentStory) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('voiceStories')}</Text>
                    <View style={{ width: 50 }} />
                </View>

                <ScrollView style={styles.container}>
                    <Text style={styles.sectionTitle}>Available Stories</Text>

                    {storyList.map((story) => (
                        <TouchableOpacity
                            key={story.id}
                            style={styles.storyCard}
                            onPress={() => selectStory(story)}
                        >
                            <View style={styles.storyIcon}>
                                <Text style={styles.storyEmoji}>
                                    {story.category === 'credit' ? '💳' :
                                        story.category === 'insurance' ? '🛡️' :
                                            story.category === 'market' ? '📊' : '📖'}
                                </Text>
                            </View>
                            <View style={styles.storyInfo}>
                                <Text style={styles.storyTheme}>{story.theme}</Text>
                                <Text style={styles.storyTitle}>{story.content.title}</Text>
                                <Text style={styles.storyTitleHi}>{story.content.titleHi}</Text>
                            </View>
                            <Text style={styles.playIcon}>▶️</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Story Player View
    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Close Button */}
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCurrentStory(null)}
            >
                <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>

            <ScrollView style={styles.container}>
                {/* Story Header */}
                <View style={styles.storyHeader}>
                    <Text style={styles.storyCategory}>{currentStory.theme}</Text>
                    <Text style={styles.storyMainTitle}>{currentStory.content.title}</Text>
                    <Text style={styles.storyMainTitleHi}>{currentStory.content.titleHi}</Text>
                </View>

                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    <Text style={styles.illustrationEmoji}>
                        {currentStory.category === 'credit' ? '💰' :
                            currentStory.category === 'insurance' ? '☔' : '📖'}
                    </Text>
                </View>

                {/* Audio Player */}
                {!showFeedback && (
                    <View style={styles.playerContainer}>
                        <AudioPlayer
                            isPlaying={isPlaying}
                            progress={progress}
                            duration={duration}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onReplay={handleReplay}
                            onShowTranscript={() => setShowTranscript(!showTranscript)}
                        />
                    </View>
                )}

                {/* Transcript */}
                {showTranscript && !showFeedback && (
                    <View style={styles.transcriptContainer}>
                        <Text style={styles.transcriptText}>
                            {currentStory.content.transcript}
                        </Text>
                        <Text style={styles.transcriptTextHi}>
                            {currentStory.content.transcriptHi}
                        </Text>
                    </View>
                )}

                {/* Decision Choices */}
                {!showFeedback && (
                    <View style={styles.choicesContainer}>
                        <Text style={styles.choicesTitle}>{t('whatWillYouDo')}</Text>

                        {currentStory.choices.map((choice, index) => (
                            <DecisionButton
                                key={choice.choiceId}
                                choice={choice}
                                option={choice.choiceId}
                                onPress={handleMakeDecision}
                                selected={selectedChoice?.choiceId === choice.choiceId}
                            />
                        ))}
                    </View>
                )}

                {/* Feedback */}
                {showFeedback && selectedChoice && (
                    <View style={styles.feedbackContainer}>
                        <ChoiceResult
                            choice={selectedChoice}
                            isPositive={selectedChoice.consequences.resilienceChange >= 0}
                        />

                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={handleContinue}
                        >
                            <Text style={styles.continueButtonText}>{t('iUnderstand')}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: spacing.md,
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
    backButton: {
        fontSize: typography.fontSize.lg,
        color: colors.primary,
    },
    headerTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    container: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        padding: spacing.md,
    },
    storyCard: {
        backgroundColor: colors.white,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.sm,
    },
    storyIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    storyEmoji: {
        fontSize: 24,
    },
    storyInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    storyTheme: {
        fontSize: typography.fontSize.sm,
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    storyTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginTop: 2,
    },
    storyTitleHi: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
    },
    playIcon: {
        fontSize: 24,
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: spacing.md,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        color: colors.white,
        fontSize: 20,
        fontWeight: typography.fontWeight.bold,
    },
    storyHeader: {
        padding: spacing.lg,
        paddingTop: spacing.xl,
        alignItems: 'center',
    },
    storyCategory: {
        fontSize: typography.fontSize.md,
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    storyMainTitle: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginTop: spacing.sm,
        textAlign: 'center',
    },
    storyMainTitleHi: {
        fontSize: typography.fontSize.xl,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    illustrationContainer: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    illustrationEmoji: {
        fontSize: 100,
    },
    playerContainer: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    transcriptContainer: {
        backgroundColor: colors.white,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    transcriptText: {
        fontSize: typography.fontSize.md,
        lineHeight: typography.fontSize.md * 1.6,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    transcriptTextHi: {
        fontSize: typography.fontSize.md,
        lineHeight: typography.fontSize.md * 1.6,
        color: colors.textSecondary,
    },
    choicesContainer: {
        padding: spacing.md,
    },
    choicesTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    feedbackContainer: {
        padding: spacing.md,
    },
    continueButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.lg,
        ...shadows.sm,
    },
    continueButtonText: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.white,
    },
});
