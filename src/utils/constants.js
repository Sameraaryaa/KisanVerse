// KisanVerse Constants

export const LANGUAGES = [
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', audio: 'welcome_hi.mp3' },
  { code: 'en', name: 'English', flag: '🇬🇧', audio: 'welcome_en.mp3' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳', audio: 'welcome_te.mp3' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', audio: 'welcome_ta.mp3' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', audio: 'welcome_kn.mp3' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳', audio: 'welcome_mr.mp3' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳', audio: 'welcome_bn.mp3' }
];

export const CROPS = [
  { id: 'rice', name: 'Rice', icon: '🌾', nameHi: 'धान' },
  { id: 'wheat', name: 'Wheat', icon: '🌾', nameHi: 'गेहूं' },
  { id: 'vegetables', name: 'Vegetables', icon: '🥬', nameHi: 'सब्जियां' },
  { id: 'cotton', name: 'Cotton', icon: '☁️', nameHi: 'कपास' },
  { id: 'pulses', name: 'Pulses', icon: '🫘', nameHi: 'दालें' },
  { id: 'other', name: 'Other', icon: '🌱', nameHi: 'अन्य' }
];

export const LAND_SIZES = [
  { id: '<2', name: 'Less than 2 acres', nameHi: '2 एकड़ से कम' },
  { id: '2-5', name: '2-5 acres', nameHi: '2-5 एकड़' },
  { id: '5-10', name: '5-10 acres', nameHi: '5-10 एकड़' },
  { id: '>10', name: 'More than 10 acres', nameHi: '10 एकड़ से अधिक' }
];

export const SEASONS = {
  rabi: { name: 'Rabi', nameHi: 'रबी', icon: '❄️', months: 'Oct-Mar' },
  kharif: { name: 'Kharif', nameHi: 'खरीफ', icon: '🌧️', months: 'Jun-Sep' },
  zaid: { name: 'Zaid', nameHi: 'जायद', icon: '☀️', months: 'Mar-Jun' }
};

export const SEASON_STAGES = {
  sowing: { name: 'Sowing', nameHi: 'बुवाई', dayRange: [1, 30] },
  growing: { name: 'Growing', nameHi: 'बढ़वार', dayRange: [31, 90] },
  harvest: { name: 'Harvest', nameHi: 'कटाई', dayRange: [91, 120] },
  lean: { name: 'Lean Period', nameHi: 'किल्लत का समय', dayRange: [121, 150] }
};

export const CREDIT_OPTIONS = {
  bank: { 
    name: 'Bank', 
    nameHi: 'बैंक', 
    interestRate: 8, 
    processingDays: 3,
    icon: '🏦',
    color: '#2196F3'
  },
  moneylender: { 
    name: 'Moneylender', 
    nameHi: 'साहूकार', 
    interestRate: 25, 
    processingDays: 0,
    icon: '💰',
    color: '#F44336'
  },
  cooperative: { 
    name: 'Cooperative', 
    nameHi: 'सहकारी समिति', 
    interestRate: 6, 
    processingDays: 1,
    icon: '👥',
    color: '#4CAF50'
  }
};

export const GAME_BALANCE = {
  seasonDuration: 120,
  leanPeriodDuration: 30,
  
  crops: {
    rice: { seedCost: 2000, growthDays: 90, expectedYield: 50, basePrice: 520 },
    wheat: { seedCost: 1500, growthDays: 120, expectedYield: 40, basePrice: 480 },
    vegetables: { seedCost: 3000, growthDays: 60, expectedYield: 30, basePrice: 800 },
    cotton: { seedCost: 2500, growthDays: 150, expectedYield: 25, basePrice: 1200 },
    pulses: { seedCost: 1800, growthDays: 90, expectedYield: 20, basePrice: 900 },
    other: { seedCost: 2000, growthDays: 90, expectedYield: 35, basePrice: 600 }
  },
  
  insurance: {
    baseCost: 500,
    coveragePercent: 80
  },
  
  storage: {
    costPerDay: 50,
    spoilageRisk: 0.05
  }
};

export const COLORS = {
  primary: '#4CAF50',
  primaryDark: '#2E7D32',
  primaryLight: '#C8E6C9',
  secondary: '#FF9800',
  secondaryDark: '#F57C00',
  accent: '#2196F3',
  danger: '#F44336',
  warning: '#FFC107',
  success: '#4CAF50',
  textDark: '#333333',
  textLight: '#666666',
  background: '#F5F5F5',
  backgroundLight: '#E8F5E9',
  white: '#FFFFFF',
  black: '#000000'
};

export const FIREBASE_CONFIG = {
  // Replace with your actual Firebase config
  apiKey: "YOUR_API_KEY",
  authDomain: "kisanverse-prod.firebaseapp.com",
  projectId: "kisanverse-prod",
  storageBucket: "kisanverse-prod.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

export const AUDIO_BASE_URL = 'https://storage.googleapis.com/kisanverse-prod.appspot.com/audio';
export const IMAGE_BASE_URL = 'https://storage.googleapis.com/kisanverse-prod.appspot.com/images';
