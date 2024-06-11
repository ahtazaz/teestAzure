


const { Ably } = require('ably');
const TokenSystem = require('./TokenSystem');

const ably = new Ably.Realtime('UxabtA.CBXjig:QopuxP1Nd95vUJfnqYJGzpoh2s1URPWOCDHeeuAdyMk'); // 

const tokenSystem = new TokenSystem();

module.exports = {
    balance: async function (context, req) {
        context.log('JavaScript HTTP trigger function processed a request.');

        if (req.method === 'GET') {
            const accountId = req.params.account_id;
            const balance = tokenSystem.getTokenBalance(accountId);
            context.res = {
                body: { account_id: accountId, balance: balance }
            };
        } else {
            context.res = {
                status: 400,
                body: 'Please use a GET request'
            };
        }
    },

    conversionLogs: async function (context, req) {
        context.log('JavaScript HTTP trigger function processed a request.');

        if (req.method === 'GET') {
            const logs = await tokenSystem.getConversionLogs();
            context.res = {
                body: logs
            };
        } else {
            context.res = {
                status: 400,
                body: 'Please use a GET request'
            };
        }
    },

    deductionLogs: async function (context, req) {
        context.log('JavaScript HTTP trigger function processed a request.');

        if (req.method === 'GET') {
            const logs = await tokenSystem.getDeductionLogs();
            context.res = {
                body: logs
            };
        } else {
            context.res = {
                status: 400,
                body: 'Please use a GET request'
            };
        }
    },

    accumulationLogs: async function (context, req) {
        context.log('JavaScript HTTP trigger function processed a request.');

        if (req.method === 'GET') {
            const logs = await tokenSystem.getAccumulationLogs();
            context.res = {
                body: logs
            };
        } else {
            context.res = {
                status: 400,
                body: 'Please use a GET request'
            };
        }
    },

    convert: async function (context, req) {
        context.log('JavaScript HTTP trigger function processed a request.');

        if (req.method === 'POST') {
            const transaction = req.body;
            await tokenSystem.handleConversion(transaction);
            context.res = {
                body: { success: true, transaction }
            };
        } else {
            context.res = {
                status: 400,
                body: 'Please use a POST request'
            };
        }
    },

    action: async function (context, req) {
        context.log('JavaScript HTTP trigger function processed a request.');

        if (req.method === 'POST') {
            const action = req.body;
            const result = await tokenSystem.handleAction(action);
            context.res = {
                body: result
            };
        } else {
            context.res = {
                status: 400,
                body: 'Please use a POST request'
            };
        }
    }
};

