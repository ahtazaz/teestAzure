const StorageService = require('./StorageService');
const path = require('path');

class TokenSystem {
    constructor(logger) {
        this.tokenBalances = {}; // Store balances per account_id
        this.conversionLogFile = 'conversion_log';
        this.deductionLogFile = 'deduction_log';
        this.accumulationLogFile = 'accumulation_log';
        this.storageService = new StorageService();
        this.logger = logger;
        this.validActions = [
            "announce", "attend", "boost", "buy", "challenge", "compete", "dislike", "donate", "feedback",
            "follow", "gift", "invite", "join", "learn", "like", "moderate", "reject", "reload", "report",
            "request", "review", "search", "sell", "share", "subscribe", "suggest", "tag", "tip", "unlock", "vote"
        ];
        this.validUtilities = ['coin', 'crypto', 'fiat', 'points', 'token'];
        this.initializeStorage();
    }

    async initializeStorage() {
        try {
            await this.storageService.initialize('json', null, this.logger);
        } catch (error) {
            this.logger.error('Error initializing storage:', error);
        }
    }

    async handleConversion(transaction) {
        const { amount, utilityA, utilityB, utilityBrate, account_id } = transaction;
        const convertedAmount = this.convert(amount, utilityBrate);
        if (convertedAmount !== null) {
            if (!this.tokenBalances[account_id]) {
                this.tokenBalances[account_id] = {};
            }
            if (!this.tokenBalances[account_id][utilityB]) {
                this.tokenBalances[account_id][utilityB] = 0;
            }
            this.tokenBalances[account_id][utilityB] += convertedAmount;
            transaction.convertedAmount = convertedAmount;
            await this.logTransaction(this.conversionLogFile, transaction);
            await this.logTransaction(this.accumulationLogFile, transaction);
            console.log('Conversion Transaction:', transaction);
        } else {
            console.log('Invalid Utility:', utilityB);
        }
    }

    async handleAction(action) {
        const { account_id, action: actionType, token } = action;
        if (!this.isValidAction(actionType)) {
            console.log('Invalid Action:', action);
            return { success: false, message: 'Invalid action', action };
        }

        if (!this.tokenBalances[account_id] || !this.tokenBalances[account_id]['token']) {
            this.tokenBalances[account_id] = { token: 0 };
        }

        if (this.tokenBalances[account_id]['token'] >= token) {
            this.tokenBalances[account_id]['token'] -= token;
            await this.logTransaction(this.deductionLogFile, action);
            console.log('Action Performed:', action);
            return { success: true, action };
        } else {
            console.log('Insufficient Balance for Action:', action);
            return { success: false, message: 'Insufficient balance', action };
        }
    }

    convert(amount, utilityBrate) {
        if (isNaN(utilityBrate) || utilityBrate <= 0) {
            return null;
        }
        return amount * utilityBrate;
    }

    isValidAction(actionType) {
        return this.validActions.includes(actionType);
    }

    async logTransaction(logFile, transaction) {
        try {
            const logs = await this.loadLogFile(logFile) || [];
            logs.push(transaction);
            await this.storageService.set('logs', logFile, logs);
        } catch (error) {
            this.logger.error('Error logging transaction:', error);
        }
    }

    async loadLogFile(logFile) {
        try {
            const logs = await this.storageService.get('logs', logFile);
            return logs || [];
        } catch (error) {
            this.logger.error('Error loading log file:', error);
            return [];
        }
    }

    getTokenBalance(account_id) {
        return this.tokenBalances[account_id] || { token: 0 };
    }

    async getConversionLogs() {
        return await this.loadLogFile(this.conversionLogFile);
    }

    async getDeductionLogs() {
        return await this.loadLogFile(this.deductionLogFile);
    }

    async getAccumulationLogs() {
        return await this.loadLogFile(this.accumulationLogFile);
    }
}

module.exports = TokenSystem;
