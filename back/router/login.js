const express = require('express');
const loginService = require('../service/login');
const { authMiddleware } = require('../middleware')

const router = express.Router();

router.post('/', loginService.login);
router.post('/refresh', authMiddleware, loginService.refresh);

module.exports = router;
