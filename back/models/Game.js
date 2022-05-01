const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Game', {
    game_idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    room_room_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Room',
        key: 'room_idx'
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
    tableName: 'Game',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "game_idx" },
          { name: "room_room_idx" },
        ]
      },
      {
        name: "fk_game_room1_idx",
        using: "BTREE",
        fields: [
          { name: "room_room_idx" },
        ]
      },
    ]
  });
};
