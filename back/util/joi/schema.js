const userSchema = {
    login: {
        name: Joi.string().required()
    },
    refresh: {
        refresh_token: Joi.string().required()
    }
};

const roomSchema = {
    create: Joi.object({
        room_name: Joi.string().required(),
        room_mode: Joi.string().required().value('easy', 'hard'),
        room_private: Joi.boolean().required().strict(),
        room_start_member_cnt: Joi.number().integer().required().value(4, 5, 6).strict()
    }),
    filter: Joi.object({
        page: Joi.number().intger(),
        room_mode: Joi.string().value('easy', 'hard'),
        room_start_member_cnt: Joi.number().integer().value(4, 5, 6),
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
        room_mode: Joi.string().required(),
        room_start_member_cnt: Joi.number().integer().required()
    })
};

const waitingRoomSchema = {
    color: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        user_color: Joi.string().required()
    }),
    ready: Joi.object({
        room_idx: Joi.number().integer().required().strict(),
        user_ready: Joi.boolean().required().strict()
    }),
};

const gameSchema = {
    startGame: Joi.object({
        room_ix: Joi.number().integer().required().strict()
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
    /*draw: Joi.object({
        draw_info: Joi.object().required(),
        color: Joi.string().regex(/^#[A-Fa-f0-9]{6}/).required(),
        previous_x: Joi.number().required(),
        previous_y: Joi.number().required(),
        current_x: Joi.number().required(),
        current_y: Joi.number().required(),
    }),*/
    chat: Joi.object({
        msg: Joi.stringG().required()
    })
};
