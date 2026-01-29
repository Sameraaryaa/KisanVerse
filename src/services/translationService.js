// Translation Service for KisanVerse
// Supports 7 Indian languages

import storageManager from './storageManager';

// Translation strings for all supported languages
const translations = {
    en: {
        // General
        appName: 'KisanVerse',
        welcome: 'Welcome',
        continue: 'Continue',
        back: 'Back',
        save: 'Save',
        cancel: 'Cancel',
        ok: 'OK',
        yes: 'Yes',
        no: 'No',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',

        // Language Selection
        selectLanguage: 'Select Your Language',
        tapToPreview: 'Tap speaker icon to preview',

        // Onboarding
        letsGetStarted: "Let's Get Started",
        whatCropGrow: 'What crop do you mainly grow?',
        howMuchLand: 'How much land do you farm?',
        enterName: 'Enter your name (optional)',
        startJourney: 'Start My Journey',

        // Dashboard
        home: 'Home',
        season: 'Season',
        day: 'Day',
        wallet: 'Wallet',
        cash: 'Cash',
        savings: 'Savings',
        debt: 'Debt',

        // Farm
        farm: 'My Farm',
        cropHealth: 'Crop Health',
        growthProgress: 'Growth Progress',
        expectedHarvest: 'Expected Harvest',
        buySeeds: 'Buy Seeds',
        applyFertilizer: 'Apply Fertilizer',
        waterCrop: 'Water Crop',
        applyPesticide: 'Apply Pesticide',

        // Market
        market: 'Market',
        currentPrice: 'Current Price',
        perQuintal: 'per quintal',
        sellNow: 'Sell Now',
        storeForLater: 'Store for Later',
        storageCost: 'Storage Cost',
        spoilageRisk: 'Spoilage Risk',

        // Stories
        stories: 'Stories',
        voiceStories: 'Voice Stories',
        whatWillYouDo: 'What will you do?',
        option: 'Option',
        iUnderstand: 'I Understand',
        goodChoice: 'Good Choice!',
        considerThis: 'Consider This...',

        // Cooperative
        cooperative: 'Cooperative',
        coopSavings: 'Cooperative Savings',
        weeklyContribution: 'Weekly Contribution',
        reputation: 'Reputation',
        requestLoan: 'Request Loan',
        repayLoan: 'Repay Loan',
        invest: 'Invest',

        // Insurance
        insurance: 'Insurance',
        cropInsurance: 'Crop Insurance',
        buyInsurance: 'Buy Insurance',
        insured: 'Insured',
        notInsured: 'Not Insured',
        coverage: 'Coverage',

        // Alerts
        lowCashWarning: 'Low cash balance. Consider taking a loan or selling stored produce.',
        fertilizerNeeded: 'Fertilizer needed soon',
        monsoonWarning: 'Monsoon season! Consider crop insurance.',
        coopMeeting: 'Cooperative meeting - new investment opportunity',

        // Impact Summary
        seasonComplete: 'Season Complete!',
        totalEarnings: 'Total Earnings',
        totalExpenses: 'Total Expenses',
        netProfit: 'Net Profit',
        resilienceScore: 'Resilience Score',
        financialLiteracy: 'Financial Literacy',

        // Settings
        settings: 'Settings',
        language: 'Language',
        sound: 'Sound',
        voiceGuidance: 'Voice Guidance',
        notifications: 'Notifications',
        resetProgress: 'Reset Progress',
        about: 'About'
    },

    hi: {
        // General
        appName: 'किसानवर्स',
        welcome: 'स्वागत है',
        continue: 'जारी रखें',
        back: 'वापस',
        save: 'सहेजें',
        cancel: 'रद्द करें',
        ok: 'ठीक है',
        yes: 'हाँ',
        no: 'नहीं',
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफल',

        // Language Selection
        selectLanguage: 'अपनी भाषा चुनें',
        tapToPreview: 'पूर्वावलोकन के लिए स्पीकर आइकन टैप करें',

        // Onboarding
        letsGetStarted: 'शुरू करते हैं',
        whatCropGrow: 'आप मुख्य रूप से कौन सी फसल उगाते हैं?',
        howMuchLand: 'आपके पास कितनी जमीन है?',
        enterName: 'अपना नाम दर्ज करें (वैकल्पिक)',
        startJourney: 'अपनी यात्रा शुरू करें',

        // Dashboard
        home: 'होम',
        season: 'मौसम',
        day: 'दिन',
        wallet: 'बटुआ',
        cash: 'नकद',
        savings: 'बचत',
        debt: 'कर्ज',

        // Farm
        farm: 'मेरा खेत',
        cropHealth: 'फसल स्वास्थ्य',
        growthProgress: 'विकास प्रगति',
        expectedHarvest: 'अपेक्षित फसल',
        buySeeds: 'बीज खरीदें',
        applyFertilizer: 'खाद डालें',
        waterCrop: 'सिंचाई करें',
        applyPesticide: 'कीटनाशक लगाएं',

        // Market
        market: 'मंडी',
        currentPrice: 'मौजूदा भाव',
        perQuintal: 'प्रति क्विंटल',
        sellNow: 'अभी बेचें',
        storeForLater: 'बाद के लिए रखें',
        storageCost: 'भंडारण लागत',
        spoilageRisk: 'खराब होने का खतरा',

        // Stories
        stories: 'कहानियाँ',
        voiceStories: 'आवाज़ कहानियाँ',
        whatWillYouDo: 'आप क्या करेंगे?',
        option: 'विकल्प',
        iUnderstand: 'मैं समझ गया',
        goodChoice: 'अच्छा निर्णय!',
        considerThis: 'इस पर विचार करें...',

        // Cooperative
        cooperative: 'सहकारी समिति',
        coopSavings: 'सहकारी बचत',
        weeklyContribution: 'साप्ताहिक योगदान',
        reputation: 'प्रतिष्ठा',
        requestLoan: 'ऋण मांगें',
        repayLoan: 'ऋण चुकाएं',
        invest: 'निवेश करें',

        // Insurance
        insurance: 'बीमा',
        cropInsurance: 'फसल बीमा',
        buyInsurance: 'बीमा खरीदें',
        insured: 'बीमित',
        notInsured: 'बीमित नहीं',
        coverage: 'कवरेज',

        // Alerts
        lowCashWarning: 'नकदी कम है। ऋण लेने या भंडारित उपज बेचने पर विचार करें।',
        fertilizerNeeded: 'जल्द खाद की जरूरत है',
        monsoonWarning: 'मानसून का मौसम! फसल बीमा पर विचार करें।',
        coopMeeting: 'सहकारी बैठक - नया निवेश अवसर',

        // Impact Summary
        seasonComplete: 'मौसम पूरा!',
        totalEarnings: 'कुल कमाई',
        totalExpenses: 'कुल खर्च',
        netProfit: 'शुद्ध लाभ',
        resilienceScore: 'लचीलापन स्कोर',
        financialLiteracy: 'वित्तीय साक्षरता',

        // Settings
        settings: 'सेटिंग्स',
        language: 'भाषा',
        sound: 'ध्वनि',
        voiceGuidance: 'आवाज़ मार्गदर्शन',
        notifications: 'सूचनाएं',
        resetProgress: 'प्रगति रीसेट करें',
        about: 'ऐप के बारे में'
    },

    // Telugu translations
    te: {
        appName: 'కిసాన్‌వర్స్',
        welcome: 'స్వాగతం',
        continue: 'కొనసాగించు',
        selectLanguage: 'మీ భాషను ఎంచుకోండి',
        home: 'హోమ్',
        farm: 'నా పొలం',
        market: 'మార్కెట్',
        cooperative: 'సహకార సంఘం',
        wallet: 'వాలెట్',
        cash: 'నగదు',
        savings: 'పొదుపు',
        debt: 'అప్పు'
        // Add more translations as needed
    },

    // Tamil translations
    ta: {
        appName: 'கிசான்வெர்ஸ்',
        welcome: 'வரவேற்கிறோம்',
        continue: 'தொடரவும்',
        selectLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
        home: 'முகப்பு',
        farm: 'எனது பண்ணை',
        market: 'சந்தை',
        cooperative: 'கூட்டுறவு',
        wallet: 'பணப்பை',
        cash: 'பணம்',
        savings: 'சேமிப்பு',
        debt: 'கடன்'
    },

    // Kannada translations
    kn: {
        appName: 'ಕಿಸಾನ್‌ವರ್ಸ್',
        welcome: 'ಸ್ವಾಗತ',
        continue: 'ಮುಂದುವರಿಸಿ',
        selectLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        home: 'ಮುಖಪುಟ',
        farm: 'ನನ್ನ ಹೊಲ',
        market: 'ಮಾರುಕಟ್ಟೆ',
        cooperative: 'ಸಹಕಾರ',
        wallet: 'ವಾಲೆಟ್',
        cash: 'ನಗದು',
        savings: 'ಉಳಿತಾಯ',
        debt: 'ಸಾಲ'
    },

    // Marathi translations
    mr: {
        appName: 'किसानवर्स',
        welcome: 'स्वागत आहे',
        continue: 'पुढे जा',
        selectLanguage: 'तुमची भाषा निवडा',
        home: 'मुख्यपृष्ठ',
        farm: 'माझी शेती',
        market: 'बाजार',
        cooperative: 'सहकारी संस्था',
        wallet: 'पाकीट',
        cash: 'रोख',
        savings: 'बचत',
        debt: 'कर्ज'
    },

    // Bengali translations
    bn: {
        appName: 'কিসানভার্স',
        welcome: 'স্বাগতম',
        continue: 'চালিয়ে যান',
        selectLanguage: 'আপনার ভাষা নির্বাচন করুন',
        home: 'হোম',
        farm: 'আমার খামার',
        market: 'বাজার',
        cooperative: 'সমবায়',
        wallet: 'ওয়ালেট',
        cash: 'নগদ',
        savings: 'সঞ্চয়',
        debt: 'ঋণ'
    }
};

