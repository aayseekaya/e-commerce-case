const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const fs = require('fs');

// Product images için storage
const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/product-images';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const uploadProductImage = multer({ storage: productImageStorage });

// Genel upload için storage
const generalStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/general';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const uploadGeneral = multer({ storage: generalStorage });

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         is_variant:
 *           type: boolean
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         barcode:
 *           type: string
 *     ProductVariant:
 *       type: object
 *       properties:
 *         color_id:
 *           type: integer
 *         size:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         barcode:
 *           type: string
 *     Color:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         hex_code:
 *           type: string
 *     ProductImage:
 *       type: object
 *       properties:
 *         color_id:
 *           type: integer
 *         image_url:
 *           type: string
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Tüm ürünleri listeler
 *     tags: [Ürünler]
 *     parameters:
 *       - in: query
 *         name: color_id
 *         schema:
 *           type: integer
 *         description: Renk ID'si ile filtreleme
 *     responses:
 *       200:
 *         description: Ürün listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/products', productController.getAllProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Yeni ürün ekler
 *     tags: [Ürünler]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Oluşturulan ürün
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post('/products', productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Ürün detayını getirir
 *     tags: [Ürünler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ürün detayları
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get('/products/:id', productController.getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Ürünü günceller
 *     tags: [Ürünler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Güncellenen ürün
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.put('/products/:id', productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Ürünü siler
 *     tags: [Ürünler]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Silindi
 */
router.delete('/products/:id', productController.deleteProduct);

/**
 * @swagger
 * /products/{productId}/variants:
 *   post:
 *     summary: Ürüne varyasyon ekler
 *     tags: [Varyasyonlar]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       201:
 *         description: Oluşturulan varyasyon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 */
router.post('/products/:productId/variants', productController.createVariant);

/**
 * @swagger
 * /products/{productId}/variants:
 *   get:
 *     summary: Ürünün varyasyonlarını listeler
 *     tags: [Varyasyonlar]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Varyasyon listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductVariant'
 */
router.get('/products/:productId/variants', productController.getVariantsByProduct);

/**
 * @swagger
 * /variants/{variantId}:
 *   put:
 *     summary: Varyasyonu günceller
 *     tags: [Varyasyonlar]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductVariant'
 *     responses:
 *       200:
 *         description: Güncellenen varyasyon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductVariant'
 */
router.put('/variants/:variantId', productController.updateVariant);

/**
 * @swagger
 * /variants/{variantId}:
 *   delete:
 *     summary: Varyasyonu siler
 *     tags: [Varyasyonlar]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Silindi
 */
router.delete('/variants/:variantId', productController.deleteVariant);

/**
 * @swagger
 * /colors:
 *   get:
 *     summary: Renkleri listeler
 *     tags: [Renkler]
 *     responses:
 *       200:
 *         description: Renk listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Color'
 */
router.get('/colors', productController.getAllColors);

/**
 * @swagger
 * /colors:
 *   post:
 *     summary: Yeni renk ekler
 *     tags: [Renkler]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Color'
 *     responses:
 *       201:
 *         description: Oluşturulan renk
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 */
router.post('/colors', productController.createColor);

/**
 * @swagger
 * /products/{productId}/images:
 *   post:
 *     summary: Ürüne veya renge görsel ekler
 *     tags: [Görseller]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductImage'
 *     responses:
 *       201:
 *         description: Oluşturulan görsel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductImage'
 */
router.post('/products/:productId/images', productController.addProductImage);

/**
 * @swagger
 * /products/{productId}/images:
 *   get:
 *     summary: Ürünün görsellerini listeler (renge göre filtrelenebilir)
 *     tags: [Görseller]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: color_id
 *         schema:
 *           type: integer
 *         description: Renk ID'si ile filtreleme
 *     responses:
 *       200:
 *         description: Görsel listesi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductImage'
 */
router.get('/products/:productId/images', productController.getProductImages);

/**
 * @swagger
 * /products/{productId}/upload-image:
 *   post:
 *     summary: Ürüne veya renge dosya olarak görsel yükler
 *     tags: [Görseller]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Yüklenecek görsel dosyası
 *       - in: formData
 *         name: color_id
 *         type: integer
 *         required: false
 *         description: Varyasyonlu ürünlerde renk ID'si
 *     responses:
 *       201:
 *         description: Yüklenen görselin kaydı
 */
router.post('/products/:productId/upload-image', uploadProductImage.single('image'), productController.uploadProductImage);

/**
 * @swagger
 * /upload-image:
 *   post:
 *     summary: Genel amaçlı dosya yükleme, sadece dosya yükler ve URL döner
 *     tags: [Görseller]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Yüklenen dosyanın URL'si
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 */
router.post('/upload-image', uploadGeneral.single('image'), productController.uploadOnlyImage);

module.exports = router; 