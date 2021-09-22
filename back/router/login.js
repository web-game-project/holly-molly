const express = require('express');
const loginService = require('../service/login');

const router = express.Router();

router.post('/', loginService.login);

module.exports = router;
