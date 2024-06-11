// index.js

const { AzureFunctionRouter } = require('azure-function-express');
const express = require('express');
const bodyParser = require('body-parser');
const ablyIntegration = require('./functions/ablyIntegration');
const balance = require('./functions/balance');
const conversionLogs = require('./functions/conversionLogs');
const deductionLogs = require('./functions/deductionLogs');
const accumulationLogs = require('./functions/accumulationLogs');
const convert = require('./functions/convert');
const action = require('./functions/action');

const app = express();
const router = new AzureFunctionRouter(app);

app.use(bodyParser.json());

router.get('/balance/:account_id', balance);
router.get('/logs/conversions', conversionLogs);
router.get('/logs/deductions', deductionLogs);
router.get('/logs/accumulations', accumulationLogs);
router.post('/convert', convert);
router.post('/action', action);
router.get('/ablyIntegration', ablyIntegration);

module.exports = app;
