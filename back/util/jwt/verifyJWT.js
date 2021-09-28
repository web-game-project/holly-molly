const jwt = require('jsonwebtoken');
const { jwtAccessKey, jwtRefreshKey } = require('../../config/config');

const verifyJWT = {
    verifyAccessToken: (token) => {
        return jwt.verify(token, jwtAccessKey);
    },
    verifyRefreshToken: (token) => {
        return jwt.verify(token, jwtRefreshKey);
    },
};

module.exports = verifyJWT;