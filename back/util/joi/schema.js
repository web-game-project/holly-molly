const Joi = require('joi');

module.exports.userSchema = {
    login: Joi.object({
        name: Joi.string().min(2).max(10).required(),
    }),
    refresh: Joi.object({
        refresh_token: Joi.string().required(),
    }),
};

module.exports.roomSchema = {
    create: Joi.object({
        room_name: Joi.string().min(2).max(12).required(),
        room_mode: Joi.string().valid('easy', 'hard').required(),
        room_private: Joi.boolean().required().strict(),
        room_start_member_cnt: Joi.number()
            .integer()
            .valid(4, 5, 6)
            .required()
            .strict(),
    }),
    filter: Joi.object({
        page: Joi.number().integer(),
        room_mode: Joi.alternatives().try(
            Joi.array().min(1).items(Joi.string().valid('easy', 'hard')), 
            Joi.string().valid('easy', 'hard')
        ),
        room_start_member_cnt: Joi.alternatives().try(
            Joi.array().min(1).items(Joi.number().integer().valid(4,5,6)), 
            Joi.number().integer().valid(4, 5, 6)
        ),
        is_waiting: Joi.boolean(),
    }),
    join: Joi.object({
        room_idx: Joi.number().integer().strict(),
        room_code: Joi.string(),
        room_mode: Joi.alternatives().try(
            Joi.array().min(1).items(Joi.string().valid('easy', 'hard')), 
            Joi.string().valid('easy', 'hard')
        ),
        room_start_member_cnt: Joi.alternatives().try(
            Joi.array().min(1).items(Joi.number().integer().valid(4,5,6)), 
            Joi.number().integer().valid(4, 5, 6)
        ),
    }),
    edit: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        room_name: Joi.string().required(),
        room_mode: Joi.string().valid('easy', 'hard').required(),
        room_start_member_cnt: Joi.number().integer().valid(4, 5, 6).required(),
    }),
};

module.exports.waitingRoomSchema = {
    color: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        user_color: Joi.string()
            .valid('RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PINK', 'PURPLE')
            .required(),
    }),
    ready: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        user_ready: Joi.boolean().required().strict(),
    }),
};

module.exports.gameSchema = {
    startGame: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
    }),
    startSet: Joi.object({
        game_idx: Joi.number().integer().required().strict(),
        game_set_no: Joi.number().integer().valid(2, 3).required(),
    }),
    vote: Joi.object({
        game_set_idx: Joi.number().integer().required().strict(),
        user_idx: Joi.number().integer().required().strict(),
    }),
    humanKeyword: Joi.object({
        game_set_idx: Joi.number().integer().required().strict(),
        game_set_human_answer: Joi.string().allow(null, '').trim(),
    }),
    draw: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        draw_info: Joi.object({
            color: Joi.string()
                .regex(/^#[A-Fa-f0-9]{6}/)
                .required(), // color value 확인
            previous_x: Joi.number().required(),
            previous_y: Joi.number().required(),
            current_x: Joi.number().required(),
            current_y: Joi.number().required(),
        }),
    }),
    chat: Joi.object({
        user_color : Joi.string()
            .regex(/^#[A-Fa-f0-9]{6}/)
            .required(),
        msg: Joi.string().required(),
    }),
    waitHumanAnswer: Joi.object({
        game_set_idx: Joi.number().integer().required().strict(),
    }),
};
