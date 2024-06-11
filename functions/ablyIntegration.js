// functions/ablyIntegration.js

const { Ably } = require('ably');
const TokenSystem = require('../TokenSystem');

const ably = new Ably.Realtime('UxabtA.CBXjig:QopuxP1Nd95vUJfnqYJGzpoh2s1URPWOCDHeeuAdyMk'); // 

const tokenSystem = new TokenSystem();

module.exports = async function (context, req) {
    context.log('Ably integration function processed a request.');

    // Set up Ably channel subscriptions
    const channel = ably.channels.get('chat');

    // Subscribe to Ably channels
    channel.subscribe('conversion', async (message) => {
        try {
            const data = JSON.parse(message.data);
            await tokenSystem.handleConversion(data.transaction);
        } catch (error) {
            context.log.error('Error processing conversion:', error);
        }
    });

    channel.subscribe('action', async (message) => {
        try {
            const data = JSON.parse(message.data);
            const result = await tokenSystem.handleAction(data.action);
            
            // Publish result back to Ably channel
            channel.publish('action-result', JSON.stringify(result));
        } catch (error) {
            context.log.error('Error processing action:', error);
        }
    });

    context.res = {
        body: 'Ably integration is running'
    };
};
