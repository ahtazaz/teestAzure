// functions/action.js

const TokenSystem = require('../TokenSystem');

const tokenSystem = new TokenSystem();

module.exports = async function (context, req) {
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
};
