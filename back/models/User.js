const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    user_idx: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    socket_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
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
    tableName: 'User',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_idx" },
        ]
      },
    ]
  });
};
