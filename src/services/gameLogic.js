// Game Logic Service for KisanVerse
import {
    getUserProfile,
    updateGameState,
    recordDecision,
    getCurrentUser
} from './firebase';
import storageManager from './storageManager';
import {
    getNextSeason,
    getSeasonStage,
    calculatePrice,
    calculateYield,
    calculateResilienceScore,
    generateRandomEvent,
    calculateLoanEligibility
} from '../utils/helpers';
import { GAME_BALANCE, CREDIT_OPTIONS } from '../utils/constants';

class GameLogicService {
    constructor() {
        this.currentGameState = null;
        this.userId = null;
    }

    // Initialize game logic with user
    async init(userId) {
        this.userId = userId;
        await this.loadGameState();
        return this.currentGameState;
    }

    // Load game state from Firebase or local storage
    async loadGameState() {
        try {
            // Try Firebase first
            const profile = await getUserProfile(this.userId);
            if (profile?.gameState) {
                this.currentGameState = profile.gameState;
                // Cache locally for offline
                await storageManager.setGameState(profile.gameState);
                return this.currentGameState;
            }

            // Fallback to local storage
            const localState = await storageManager.getGameState();
            if (localState) {
                this.currentGameState = localState;
                return this.currentGameState;
            }

            return null;
        } catch (error) {
            console.error('Error loading game state:', error);
            // Try local storage on error
            const localState = await storageManager.getGameState();
            this.currentGameState = localState;
            return localState;
        }
    }

    // Advance game by one day
    async advanceDay() {
        if (!this.currentGameState) return null;

        const state = { ...this.currentGameState };

        // Increment day
        let newDay = state.seasonDay + 1;
        let newStage = state.seasonStage;
        let newSeason = state.currentSeason;

        // Check stage transitions
        if (newDay > 30 && newStage === 'sowing') {
            newStage = 'growing';
        } else if (newDay > 90 && newStage === 'growing') {
            newStage = 'harvest';
        } else if (newDay > 120) {
            newDay = 1;
            newStage = 'sowing';
            newSeason = getNextSeason(newSeason);
            state.totalSeasonsPlayed += 1;
        }

        // Daily expenses (if in growing stage)
        let dailyExpense = 0;
        if (newStage === 'growing') {
            dailyExpense = 50; // Water, maintenance
        }

        // Update crop growth
        if (newStage === 'growing') {
            state.farm.growthPercent = Math.min(100, state.farm.growthPercent + 1.1);
            state.farm.cropStage = Math.floor(state.farm.growthPercent / 33);
        }

        // Update storage spoilage
        if (state.market.storedQuantity > 0) {
            state.market.daysStored += 1;
            const spoilage = state.market.storedQuantity * GAME_BALANCE.storage.spoilageRisk * 0.01;
            state.market.storedQuantity = Math.max(0, state.market.storedQuantity - spoilage);
            state.market.spoilagePercent = (state.market.daysStored * GAME_BALANCE.storage.spoilageRisk * 100);
        }

        // Update market price
        const cropConfig = GAME_BALANCE.crops[state.farm.cropType] || GAME_BALANCE.crops.rice;
        state.market.currentPrice = calculatePrice(cropConfig.basePrice, newDay);
        state.market.priceHistory.push({ day: newDay, price: state.market.currentPrice });
        if (state.market.priceHistory.length > 30) {
            state.market.priceHistory.shift();
        }

        // Random event
        const randomEvent = generateRandomEvent(newDay, newStage);
        if (randomEvent) {
            if (randomEvent.impact.cropHealth) {
                state.farm.cropHealth = Math.max(0, Math.min(100,
                    state.farm.cropHealth + randomEvent.impact.cropHealth
                ));
            }
        }

        // Apply daily expense
        state.wallet.cash -= dailyExpense;
        if (dailyExpense > 0) {
            state.expenses.push({
                type: 'daily',
                amount: dailyExpense,
                day: newDay,
                seasonId: `${newSeason}_${state.totalSeasonsPlayed}`
            });
        }

        // Update state
        state.seasonDay = newDay;
        state.seasonStage = newStage;
        state.currentSeason = newSeason;

        // Save to Firebase and local
        await this.saveGameState(state);

        return {
            newDay,
            newStage,
            dailyExpense,
            randomEvent,
            state
        };
    }

