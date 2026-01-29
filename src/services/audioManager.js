// Audio Manager Service for KisanVerse
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUDIO_BASE_URL } from '../utils/constants';

class AudioManager {
    constructor() {
        this.currentSound = null;
        this.isPlaying = false;
        this.cachedUrls = {};
        this.volume = 1.0;
        this.isMuted = false;
    }

    // Initialize audio mode
    async init() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false
            });

            // Load cached settings
            const settings = await AsyncStorage.getItem('audioSettings');
            if (settings) {
                const { volume, isMuted } = JSON.parse(settings);
                this.volume = volume ?? 1.0;
                this.isMuted = isMuted ?? false;
            }

            return true;
        } catch (error) {
            console.error('Error initializing audio:', error);
            return false;
        }
    }

    // Play audio from URL
    async playFromUrl(url, onStatusUpdate = null) {
        try {
            // Stop any currently playing sound
            await this.stop();

            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                {
                    shouldPlay: !this.isMuted,
                    volume: this.volume
                }
            );

            this.currentSound = sound;
            this.isPlaying = true;

            // Set up status listener
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    this.isPlaying = status.isPlaying;

                    if (status.didJustFinish) {
                        this.isPlaying = false;
                    }
                }

                if (onStatusUpdate) {
                    onStatusUpdate(status);
                }
            });

            return sound;
        } catch (error) {
            console.error('Error playing audio:', error);
            return null;
        }
    }

    // Play story audio
    async playStoryAudio(storyId, language) {
        const url = `${AUDIO_BASE_URL}/stories/${storyId}/${language}.mp3`;
        return this.playFromUrl(url);
    }

    // Play feedback audio
    async playFeedbackAudio(storyId, choiceId, language) {
        const url = `${AUDIO_BASE_URL}/feedback/${storyId}_${choiceId}/${language}.mp3`;
        return this.playFromUrl(url);
    }

    // Play UI sound
    async playUiSound(soundName) {
        const url = `${AUDIO_BASE_URL}/ui_sounds/${soundName}.mp3`;

        try {
            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: !this.isMuted, volume: this.volume * 0.5 }
            );

            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    sound.unloadAsync();
                }
            });

            return sound;
        } catch (error) {
            console.error('Error playing UI sound:', error);
            return null;
        }
    }

    // Play/pause toggle
    async togglePlayback() {
        if (!this.currentSound) return false;

        try {
            if (this.isPlaying) {
                await this.currentSound.pauseAsync();
            } else {
                await this.currentSound.playAsync();
            }
            return true;
        } catch (error) {
            console.error('Error toggling playback:', error);
            return false;
        }
    }

    // Pause
    async pause() {
        if (!this.currentSound) return false;

        try {
            await this.currentSound.pauseAsync();
            this.isPlaying = false;
            return true;
        } catch (error) {
            console.error('Error pausing:', error);
            return false;
        }
    }

    // Resume
    async resume() {
        if (!this.currentSound) return false;

        try {
            await this.currentSound.playAsync();
            return true;
        } catch (error) {
            console.error('Error resuming:', error);
            return false;
        }
    }

    // Replay from beginning
    async replay() {
        if (!this.currentSound) return false;

        try {
            await this.currentSound.setPositionAsync(0);
            await this.currentSound.playAsync();
            return true;
        } catch (error) {
            console.error('Error replaying:', error);
            return false;
        }
    }

    // Stop and unload
    async stop() {
        if (!this.currentSound) return true;

        try {
            await this.currentSound.stopAsync();
            await this.currentSound.unloadAsync();
            this.currentSound = null;
            this.isPlaying = false;
            return true;
        } catch (error) {
            console.error('Error stopping:', error);
            return false;
        }
    }

    // Set volume
    async setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));

        if (this.currentSound) {
            await this.currentSound.setVolumeAsync(this.volume);
        }

        await this.saveSettings();
    }

    // Toggle mute
    async toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.currentSound) {
            await this.currentSound.setIsMutedAsync(this.isMuted);
        }

        await this.saveSettings();
        return this.isMuted;
    }

    // Get playback status
    async getStatus() {
        if (!this.currentSound) {
            return { isLoaded: false, isPlaying: false };
        }

        try {
            const status = await this.currentSound.getStatusAsync();
            return status;
        } catch (error) {
            return { isLoaded: false, isPlaying: false };
        }
    }

    // Seek to position (milliseconds)
    async seekTo(position) {
        if (!this.currentSound) return false;

        try {
            await this.currentSound.setPositionAsync(position);
            return true;
        } catch (error) {
            console.error('Error seeking:', error);
            return false;
        }
    }

    // Save audio settings
    async saveSettings() {
        try {
            await AsyncStorage.setItem('audioSettings', JSON.stringify({
                volume: this.volume,
                isMuted: this.isMuted
            }));
        } catch (error) {
            console.error('Error saving audio settings:', error);
        }
    }

    // Pre-cache audio for offline use
    async cacheAudio(url) {
        // In a production app, you would download and store locally
        // For now, we just track the URL
        this.cachedUrls[url] = true;
    }

    // Clean up
    async cleanup() {
        await this.stop();
        this.cachedUrls = {};
    }
}

// Export singleton instance
export const audioManager = new AudioManager();
export default audioManager;
