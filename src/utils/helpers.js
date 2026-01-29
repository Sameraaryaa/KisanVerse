// KisanVerse Helper Functions

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';

    // Handle negative numbers
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);

    // Format with Indian number system (lakhs and crores)
    const formatted = absAmount.toLocaleString('en-IN');

    return `${isNegative ? '-' : ''}₹${formatted}`;
};

/**
 * Get next season in the cycle
 */
export const getNextSeason = (currentSeason) => {
    const seasons = ['rabi', 'kharif', 'zaid'];
    const currentIndex = seasons.indexOf(currentSeason);
    return seasons[(currentIndex + 1) % seasons.length];
};

/**
 * Get season stage based on day number
 */
export const getSeasonStage = (day) => {
    if (day <= 30) return 'sowing';
    if (day <= 90) return 'growing';
    if (day <= 120) return 'harvest';
    return 'lean';
};

/**
 * Calculate market price based on season day
 */
export const calculatePrice = (basePrice, seasonDay) => {
    // Prices are low during harvest (day 90-120), high during lean period
    if (seasonDay >= 90 && seasonDay <= 120) {
        return Math.round(basePrice * 0.8); // 20% lower during harvest
    } else if (seasonDay < 30) {
        return Math.round(basePrice * 1.3); // 30% higher during lean period
    }
    return basePrice;
};

/**
 * Calculate crop health based on care taken
 */
export const calculateCropHealth = (baseHealth, wateringDays, fertilizerApplied, pesticideApplied) => {
    let health = baseHealth;

    // Bonus for regular watering
    if (wateringDays > 60) health += 10;

    // Bonus for fertilizer
    if (fertilizerApplied) health += 15;

    // Bonus for pesticide
    if (pesticideApplied) health += 10;

    return Math.min(100, Math.max(0, health));
};

/**
 * Calculate harvest yield based on crop health
 */
export const calculateYield = (expectedYield, cropHealth) => {
    const healthMultiplier = cropHealth / 100;
    return Math.round(expectedYield * healthMultiplier * 10) / 10;
};

/**
 * Calculate loan interest
 */
export const calculateLoanInterest = (principal, interestRate, days) => {
    const dailyRate = interestRate / 100 / 365;
    return Math.round(principal * dailyRate * days);
};

/**
 * Calculate storage spoilage
 */
export const calculateSpoilage = (quantity, daysStored, spoilageRisk) => {
    const spoilageMultiplier = Math.min(1, daysStored * spoilageRisk);
    return Math.round(quantity * spoilageMultiplier * 10) / 10;
};

/**
 * Calculate cooperative loan eligibility
 */
export const calculateLoanEligibility = (savingsBalance, reputation) => {
    const baseMultiplier = 3;
    const reputationBonus = (reputation - 1) * 0.5; // 0 to 2 bonus
    return Math.round(savingsBalance * (baseMultiplier + reputationBonus));
};

/**
 * Generate random event
 */
export const generateRandomEvent = (day, stage) => {
    // 10% chance of event per day
    if (Math.random() > 0.1) return null;

    const events = [
        {
            type: 'weather',
            severity: 'high',
            message: 'Heavy rains forecasted!',
            messageHi: 'भारी बारिश की संभावना!',
            icon: '🌧️',
            impact: { cropHealth: -10 }
        },
        {
            type: 'pest',
            severity: 'medium',
            message: 'Pest attack detected',
            messageHi: 'कीट हमला पाया गया',
            icon: '🐛',
            impact: { cropHealth: -15 }
        },
        {
            type: 'price_surge',
            severity: 'positive',
            message: 'Market prices jumped!',
            messageHi: 'बाजार के दाम बढ़े!',
            icon: '📈',
            impact: { priceMultiplier: 1.2 }
        },
        {
            type: 'good_weather',
            severity: 'positive',
            message: 'Perfect weather for crops!',
            messageHi: 'फसल के लिए उत्तम मौसम!',
            icon: '☀️',
            impact: { cropHealth: 5 }
        }
    ];

    return events[Math.floor(Math.random() * events.length)];
};

/**
 * Calculate resilience score
 */
export const calculateResilienceScore = (wallet, decisions) => {
    let score = 50; // Base score

    // Savings buffer (0-30 points)
    const monthlyExpense = 5000; // Estimated monthly expense
    const savingsMonths = wallet.savings / monthlyExpense;
    score += Math.min(30, savingsMonths * 10);

    // Debt ratio (-20 to 0 points)
    const debtRatio = wallet.debt / (wallet.cash + wallet.savings + 1);
    score -= Math.min(20, debtRatio * 10);

    // Decision quality (0-20 points)
    const positiveDecisions = decisions.filter(d => d.outcome === 'positive').length;
    const decisionScore = (positiveDecisions / (decisions.length || 1)) * 20;
    score += decisionScore;

    return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Format date to readable string
 */
export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = (language = 'en') => {
    const hour = new Date().getHours();

    const greetings = {
        en: {
            morning: 'Good Morning',
            afternoon: 'Good Afternoon',
            evening: 'Good Evening'
        },
        hi: {
            morning: 'शुभ प्रभात',
            afternoon: 'नमस्कार',
            evening: 'शुभ संध्या'
        }
    };

    const lang = greetings[language] || greetings.en;

    if (hour < 12) return lang.morning;
    if (hour < 17) return lang.afternoon;
    return lang.evening;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
