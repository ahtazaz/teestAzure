// functions/convert.js

const TokenSystem = require('../TokenSystem');

const tokenSystem = new TokenSystem();

module.exports = async function (context, req) {
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
};
