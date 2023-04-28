const { mt5Hook } = require('../controller/mt5.controller');

const router = require('express').Router();

router.post('/mt5/:hook', mt5Hook);

module.exports = router;