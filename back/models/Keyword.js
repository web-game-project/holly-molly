const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Keyword', {
    keyword_idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    keyword_parent: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    keyword_child: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Keyword',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "keyword_idx" },
        ]
      },
    ]
  });
};
