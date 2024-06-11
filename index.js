const ablyIntegration = require('./functions/ablyIntegration');
const balance = require('./functions/balance');
const conversionLogs = require('./functions/conversionLogs');
const deductionLogs = require('./functions/deductionLogs');
const accumulationLogs = require('./functions/accumulationLogs');
const convert = require('./functions/convert');
const action = require('./functions/action');

module.exports = async function (context, req) {
    // Route requests based on HTTP method and path
    switch (req.method) {
        case 'GET':
            switch (req.url) {
                case '/balance/:account_id':
                    await balance(context, req);
                    break;
                case '/logs/conversions':
                    await conversionLogs(context, req);
                    break;
                case '/logs/deductions':
                    await deductionLogs(context, req);
                    break;
                case '/logs/accumulations':
                    await accumulationLogs(context, req);
                    break;
                case '/ablyIntegration':
                    await ablyIntegration(context, req);
                    break;
                default:
                    context.res = {
                        status: 404,
                        body: "Not Found"
                    };
            }
            break;
        case 'POST':
            switch (req.url) {
                case '/convert':
                    await convert(context, req);
                    break;
                case '/action':
                    await action(context, req);
                    break;
                default:
                    context.res = {
                        status: 404,
                        body: "Not Found"
                    };
            }
            break;
        default:
            context.res = {
                status: 405,
                body: "Method Not Allowed"
            };
    }
};
