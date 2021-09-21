const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');

const loginService = {
    login: async (req, res, next) => {
       // const io = req.app.get("io");
        
       // io.emit("loginRoom","전체 io");

        res.json({
            message: "test"
        });
    },
};

module.exports = loginService;
