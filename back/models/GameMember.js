const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GameMember', {
    game_member_idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    game_member_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    game_member_role: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    game_game_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Game',
        key: 'game_idx'
      }
    },
    wrm_wrm_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'WaitingRoomMember',
        key: 'wrm_idx'
      }
    },
    wrm_user_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'WaitingRoomMember',
        key: 'user_user_idx'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'GameMember',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "game_member_idx" },
          { name: "game_game_idx" },
          { name: "wrm_wrm_idx" },
          { name: "wrm_user_idx" },
        ]
      },
      {
        name: "fk_game_room_member_game1_idx",
        using: "BTREE",
        fields: [
          { name: "game_game_idx" },
        ]
      },
      {
        name: "fk_game_member_waiting_room_member1_idx",
        using: "BTREE",
        fields: [
          { name: "wrm_wrm_idx" },
          { name: "wrm_user_idx" },
        ]
      },
    ]
  });
};
