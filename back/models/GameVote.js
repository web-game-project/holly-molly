const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GameVote', {
    game_vote_idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    game_vote_cnt: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    game_set_game_set_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'GameSet',
        key: 'game_set_idx'
      }
    },
    game_member_game_member_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'GameMember',
        key: 'game_member_idx'
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
    tableName: 'GameVote',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "game_vote_idx" },
          { name: "game_set_game_set_idx" },
          { name: "game_member_game_member_idx" },
        ]
      },
      {
        name: "fk_game_vote_game_set1_idx",
        using: "BTREE",
        fields: [
          { name: "game_set_game_set_idx" },
        ]
      },
      {
        name: "fk_game_vote_game_member1_idx",
        using: "BTREE",
        fields: [
          { name: "game_member_game_member_idx" },
        ]
      },
    ]
  });
};
