const TokenSystem = require('../../../TokenSystem');
const tokenSystem = new TokenSystem(console);

module.exports = async function (context, req) {
    const accountId = req.params.account_id || req.query.account_id;
    const balance = tokenSystem.getTokenBalance(accountId);
    context.res = {
        status: 200,
        body: { account_id: accountId, balance: balance }
    };
};
