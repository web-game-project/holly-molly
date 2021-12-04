const Joi = require('joi');

module.exports.userSchema = {
    login: {
        name: Joi.string().required()
    },
    refresh: {
        refresh_token: Joi.string().required()
    }
};

module.exports.roomSchema = {
    create: Joi.object({
        room_name: Joi.string().required(),
        room_mode: Joi.string().valid('easy', 'hard').required(),
        room_private: Joi.boolean().required().strict(),
        room_start_member_cnt: Joi.number().integer().valid(4, 5, 6).required().strict()
    }),
    filter: Joi.object({
        page: Joi.number().integer(),
        room_mode: Joi.string().valid('easy', 'hard'),
        room_start_member_cnt: Joi.number().integer().valid(4, 5, 6),
        is_waiting: Joi.boolean()
    }),
    join: Joi.object({
        room_idx: Joi.number().integer().strict(),
        room_code: Joi.string(),
        room_mode: Joi.string(),
        room_start_member_cnt: Joi.number().integer().strict()
    }),
    edit: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        room_name: Joi.string().required(),
        room_mode: Joi.string().valid('easy', 'hard').required(),
        room_start_member_cnt: Joi.number().integer().valid(4, 5, 6).required()
    })
};

module.exports.waitingRoomSchema = {
    color: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        user_color: Joi.string().valid('RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PINK', 'PURPLE').required()
    }),
    ready: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        user_ready: Joi.boolean().required().strict()
    }),
};

module.exports.gameSchema = {
    startGame: Joi.object({
        room_idx: Joi.number().integer().required().strict()
    }),
    startSet: Joi.object({
        game_idx: Joi.number().integer().required().strict(),
        game_set_no: Joi.number().integer().required().strict()
    }),
    vote: Joi.object({
        game_set_idx: Joi.number().integer().required().strict(),
        user_idx: Joi.number().integer().required().strict()
    }),
    humanKeyword: Joi.object({
        game_set_idx: Joi.number().integer().required().strict(),
        game_set_human_answer: Joi.string().required()
    }),
    draw: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        draw_info: Joi.object({
            color: Joi.string().regex(/^#[A-Fa-f0-9]{6}/).required(), // color value 확인
            previous_x: Joi.number().required(),
            previous_y: Joi.number().required(),
            current_x: Joi.number().required(),
            current_y: Joi.number().required()
        })
    }),
    chat: Joi.object({
        msg: Joi.string().required()
    })
};