    // Buy seeds
    async buySeeds(cropType) {
        if (!this.currentGameState) return { success: false };

        const cropConfig = GAME_BALANCE.crops[cropType];
        if (!cropConfig) return { success: false, error: 'Invalid crop type' };

        const state = { ...this.currentGameState };

        if (state.wallet.cash < cropConfig.seedCost) {
            return { success: false, error: 'Insufficient cash' };
        }

        state.wallet.cash -= cropConfig.seedCost;
        state.farm.cropType = cropType;
        state.farm.cropStage = 0;
        state.farm.cropHealth = 100;
        state.farm.growthPercent = 0;
        state.farm.expectedHarvest = cropConfig.expectedYield;

        state.expenses.push({
            type: 'seeds',
            amount: cropConfig.seedCost,
            day: state.seasonDay,
            seasonId: `${state.currentSeason}_${state.totalSeasonsPlayed}`
        });

        await this.saveGameState(state);
        return { success: true, cost: cropConfig.seedCost };
    }

    // Apply fertilizer
    async applyFertilizer() {
        if (!this.currentGameState) return { success: false };

        const fertilzerCost = 1500;
        const state = { ...this.currentGameState };

        if (state.wallet.cash < fertilzerCost) {
            return { success: false, error: 'Insufficient cash' };
        }

        state.wallet.cash -= fertilzerCost;
        state.farm.cropHealth = Math.min(100, state.farm.cropHealth + 15);
        state.farm.expectedHarvest *= 1.1;

        state.expenses.push({
            type: 'fertilizer',
            amount: fertilzerCost,
            day: state.seasonDay,
            seasonId: `${state.currentSeason}_${state.totalSeasonsPlayed}`
        });

        await this.saveGameState(state);
        return { success: true, cost: fertilzerCost };
    }

    // Buy insurance
    async buyInsurance() {
        if (!this.currentGameState) return { success: false };

        const state = { ...this.currentGameState };
        const insuranceCost = GAME_BALANCE.insurance.baseCost;

        if (state.wallet.cash < insuranceCost) {
            return { success: false, error: 'Insufficient cash' };
        }

        if (state.farm.insured) {
            return { success: false, error: 'Already insured' };
        }

        state.wallet.cash -= insuranceCost;
        state.farm.insured = true;
        state.farm.insuranceCost = insuranceCost;
        state.farm.insuranceCoverage = GAME_BALANCE.insurance.coveragePercent;

        state.expenses.push({
            type: 'insurance',
            amount: insuranceCost,
            day: state.seasonDay,
            seasonId: `${state.currentSeason}_${state.totalSeasonsPlayed}`
        });

        await this.saveGameState(state);
        return { success: true, cost: insuranceCost };
    }

    // Harvest crops
    async harvest() {
        if (!this.currentGameState) return { success: false };

        const state = { ...this.currentGameState };

        if (state.seasonStage !== 'harvest') {
            return { success: false, error: 'Not harvest season' };
        }

        const actualYield = calculateYield(
            state.farm.expectedHarvest,
            state.farm.cropHealth
        );

        state.market.harvestQuantity = actualYield;
        state.farm.cropStage = 3;
        state.farm.growthPercent = 100;

        await this.saveGameState(state);
        return { success: true, yield: actualYield };
    }

