const express = require('express');
const router = express.Router();
const { getInterimResult, getFinalResult } = require('../service').gameService;

router.get('/interim-result/:gameIdx', getInterimResult);
router.get('/final-result/:gameIdx', getFinalResult);

module.exports = router;