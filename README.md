<p align="center">
  <img src="assets/icon.png" alt="KisanVerse Logo" width="120" height="120"/>
</p>

<h1 align="center">🚜 KisanVerse</h1>

<p align="center">
  <b>Voice-first Financial Literacy Game for Indian Farmers</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-green" alt="Platform"/>
  <img src="https://img.shields.io/badge/React%20Native-Expo%2054-blue" alt="Expo"/>
  <img src="https://img.shields.io/badge/Languages-7%20Indian%20Languages-orange" alt="Languages"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License"/>
</p>

---

## 📖 About

**KisanVerse** is an innovative mobile application designed to teach financial literacy concepts to Indian farmers through an engaging, voice-first farming simulation game. Players experience realistic agricultural scenarios while learning about savings, credit, insurance, and cooperative economics.

### 🎯 Problem Statement

Over 80% of Indian farmers face financial stress due to:
- Debt traps from informal moneylenders
- Lack of understanding of formal banking & cooperative loans
- Poor market timing decisions
- No emergency savings or insurance

### 💡 Our Solution

KisanVerse gamifies financial decision-making in a familiar farming context, using:
- **Voice narration** in local languages
- **Realistic scenarios** based on actual farmer challenges
- **Immediate feedback** on financial choices
- **Progress tracking** to build confidence

---

## ✨ Key Features

### 🌾 Farm Simulation
- Realistic crop lifecycle (Rabi/Kharif seasons)
- Seed selection, fertilizers, irrigation management
- Weather events and pest challenges
- Harvest and market timing decisions

### 🎙️ Voice-First Experience
- Audio stories in **7 Indian languages**
- Hindi, English, Telugu, Tamil, Kannada, Marathi, Bengali
- Text transcripts for accessibility
- Speaker preview for language selection

### 💰 Financial Literacy Modules
- **Savings**: Emergency funds, cooperative savings
- **Credit**: Compare moneylender vs cooperative loans
- **Insurance**: Crop insurance decision making
- **Market**: Price monitoring, storage vs immediate sale

### 👥 Cooperative System
- Join village cooperative
- Build reputation through contributions
- Access low-interest loans (6% vs 25% moneylender)
- Collective investment opportunities

### 📊 Impact Tracking
- Resilience Score
- Financial Literacy Score
- Digital Adoption Score
- Savings Buffer (months of emergency funds)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native (Expo SDK 54) |
| **Navigation** | React Navigation v7 |
| **Backend** | Firebase (Firestore, Auth, Storage) |
| **Audio** | Expo AV |
| **Storage** | AsyncStorage (offline support) |
| **State** | React Hooks + Custom Services |
| **Styling** | React Native StyleSheet |

---

## 📁 Project Structure

```
KisanVerse/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AlertBanner.jsx
│   │   ├── AudioPlayer.jsx
│   │   ├── DecisionButton.jsx
│   │   ├── PriceChart.jsx
│   │   ├── SeasonProgress.jsx
│   │   └── WalletDisplay.jsx
│   │
│   ├── screens/             # App screens
│   │   ├── LanguageSelectionScreen.jsx
│   │   ├── OnboardingScreen.jsx
│   │   ├── HomeDashboardScreen.jsx
│   │   ├── FarmSimulationScreen.jsx
│   │   ├── VoiceStoryScreen.jsx
│   │   ├── MarketScreen.jsx
│   │   ├── CooperativeScreen.jsx
│   │   └── ImpactSummaryScreen.jsx
│   │
│   ├── services/            # Business logic & APIs
│   │   ├── firebase.js
│   │   ├── audioManager.js
│   │   ├── gameLogic.js
│   │   ├── storageManager.js
│   │   └── translationService.js
│   │
│   ├── styles/              # Theming & common styles
│   │   ├── theme.js
│   │   └── commonStyles.js
│   │
│   ├── utils/               # Helpers & constants
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   └── App.jsx              # Main app entry
│
├── assets/                  # Images, icons, splash
├── android/                 # Native Android (generated)
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- Android Studio (for local APK build) OR Expo Go app (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/KisanVerse.git
   cd KisanVerse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npx expo start
   ```

4. **Run on device**
   - **Expo Go**: Scan QR code with Expo Go app
   - **Android Emulator**: Press `a` in terminal
   - **iOS Simulator**: Press `i` in terminal (macOS only)
   - **Web Browser**: Press `w` in terminal

---

## 📱 Building APK

### Option 1: EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build APK
eas build --platform android --profile preview
```

### Option 2: Local Build

Requires: Java JDK 17+, Android SDK

```bash
# Generate native project
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/
```

---

## 🔑 Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable these services:
   - Authentication (Anonymous Sign-in)
   - Cloud Firestore
   - Cloud Storage

3. Update `src/utils/constants.js` with your config:
   ```javascript
   export const FIREBASE_CONFIG = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

---

## 🎮 Game Mechanics

### Season Cycle (120 days)
| Stage | Days | Activities |
|-------|------|------------|
| Sowing | 1-30 | Buy seeds, prepare land |
| Growing | 31-90 | Apply fertilizer, water, pesticides |
| Harvest | 91-120 | Harvest, sell or store |

### Financial Decisions
- **Emergency Fund**: Maintain 3-6 months expenses
- **Insurance**: Pay ₹500 upfront, get 70% coverage
- **Cooperative Loan**: 6% interest (vs 25% moneylender)
- **Digital Payments**: 5% bonus on transactions

---

## 🌍 Supported Languages

| Language | Code | Native Name |
|----------|------|-------------|
| English | `en` | English |
| Hindi | `hi` | हिंदी |
| Telugu | `te` | తెలుగు |
| Tamil | `ta` | தமிழ் |
| Kannada | `kn` | ಕನ್ನಡ |
| Marathi | `mr` | मराठी |
| Bengali | `bn` | বাংলা |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Built for hackathon submission**

---

## 🙏 Acknowledgments

- Financial literacy content inspired by RBI guidelines
- Agricultural data from Indian Ministry of Agriculture
- Voice narration powered by text-to-speech services
- UI/UX designed for low-literacy users

---

<p align="center">
  Made with ❤️ for Indian Farmers
</p>