    // Sell harvest
    async sellHarvest(quantity, useDigitalPayment = false) {
        if (!this.currentGameState) return { success: false };

        const state = { ...this.currentGameState };
        const available = state.market.harvestQuantity + state.market.storedQuantity;

        if (quantity > available) {
            return { success: false, error: 'Insufficient quantity' };
        }

        let price = state.market.currentPrice;

        // Digital payment bonus (5%)
        if (useDigitalPayment) {
            price *= 1.05;
        }

        const totalValue = Math.round(quantity * price);

        // Deduct from harvest first, then storage
        if (quantity <= state.market.harvestQuantity) {
            state.market.harvestQuantity -= quantity;
        } else {
            const fromStorage = quantity - state.market.harvestQuantity;
            state.market.harvestQuantity = 0;
            state.market.storedQuantity -= fromStorage;
        }

        state.wallet.cash += totalValue;

        state.income.push({
            type: 'harvest_sale',
            amount: totalValue,
            day: state.seasonDay,
            paymentMode: useDigitalPayment ? 'digital' : 'cash',
            seasonId: `${state.currentSeason}_${state.totalSeasonsPlayed}`
        });

        // Update scores
        if (useDigitalPayment) {
            state.scores.digitalAdoptionScore = Math.min(100, state.scores.digitalAdoptionScore + 5);
        }

        await this.saveGameState(state);
        return { success: true, amount: totalValue };
    }

    // Store harvest
    async storeHarvest(quantity) {
        if (!this.currentGameState) return { success: false };

        const state = { ...this.currentGameState };

        if (quantity > state.market.harvestQuantity) {
            return { success: false, error: 'Insufficient harvest' };
        }

        state.market.harvestQuantity -= quantity;
        state.market.storedQuantity += quantity;
        state.market.daysStored = 0;

        await this.saveGameState(state);
        return { success: true };
    }

    // Take loan
    async takeLoan(amount, source) {
        if (!this.currentGameState) return { success: false };

        const state = { ...this.currentGameState };
        const creditOption = CREDIT_OPTIONS[source];

        if (!creditOption) {
            return { success: false, error: 'Invalid loan source' };
        }

        if (source === 'cooperative') {
            const maxLoan = calculateLoanEligibility(
                state.cooperative.savingsBalance,
                state.cooperative.reputation
            );
            if (amount > maxLoan) {
                return { success: false, error: 'Exceeds cooperative limit' };
            }
            if (state.cooperative.activeLoan) {
                return { success: false, error: 'Already have active loan' };
            }
            state.cooperative.activeLoan = {
                amount,
                interestRate: creditOption.interestRate,
                daysRemaining: 60,
                issueDate: new Date().toISOString()
            };
        }

        state.wallet.cash += amount;
        state.wallet.debt += amount;
        state.wallet.debtSource = source;
        state.wallet.interestRate = creditOption.interestRate;

        state.income.push({
            type: 'loan',
            amount,
            day: state.seasonDay,
            paymentMode: 'cash',
            seasonId: `${state.currentSeason}_${state.totalSeasonsPlayed}`
        });

        await this.saveGameState(state);
        return { success: true, interestRate: creditOption.interestRate };
    }

    // Repay loan
    async repayLoan(amount) {
        if (!this.currentGameState) return { success: false };

        const state = { ...this.currentGameState };

        if (amount > state.wallet.cash) {
            return { success: false, error: 'Insufficient cash' };
        }

        if (amount > state.wallet.debt) {
            amount = state.wallet.debt;
        }

        state.wallet.cash -= amount;
        state.wallet.debt -= amount;

        if (state.wallet.debt === 0) {
            state.wallet.debtSource = null;
            state.wallet.interestRate = 0;

            // Update cooperative reputation if applicable
            if (state.cooperative.activeLoan) {
                state.cooperative.loanHistory.push({
                    amount: state.cooperative.activeLoan.amount,
                    repaidOnTime: true,
                    date: new Date().toISOString()
                });
                state.cooperative.reputation = Math.min(5, state.cooperative.reputation + 0.5);
                state.cooperative.activeLoan = null;
            }
        }

        state.expenses.push({
            type: 'loan_repayment',
            amount,
            day: state.seasonDay,
            seasonId: `${state.currentSeason}_${state.totalSeasonsPlayed}`
        });

        await this.saveGameState(state);
        return { success: true, remainingDebt: state.wallet.debt };
    }

