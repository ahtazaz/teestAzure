const express = require('express');
const Ably = require('ably');
const TokenSystem = require('./TokenSystem');
const StorageService = require('./StorageService');
const app =express()
const logger = console; // Replace with a proper logger as needed
const ably = new Ably.Realtime('UxabtA.CBXjig:QopuxP1Nd95vUJfnqYJGzpoh2s1URPWOCDHeeuAdyMk'); // 
// Route to get the current token balance
app.get('/balance/:account_id', (req, res) => {
    const accountId = req.params.account_id;
    res.json({ account_id: accountId, balance: tokenSystem.getTokenBalance(accountId) });
});

// Route to get conversion logs
app.get('/logs/conversions', async (req, res) => {
    const logs = await tokenSystem.getConversionLogs();
    res.json(logs);
});

// Route to get token deduction logs
app.get('/logs/deductions', async (req, res) => {
    const logs = await tokenSystem.getDeductionLogs();
    res.json(logs);
});

// Route to get token accumulation logs
app.get('/logs/accumulations', async (req, res) => {
    const logs = await tokenSystem.getAccumulationLogs();
    res.json(logs);
});

// Route to handle conversions
app.post('/convert', async (req, res) => {
    const transaction = req.body;
    await tokenSystem.handleConversion(transaction);
    res.json({ success: true, transaction });
});

// Route to handle actions
app.post('/action', async (req, res) => {
    const action = req.body;
    const result = await tokenSystem.handleAction(action);
    res.json(result);
});

// Start the Express server
app.listen(3000, () => {
    console.log('Express server is running on port 3000');
});

// Ably WebSocket integration
const channel = ably.channels.get('chat');

channel.subscribe('conversion', async (message) => {
    try {
        const data = JSON.parse(message.data);
        await tokenSystem.handleConversion(data.transaction);
    } catch (error) {
        logger.error('Error processing conversion:', error);
    }
});

channel.subscribe('action', async (message) => {
    try {
        const data = JSON.parse(message.data);
        const result = await tokenSystem.handleAction(data.action);
        // Publish result back to Ably channel
        channel.publish('action-result', JSON.stringify(result));
    } catch (error) {
        logger.error('Error processing action:', error);
    }
});

console.log('Ably WebSocket integration is running');

