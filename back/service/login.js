const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');

const loginService = {
    login: async (req, res, next) => {
       const io = req.app.get("io"); 
       io.emit("loginService","모두에게 보낸다.")
       io.to("1").emit("loginService", "1번방에게 보낸다.");

        res.json({
            message: "test"
        });
    },
};

module.exports = loginService;
