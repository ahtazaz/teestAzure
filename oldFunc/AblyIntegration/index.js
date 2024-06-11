// AblyIntegration/index.js
const Ably = require('ably');
const TokenSystem = require('../../../TokenSystem');
const tokenSystem = new TokenSystem(console);

const ably = new Ably.Realtime('UxabtA.CBXjig:QopuxP1Nd95vUJfnqYJGzpoh2s1URPWOCDHeeuAdyMk'); // Replace with your actual Ably API key
const channel = ably.channels.get('chat');

ably.connection.on('connected', () => {
    console.log('Connected to Ably');
});

channel.subscribe('conversion', async (message) => {
    try {
        const data = JSON.parse(message.data);
        await tokenSystem.handleConversion(data.transaction);
    } catch (error) {
        console.error('Error processing conversion:', error);
    }
});

channel.subscribe('action', async (message) => {
    try {
        const data = JSON.parse(message.data);
        const result = await tokenSystem.handleAction(data.action);
        channel.publish('action-result', JSON.stringify(result));
    } catch (error) {
        console.error('Error processing action:', error);
    }
});

module.exports = async function (context, myTimer) {
    context.log('Ably integration is running');
};
