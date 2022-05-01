const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GameSet', {
    game_set_idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    game_set_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    game_set_img: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    game_set_human_answer: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    game_set_human_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    game_set_ghost_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    keyword_keyword_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Keyword',
        key: 'keyword_idx'
      }
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
    tableName: 'GameSet',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "game_set_idx" },
          { name: "keyword_keyword_idx" },
          { name: "game_game_idx" },
        ]
      },
      {
        name: "fk_game_set_keyword1_idx",
        using: "BTREE",
        fields: [
          { name: "keyword_keyword_idx" },
        ]
      },
      {
        name: "fk_game_set_game1_idx",
        using: "BTREE",
        fields: [
          { name: "game_game_idx" },
        ]
      },
    ]
  });
};
