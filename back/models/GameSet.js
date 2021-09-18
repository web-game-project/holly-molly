const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('GameSet', {
    game_set_idx: {
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
    game_set_mafia_answer: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    game_set_mafia_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    game_set_citizen_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    keyword_keyword_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Keyword',
        key: 'keyword_idx'
      }
    },
    game_game_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Game',
        key: 'game_idx'
      }
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
