'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const ProductVariant = sequelize.define('ProductVariant', {
    productId: { type: DataTypes.INTEGER, field: 'product_id' },
    colorId: { type: DataTypes.INTEGER, field: 'color_id' },
    size: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    stock: DataTypes.INTEGER,
    barcode: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE, field: 'createdAt' },
    updatedAt: { type: DataTypes.DATE, field: 'updatedAt' }
  }, {
    tableName: 'ProductVariants',
    underscored: true
  });

  ProductVariant.associate = models => {
    ProductVariant.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    ProductVariant.belongsTo(models.Color, { foreignKey: 'color_id', as: 'color' });
    ProductVariant.hasMany(models.ProductImage, { foreignKey: 'variant_id', as: 'productImages' });
  };

  return ProductVariant;
};