class TranslationService {
    constructor() {
        this.currentLanguage = 'en';
        this.fallbackLanguage = 'en';
    }

    // Initialize with saved language
    async init() {
        try {
            const savedLanguage = await storageManager.getLanguage();
            if (savedLanguage) {
                this.currentLanguage = savedLanguage;
            }
            return this.currentLanguage;
        } catch (error) {
            console.error('Error initializing translations:', error);
            return this.currentLanguage;
        }
    }

    // Get current language
    getLanguage() {
        return this.currentLanguage;
    }

    // Set language
    async setLanguage(languageCode) {
        if (translations[languageCode]) {
            this.currentLanguage = languageCode;
            await storageManager.setLanguage(languageCode);
            return true;
        }
        return false;
    }

    // Get translation for a key
    t(key) {
        // Try current language
        if (translations[this.currentLanguage]?.[key]) {
            return translations[this.currentLanguage][key];
        }

        // Fallback to English
        if (translations[this.fallbackLanguage]?.[key]) {
            return translations[this.fallbackLanguage][key];
        }

        // Return key if not found
        return key;
    }

    // Get translation with interpolation
    tf(key, params = {}) {
        let text = this.t(key);

        Object.entries(params).forEach(([param, value]) => {
            text = text.replace(`{{${param}}}`, value);
        });

        return text;
    }

    // Get all available languages
    getAvailableLanguages() {
        return Object.keys(translations);
    }

    // Check if language is RTL (for future Arabic/Urdu support)
    isRTL() {
        const rtlLanguages = ['ar', 'ur'];
        return rtlLanguages.includes(this.currentLanguage);
    }

    // Get language display name
    getLanguageName(code) {
        const names = {
            en: 'English',
            hi: 'हिंदी',
            te: 'తెలుగు',
            ta: 'தமிழ்',
            kn: 'ಕನ್ನಡ',
            mr: 'मराठी',
            bn: 'বাংলা'
        };
        return names[code] || code;
    }
}

// Export singleton instance
export const translationService = new TranslationService();
export const t = (key) => translationService.t(key);
export const tf = (key, params) => translationService.tf(key, params);
export default translationService;
