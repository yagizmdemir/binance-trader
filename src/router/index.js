const router = require('express').Router();
const mt5 = require('./api/mt5.routing');

router.use(mt5);

module.exports = router;
