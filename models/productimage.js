'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define('ProductImage', {
    productId: { type: DataTypes.INTEGER, field: 'product_id' },
    variantId: { type: DataTypes.INTEGER, field: 'variant_id' },
    colorId: { type: DataTypes.INTEGER, field: 'color_id' },
    imageUrl: { type: DataTypes.TEXT, field: 'image_url' },
    createdAt: { type: DataTypes.DATE, field: 'createdAt' },
    updatedAt: { type: DataTypes.DATE, field: 'updatedAt' }
  }, {
    tableName: 'ProductImages',
    underscored: true
  });

  ProductImage.associate = models => {
    ProductImage.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    ProductImage.belongsTo(models.ProductVariant, { foreignKey: 'variant_id', as: 'productVariant' });
    ProductImage.belongsTo(models.Color, { foreignKey: 'color_id', as: 'color' });
  };

  return ProductImage;
};