var DataTypes = require("sequelize").DataTypes;
var _Chat = require("./Chat");
var _Game = require("./Game");
var _GameMember = require("./GameMember");
var _GameSet = require("./GameSet");
var _GameVote = require("./GameVote");
var _Keyword = require("./Keyword");
var _Room = require("./Room");
var _User = require("./User");
var _WaitingRoomMember = require("./WaitingRoomMember");

function initModels(sequelize) {
  var Chat = _Chat(sequelize, DataTypes);
  var Game = _Game(sequelize, DataTypes);
  var GameMember = _GameMember(sequelize, DataTypes);
  var GameSet = _GameSet(sequelize, DataTypes);
  var GameVote = _GameVote(sequelize, DataTypes);
  var Keyword = _Keyword(sequelize, DataTypes);
  var Room = _Room(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);
  var WaitingRoomMember = _WaitingRoomMember(sequelize, DataTypes);

  Game.belongsToMany(Keyword, { as: 'keyword_keyword_idx_Keywords', through: GameSet, foreignKey: "game_game_idx", otherKey: "keyword_keyword_idx" });
  GameMember.belongsToMany(GameSet, { as: 'game_set_game_set_idx_GameSets', through: GameVote, foreignKey: "game_member_game_member_idx", otherKey: "game_set_game_set_idx" });
  GameSet.belongsToMany(GameMember, { as: 'game_member_game_member_idx_GameMembers', through: GameVote, foreignKey: "game_set_game_set_idx", otherKey: "game_member_game_member_idx" });
  Keyword.belongsToMany(Game, { as: 'game_game_idx_Games', through: GameSet, foreignKey: "keyword_keyword_idx", otherKey: "game_game_idx" });
  Room.belongsToMany(User, { as: 'user_user_idx_Users', through: Chat, foreignKey: "room_room_idx", otherKey: "user_user_idx" });
  Room.belongsToMany(User, { as: 'user_user_idx_User_WaitingRoomMembers', through: WaitingRoomMember, foreignKey: "room_room_idx", otherKey: "user_user_idx" });
  User.belongsToMany(Room, { as: 'room_room_idx_Rooms', through: Chat, foreignKey: "user_user_idx", otherKey: "room_room_idx" });
  User.belongsToMany(Room, { as: 'room_room_idx_Room_WaitingRoomMembers', through: WaitingRoomMember, foreignKey: "user_user_idx", otherKey: "room_room_idx" });
  GameMember.belongsTo(Game, { as: "game_game_idx_Game", foreignKey: "game_game_idx"});
  Game.hasMany(GameMember, { as: "GameMembers", foreignKey: "game_game_idx"});
  GameSet.belongsTo(Game, { as: "game_game_idx_Game", foreignKey: "game_game_idx"});
  Game.hasMany(GameSet, { as: "GameSets", foreignKey: "game_game_idx"});
  GameVote.belongsTo(GameMember, { as: "game_member_game_member_idx_GameMember", foreignKey: "game_member_game_member_idx"});
  GameMember.hasMany(GameVote, { as: "GameVotes", foreignKey: "game_member_game_member_idx"});
  GameVote.belongsTo(GameSet, { as: "game_set_game_set_idx_GameSet", foreignKey: "game_set_game_set_idx"});
  GameSet.hasMany(GameVote, { as: "GameVotes", foreignKey: "game_set_game_set_idx"});
  GameSet.belongsTo(Keyword, { as: "keyword_keyword_idx_Keyword", foreignKey: "keyword_keyword_idx"});
  Keyword.hasMany(GameSet, { as: "GameSets", foreignKey: "keyword_keyword_idx"});
  Chat.belongsTo(Room, { as: "room_room_idx_Room", foreignKey: "room_room_idx"});
  Room.hasMany(Chat, { as: "Chats", foreignKey: "room_room_idx"});
  Game.belongsTo(Room, { as: "room_room_idx_Room", foreignKey: "room_room_idx"});
  Room.hasMany(Game, { as: "Games", foreignKey: "room_room_idx"});
  WaitingRoomMember.belongsTo(Room, { as: "room_room_idx_Room", foreignKey: "room_room_idx"});
  Room.hasMany(WaitingRoomMember, { as: "WaitingRoomMembers", foreignKey: "room_room_idx"});
  Chat.belongsTo(User, { as: "user_user_idx_User", foreignKey: "user_user_idx"});
  User.hasMany(Chat, { as: "Chats", foreignKey: "user_user_idx"});
  WaitingRoomMember.belongsTo(User, { as: "user_user_idx_User", foreignKey: "user_user_idx"});
  User.hasMany(WaitingRoomMember, { as: "WaitingRoomMembers", foreignKey: "user_user_idx"});
  GameMember.belongsTo(WaitingRoomMember, { as: "wrm_wrm_idx_WaitingRoomMember", foreignKey: "wrm_wrm_idx"});
  WaitingRoomMember.hasMany(GameMember, { as: "GameMembers", foreignKey: "wrm_wrm_idx"});
  GameMember.belongsTo(WaitingRoomMember, { as: "wrm_user_idx_WaitingRoomMember", foreignKey: "wrm_user_idx"});
  WaitingRoomMember.hasMany(GameMember, { as: "wrm_user_idx_GameMembers", foreignKey: "wrm_user_idx"});

  return {
    Chat,
    Game,
    GameMember,
    GameSet,
    GameVote,
    Keyword,
    Room,
    User,
    WaitingRoomMember,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
