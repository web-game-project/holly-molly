const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Room', {
    room_idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    room_code: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "room_code_UNIQUE"
    },
    room_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    room_mode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    room_private: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    room_start_member_cnt: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    room_status: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: "waiting"
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
    tableName: 'Room',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "room_idx" },
        ]
      },
      {
        name: "room_code_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "room_code" },
        ]
      },
    ]
  });
};
