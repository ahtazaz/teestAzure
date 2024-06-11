// functions/deductionLogs.js

const TokenSystem = require('../TokenSystem');

const tokenSystem = new TokenSystem();

module.exports = async function (context, req) {
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
};
