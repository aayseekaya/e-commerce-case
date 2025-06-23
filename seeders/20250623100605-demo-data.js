'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Renkler
    await queryInterface.bulkInsert('Colors', [
      { name: 'Red', hex_code: '#FF0000', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Blue', hex_code: '#0000FF', createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Standart ürün
    await queryInterface.bulkInsert('Products', [
      {
        name: 'Basic T-shirt',
        description: 'Beyaz pamuklu tişört',
        is_variant: false,
        price: 99.99,
        stock: 100,
        barcode: 'BASIC-TSHIRT-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Varyasyonlu Sweatshirt',
        description: 'Kapüşonlu sweatshirt',
        is_variant: true,
        price: null,
        stock: null,
        barcode: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Varyasyonlar (ürün 2)
    await queryInterface.bulkInsert('ProductVariants', [
      {
        product_id: 2,
        color_id: 1,
        size: 'M',
        price: 199.99,
        stock: 20,
        barcode: 'SWEAT-RED-M',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 2,
        color_id: 2,
        size: 'L',
        price: 209.99,
        stock: 15,
        barcode: 'SWEAT-BLUE-L',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Yeni varyasyon (ürün 2, renk 1, beden S)
      {
        product_id: 2,
        color_id: 1,
        size: 'S',
        price: 189.99,
        stock: 10,
        barcode: 'SWEAT-RED-S',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Görseller (ürün 1 için standart, ürün 2 için renkli, varyasyon id'siz ve bir tanesi varyasyon id'li)
    await queryInterface.bulkInsert('ProductImages', [
      {
        product_id: 1,
        variant_id: null,
        color_id: null,
        image_url: '/uploads/product-images/demo-basic-tshirt.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 2,
        variant_id: null,
        color_id: 1,
        image_url: '/uploads/product-images/demo-sweat-red.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        product_id: 2,
        variant_id: null,
        color_id: 2,
        image_url: '/uploads/product-images/demo-sweat-blue.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Yeni: varyasyon id'si dolu olan görsel (ürün 2, renk 1, beden S, variant_id: 3)
      {
        product_id: 2,
        variant_id: 3,
        color_id: 1,
        image_url: '/uploads/product-images/demo-sweat-red-s.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductVariants', null, {});
    await queryInterface.bulkDelete('ProductImages', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Colors', null, {});
  }
};
