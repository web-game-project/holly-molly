const express = require('express');
const {
    login,
    refresh
} = require('../service').loginService;
const { authMiddleware } = require('../middleware');

const router = express.Router();

router.post('/', login);
router.post('/refresh', authMiddleware, refresh);

module.exports = router;
