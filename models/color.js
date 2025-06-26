'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define('Color', {
    name: DataTypes.STRING,
    hexCode: { type: DataTypes.STRING, field: 'hex_code' },
    createdAt: { type: DataTypes.DATE, field: 'createdAt' },
    updatedAt: { type: DataTypes.DATE, field: 'updatedAt' }
  }, {
    tableName: 'Colors',
    underscored: true
  });

  Color.associate = models => {
    Color.hasMany(models.ProductVariant, { foreignKey: 'color_id', as: 'productVariants' });
    Color.hasMany(models.ProductImage, { foreignKey: 'color_id', as: 'productImages' });
  };

  return Color;
};