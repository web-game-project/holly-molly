const jwt = require('jsonwebtoken');
const { jwtAccessKey, jwtRefreshKey } = require('../../config/config');

const signJWT = {
    makeAccessToken: (user) => {
        return jwt.sign(
            { user_idx: user.user_idx, user_name: user.user_name },
            jwtAccessKey,
            {
                expiresIn: '1h',
            }
        );
    },
    makeRefreshToken: (user) => {
        return jwt.sign({ user_idx: user.user_idx }, jwtRefreshKey, {
            expiresIn: '14d',
        });
    },
};

module.exports = signJWT;
