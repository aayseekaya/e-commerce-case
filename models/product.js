'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    isVariant: { type: DataTypes.BOOLEAN, field: 'is_variant' },
    price: DataTypes.DECIMAL,
    stock: DataTypes.INTEGER,
    barcode: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  }, {
    tableName: 'Products',
    underscored: true
  });

  Product.associate = models => {
    Product.hasMany(models.ProductVariant, { foreignKey: 'product_id', as: 'productVariants' });
    Product.hasMany(models.ProductImage, { foreignKey: 'product_id', as: 'productImages' });
  };

  return Product;
};