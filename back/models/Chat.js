const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chat', {
    chat_idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    chat_msg: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_user_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'user_idx'
      }
    },
    room_room_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Room',
        key: 'room_idx'
      }
    }
  }, {
    sequelize,
    tableName: 'Chat',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "chat_idx" },
          { name: "user_user_idx" },
          { name: "room_room_idx" },
        ]
      },
      {
        name: "fk_Chat_User1_idx",
        using: "BTREE",
        fields: [
          { name: "user_user_idx" },
        ]
      },
      {
        name: "fk_Chat_Room1_idx",
        using: "BTREE",
        fields: [
          { name: "room_room_idx" },
        ]
      },
    ]
  });
};
