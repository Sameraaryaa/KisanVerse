// Storage Manager Service for KisanVerse
// Handles local storage for offline mode
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    USER_ID: 'kisanverse_user_id',
    LANGUAGE: 'kisanverse_language',
    GAME_STATE: 'kisanverse_game_state',
    PROFILE: 'kisanverse_profile',
    PREFERENCES: 'kisanverse_preferences',
    OFFLINE_QUEUE: 'kisanverse_offline_queue',
    CACHED_STORIES: 'kisanverse_cached_stories',
    LAST_SYNC: 'kisanverse_last_sync'
};

class StorageManager {
    constructor() {
        this.offlineQueue = [];
    }

    // Initialize storage
    async init() {
        try {
            // Load offline queue
            const queue = await this.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
            this.offlineQueue = queue || [];
            return true;
        } catch (error) {
            console.error('Error initializing storage:', error);
            return false;
        }
    }

    // Generic get/set methods
    async getItem(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return null;
        }
    }

    async setItem(key, value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
            return false;
        }
    }

    async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            return false;
        }
    }

    // User ID
    async getUserId() {
        return this.getItem(STORAGE_KEYS.USER_ID);
    }

    async setUserId(userId) {
        return this.setItem(STORAGE_KEYS.USER_ID, userId);
    }

    // Language
    async getLanguage() {
        return this.getItem(STORAGE_KEYS.LANGUAGE);
    }

    async setLanguage(language) {
        return this.setItem(STORAGE_KEYS.LANGUAGE, language);
    }

    // Game State (for offline play)
    async getGameState() {
        return this.getItem(STORAGE_KEYS.GAME_STATE);
    }

    async setGameState(gameState) {
        return this.setItem(STORAGE_KEYS.GAME_STATE, gameState);
    }

    // Profile
    async getProfile() {
        return this.getItem(STORAGE_KEYS.PROFILE);
    }

    async setProfile(profile) {
        return this.setItem(STORAGE_KEYS.PROFILE, profile);
    }

    // Preferences
    async getPreferences() {
        const prefs = await this.getItem(STORAGE_KEYS.PREFERENCES);
        return prefs || {
            soundEnabled: true,
            voiceGuidance: true,
            notificationsEnabled: true,
            autoSaveEnabled: true
        };
    }

    async setPreferences(preferences) {
        return this.setItem(STORAGE_KEYS.PREFERENCES, preferences);
    }

    async updatePreference(key, value) {
        const prefs = await this.getPreferences();
        prefs[key] = value;
        return this.setPreferences(prefs);
    }

    // Cached Stories (for offline access)
    async getCachedStories() {
        return this.getItem(STORAGE_KEYS.CACHED_STORIES) || [];
    }

    async cacheStory(story) {
        const stories = await this.getCachedStories();
        const existing = stories.findIndex(s => s.id === story.id);

        if (existing >= 0) {
            stories[existing] = story;
        } else {
            stories.push(story);
        }

        return this.setItem(STORAGE_KEYS.CACHED_STORIES, stories);
    }

    async getCachedStory(storyId) {
        const stories = await this.getCachedStories();
        return stories.find(s => s.id === storyId) || null;
    }

    // Offline Queue (for syncing when back online)
    async addToOfflineQueue(action, data) {
        this.offlineQueue.push({
            action,
            data,
            timestamp: Date.now()
        });
        return this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, this.offlineQueue);
    }

    async getOfflineQueue() {
        return this.offlineQueue;
    }

    async clearOfflineQueue() {
        this.offlineQueue = [];
        return this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, []);
    }

    async processOfflineQueue(syncFunction) {
        const queue = [...this.offlineQueue];
        const results = [];

        for (const item of queue) {
            try {
                await syncFunction(item.action, item.data);
                results.push({ success: true, item });
            } catch (error) {
                results.push({ success: false, item, error });
            }
        }

        // Remove successfully synced items
        const failedItems = results
            .filter(r => !r.success)
            .map(r => r.item);

        this.offlineQueue = failedItems;
        await this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, failedItems);

        return results;
    }

    // Last Sync timestamp
    async getLastSync() {
        return this.getItem(STORAGE_KEYS.LAST_SYNC);
    }

    async setLastSync() {
        return this.setItem(STORAGE_KEYS.LAST_SYNC, Date.now());
    }

    // Clear all data (logout/reset)
    async clearAll() {
        try {
            const keys = Object.values(STORAGE_KEYS);
            await AsyncStorage.multiRemove(keys);
            this.offlineQueue = [];
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // Check if user has completed onboarding
    async hasCompletedOnboarding() {
        const profile = await this.getProfile();
        return profile && profile.language && profile.crop;
    }

    // Get all stored data (for debugging)
    async getAllData() {
        const data = {};
        for (const [key, value] of Object.entries(STORAGE_KEYS)) {
            data[key] = await this.getItem(value);
        }
        return data;
    }
}

// Export singleton instance
export const storageManager = new StorageManager();
export default storageManager;
export { STORAGE_KEYS };
