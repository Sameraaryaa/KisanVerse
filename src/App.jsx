// Main App Entry Point with Navigation
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Screens
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeDashboardScreen from './screens/HomeDashboardScreen';
import FarmSimulationScreen from './screens/FarmSimulationScreen';
import VoiceStoryScreen from './screens/VoiceStoryScreen';
import MarketScreen from './screens/MarketScreen';
import CooperativeScreen from './screens/CooperativeScreen';
import ImpactSummaryScreen from './screens/ImpactSummaryScreen';

// Services
import storageManager from './services/storageManager';
import translationService from './services/translationService';
import audioManager from './services/audioManager';

const Stack = createStackNavigator();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Language');

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async () => {
        try {
            // Initialize services
            await storageManager.init();
            await translationService.init();
            await audioManager.init();

            // Check if user has completed onboarding
            const hasOnboarded = await storageManager.hasCompletedOnboarding();

            if (hasOnboarded) {
                setInitialRoute('Home');
            } else {
                // Check if language is already selected
                const language = await storageManager.getLanguage();
                if (language) {
                    setInitialRoute('Onboarding');
                }
            }
        } catch (error) {
            console.error('Initialization error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.logo}>🚜</Text>
                <Text style={styles.appName}>KisanVerse</Text>
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="dark" />
            <NavigationContainer>
                <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#F5F5F5' } }}>
                    <Stack.Screen name="Language" component={LanguageSelectionScreen} />
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                    <Stack.Screen name="Home" component={HomeDashboardScreen} />
                    <Stack.Screen name="Farm" component={FarmSimulationScreen} />
                    <Stack.Screen name="Stories" component={VoiceStoryScreen} />
                    <Stack.Screen name="Market" component={MarketScreen} />
                    <Stack.Screen name="Cooperative" component={CooperativeScreen} />
                    <Stack.Screen name="Impact" component={ImpactSummaryScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E9' },
    logo: { fontSize: 80 },
    appName: { fontSize: 32, fontWeight: 'bold', color: '#2E7D32', marginTop: 16 },
    loader: { marginTop: 24 }
});
