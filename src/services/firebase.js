// Firebase Service for KisanVerse
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    arrayUnion,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged
} from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FIREBASE_CONFIG } from '../utils/constants';

// Initialize Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Auth functions
export const signInAnonymousUser = async () => {
    try {
        const result = await signInAnonymously(auth);
        return result.user;
    } catch (error) {
        console.error('Anonymous sign-in error:', error);
        throw error;
    }
};

export const getCurrentUser = () => auth.currentUser;

export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// User functions
export const createUserProfile = async (userId, profileData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            profile: {
                ...profileData,
                userId,
                createdAt: serverTimestamp(),
                lastActive: serverTimestamp()
            },
            gameState: getInitialGameState(),
            decisions: [],
            preferences: {
                soundEnabled: true,
                voiceGuidance: true,
                notificationsEnabled: true,
                autoSaveEnabled: true
            }
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (userId, updates) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, updates);
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const updateGameState = async (userId, updates) => {
    try {
        const userRef = doc(db, 'users', userId);
        const prefixedUpdates = {};
        Object.keys(updates).forEach(key => {
            prefixedUpdates[`gameState.${key}`] = updates[key];
        });
        await updateDoc(userRef, prefixedUpdates);
        return true;
    } catch (error) {
        console.error('Error updating game state:', error);
        throw error;
    }
};

// Story functions
export const getStory = async (storyId) => {
    try {
        const storyRef = doc(db, 'stories', storyId);
        const storyDoc = await getDoc(storyRef);
        if (storyDoc.exists()) {
            return { id: storyDoc.id, ...storyDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting story:', error);
        throw error;
    }
};

export const getAvailableStories = async (seasonStage, day) => {
    try {
        const storiesRef = collection(db, 'stories');
        const q = query(
            storiesRef,
            where('enabled', '==', true),
            where('trigger.seasonStage', '==', seasonStage)
        );
        const snapshot = await getDocs(q);
        const stories = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (day >= data.trigger.minDay && day <= data.trigger.maxDay) {
                stories.push({ id: doc.id, ...data });
            }
        });
        return stories;
    } catch (error) {
        console.error('Error getting stories:', error);
        return [];
    }
};

// Cooperative functions
export const getCooperative = async (coopId) => {
    try {
        const coopRef = doc(db, 'cooperatives', coopId);
        const coopDoc = await getDoc(coopRef);
        if (coopDoc.exists()) {
            return { id: coopDoc.id, ...coopDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting cooperative:', error);
        throw error;
    }
};

export const recordDecision = async (userId, decision) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            decisions: arrayUnion({
                ...decision,
                timestamp: serverTimestamp()
            })
        });
        return true;
    } catch (error) {
        console.error('Error recording decision:', error);
        throw error;
    }
};

// Storage functions
export const getAudioUrl = async (path) => {
    try {
        const audioRef = ref(storage, path);
        const url = await getDownloadURL(audioRef);
        return url;
    } catch (error) {
        console.error('Error getting audio URL:', error);
        return null;
    }
};

export const getImageUrl = async (path) => {
    try {
        const imageRef = ref(storage, path);
        const url = await getDownloadURL(imageRef);
        return url;
    } catch (error) {
        console.error('Error getting image URL:', error);
        return null;
    }
};

// Real-time listeners
export const subscribeToGameState = (userId, callback) => {
    const userRef = doc(db, 'users', userId);
    return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        }
    });
};

// Initial game state
const getInitialGameState = () => ({
    currentSeason: 'rabi',
    seasonDay: 1,
    seasonStage: 'sowing',
    totalSeasonsPlayed: 0,

    wallet: {
        cash: 10000,
        savings: 5000,
        coopBalance: 0,
        debt: 0,
        debtSource: null,
        interestRate: 0
    },

    farm: {
        cropType: 'rice',
        cropStage: 0,
        cropHealth: 100,
        growthPercent: 0,
        expectedHarvest: 50,
        harvestValue: 0,
        insured: false,
        insuranceCost: 0,
        insuranceCoverage: 0
    },

    expenses: [],
    income: [],

    market: {
        currentPrice: 520,
        priceHistory: [],
        harvestQuantity: 0,
        storedQuantity: 0,
        daysStored: 0,
        storageCost: 50,
        spoilagePercent: 0
    },

    cooperative: {
        coopId: 'default_coop',
        savingsBalance: 0,
        weeklyContribution: 100,
        totalContributed: 0,
        reputation: 3,
        activeLoan: null,
        investments: [],
        loanHistory: []
    },

    scores: {
        resilienceScore: 50,
        financialLiteracyScore: 30,
        savingsBuffer: 0,
        digitalAdoptionScore: 20
    },

    achievements: []
});

// Export Firebase instances
export { db, auth, storage, app };
