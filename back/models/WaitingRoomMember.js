const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WaitingRoomMember', {
    wrm_idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    wrm_user_color: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    wrm_leader: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    wrm_user_ready: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
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
    user_user_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'user_idx'
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
    tableName: 'WaitingRoomMember',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "wrm_idx" },
          { name: "user_user_idx" },
          { name: "room_room_idx" },
        ]
      },
      {
        name: "fk_waiting_room_room1_idx",
        using: "BTREE",
        fields: [
          { name: "room_room_idx" },
        ]
      },
      {
        name: "fk_waiting_room_user1_idx",
        using: "BTREE",
        fields: [
          { name: "user_user_idx" },
        ]
      },
    ]
  });
};
