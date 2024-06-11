// functions/balance.js

const TokenSystem = require('../TokenSystem');

const tokenSystem = new TokenSystem();

module.exports = async function (context, req) {
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
};
