'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Game.belongsToMany(db.Keyword, { as: 'keyword_keyword_idx_Keywords', through: db.GameSet, foreignKey: "game_game_idx", otherKey: "keyword_keyword_idx" });
db.GameMember.belongsToMany(db.GameSet, { as: 'game_set_game_set_idx_GameSets', through: db.GameVote, foreignKey: "game_member_game_member_idx", otherKey: "game_set_game_set_idx" });
db.GameSet.belongsToMany(db.GameMember, { as: 'game_member_game_member_idx_GameMembers', through: db.GameVote, foreignKey: "game_set_game_set_idx", otherKey: "game_member_game_member_idx" });
db.Keyword.belongsToMany(db.Game, { as: 'game_game_idx_Games', through: db.GameSet, foreignKey: "keyword_keyword_idx", otherKey: "game_game_idx" });
db.Room.belongsToMany(db.User, { as: 'user_user_idx_Users', through:db. Chat, foreignKey: "room_room_idx", otherKey: "user_user_idx" });
db.Room.belongsToMany(db.User, { as: 'user_user_idx_User_WaitingRoomMembers', through: db.WaitingRoomMember, foreignKey: "room_room_idx", otherKey: "user_user_idx" });
db.User.belongsToMany(db.Room, { as: 'room_room_idx_Rooms', through: db.Chat, foreignKey: "user_user_idx", otherKey: "room_room_idx" });
db.User.belongsToMany(db.Room, { as: 'room_room_idx_Room_WaitingRoomMembers', through: db.WaitingRoomMember, foreignKey: "user_user_idx", otherKey: "room_room_idx" });
db.GameMember.belongsTo(db.Game, { as: "game_game_idx_Game", foreignKey: "game_game_idx"});
db.Game.hasMany(db.GameMember, { as: "GameMembers", foreignKey: "game_game_idx"});
db.GameSet.belongsTo(db.Game, { as: "game_game_idx_Game", foreignKey: "game_game_idx"});
db.Game.hasMany(db.GameSet, { as: "GameSets", foreignKey: "game_game_idx"});
db.GameVote.belongsTo(db.GameMember, { as: "game_member_game_member_idx_GameMember", foreignKey: "game_member_game_member_idx"});
db.GameMember.hasMany(db.GameVote, { as: "GameVotes", foreignKey: "game_member_game_member_idx"});
db.GameVote.belongsTo(db.GameSet, { as: "game_set_game_set_idx_GameSet", foreignKey: "game_set_game_set_idx"});
db.GameSet.hasMany(db.GameVote, { as: "GameVotes", foreignKey: "game_set_game_set_idx"});
db.GameSet.belongsTo(db.Keyword, { as: "keyword_keyword_idx_Keyword", foreignKey: "keyword_keyword_idx"});
db.Keyword.hasMany(db.GameSet, { as: "GameSets", foreignKey: "keyword_keyword_idx"});
db.Chat.belongsTo(db.Room, { as: "room_room_idx_Room", foreignKey: "room_room_idx"});
db.Room.hasMany(db.Chat, { as: "Chats", foreignKey: "room_room_idx"});
db.Game.belongsTo(db.Room, { as: "room_room_idx_Room", foreignKey: "room_room_idx"});
db.Room.hasMany(db.Game, { as: "Games", foreignKey: "room_room_idx"});
db.WaitingRoomMember.belongsTo(db.Room, { as: "room_room_idx_Room", foreignKey: "room_room_idx"});
db.Room.hasMany(db.WaitingRoomMember, { as: "WaitingRoomMembers", foreignKey: "room_room_idx"});
db.Chat.belongsTo(db.User, { as: "user_user_idx_User", foreignKey: "user_user_idx"});
db.User.hasMany(db.Chat, { as: "Chats", foreignKey: "user_user_idx"});
db.WaitingRoomMember.belongsTo(db.User, { as: "user_user_idx_User", foreignKey: "user_user_idx"});
db.User.hasMany(db.WaitingRoomMember, { as: "WaitingRoomMembers", foreignKey: "user_user_idx"});
db.GameMember.belongsTo(db.WaitingRoomMember, { as: "wrm_wrm_idx_WaitingRoomMember", foreignKey: "wrm_wrm_idx"});
db.WaitingRoomMember.hasMany(db.GameMember, { as: "GameMembers", foreignKey: "wrm_wrm_idx"});
db.GameMember.belongsTo(db.WaitingRoomMember, { as: "wrm_user_idx_WaitingRoomMember", foreignKey: "wrm_user_idx"});
db.WaitingRoomMember.hasMany(db.GameMember, { as: "wrm_user_idx_GameMembers", foreignKey: "wrm_user_idx"});
module.exports = db;
