const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config/config');
const { User, WaitingRoomMember } = require('../models');

const loginService = {
    login: async (req, res, next) => {
        try {
            const friends = await User.findAll({
                include: [
                    {
                        model: WaitingRoomMember,
                        as : 'WaitingRoomMembers'
                    }
                ],
            });
            console.log("***********", friends);
        } catch (error) {
            console.log("***********", error);
        }
        
       const io = req.app.get("io"); 
       io.emit("loginService","모두에게 보낸다.")
       io.to("1").emit("loginService", "1번방에게 보낸다.");

        res.json({
            message: "test"
        });
    },
};

module.exports = loginService;