    // Contribute to cooperative savings
    async contributeToCooperative(amount) {
        if (!this.currentGameState) return { success: false };

        const state = { ...this.currentGameState };

        if (amount > state.wallet.cash) {
            return { success: false, error: 'Insufficient cash' };
        }

        state.wallet.cash -= amount;
        state.cooperative.savingsBalance += amount;
        state.cooperative.totalContributed += amount;
        state.wallet.coopBalance = state.cooperative.savingsBalance;

        // Increase reputation slightly for regular contributions
        state.cooperative.reputation = Math.min(5, state.cooperative.reputation + 0.1);

        await this.saveGameState(state);
        return { success: true };
    }

    // Make story decision
    async makeDecision(storyId, choice) {
        if (!this.currentGameState) return { success: false };

        const state = { ...this.currentGameState };
        const consequences = choice.consequences || {};

        // Apply consequences
        if (consequences.walletChange) {
            state.wallet.cash += consequences.walletChange;
        }
        if (consequences.savingsChange) {
            state.wallet.savings += consequences.savingsChange;
        }
        if (consequences.debtChange) {
            state.wallet.debt += consequences.debtChange;
        }
        if (consequences.resilienceChange) {
            state.scores.resilienceScore = Math.max(0, Math.min(100,
                state.scores.resilienceScore + consequences.resilienceChange
            ));
        }
        if (consequences.digitalScoreChange) {
            state.scores.digitalAdoptionScore = Math.max(0, Math.min(100,
                state.scores.digitalAdoptionScore + consequences.digitalScoreChange
            ));
        }
        if (consequences.reputationChange) {
            state.cooperative.reputation = Math.max(1, Math.min(5,
                state.cooperative.reputation + consequences.reputationChange
            ));
        }

        // Recalculate literacy score based on decisions
        state.scores.financialLiteracyScore = Math.min(100,
            state.scores.financialLiteracyScore + (consequences.resilienceChange > 0 ? 2 : -1)
        );

        // Save to Firebase and local
        await this.saveGameState(state);
        await recordDecision(this.userId, {
            storyId,
            choiceId: choice.choiceId,
            seasonDay: state.seasonDay,
            outcome: consequences.resilienceChange >= 0 ? 'positive' : 'negative'
        });

        return { success: true, consequences };
    }

    // Calculate season summary
    getSeasonSummary() {
        if (!this.currentGameState) return null;

        const state = this.currentGameState;
        const seasonId = `${state.currentSeason}_${state.totalSeasonsPlayed}`;

        const seasonExpenses = state.expenses
            .filter(e => e.seasonId === seasonId)
            .reduce((sum, e) => sum + e.amount, 0);

        const seasonIncome = state.income
            .filter(i => i.seasonId === seasonId)
            .reduce((sum, i) => sum + i.amount, 0);

        return {
            season: state.currentSeason,
            totalEarnings: seasonIncome,
            totalExpenses: seasonExpenses,
            netProfit: seasonIncome - seasonExpenses,
            resilienceScore: state.scores.resilienceScore,
            financialLiteracyScore: state.scores.financialLiteracyScore,
            digitalAdoptionScore: state.scores.digitalAdoptionScore,
            savingsBuffer: state.wallet.savings / 5000, // months of buffer
            achievements: state.achievements
        };
    }

    // Save game state
    async saveGameState(state) {
        this.currentGameState = state;

        try {
            // Save to Firebase
            await updateGameState(this.userId, state);
        } catch (error) {
            console.error('Error saving to Firebase:', error);
            // Queue for offline sync
            await storageManager.addToOfflineQueue('updateGameState', state);
        }

        // Always save locally
        await storageManager.setGameState(state);
    }

    // Get current state
    getState() {
        return this.currentGameState;
    }
}

// Export singleton instance
export const gameLogic = new GameLogicService();
export default gameLogic;
