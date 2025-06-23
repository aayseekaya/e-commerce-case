const { Product, ProductVariant, Color, ProductImage } = require('../../models');
const { Op } = require('sequelize');

// Ürünler
exports.getAllProducts = async (req, res) => {
  const { color_id } = req.query;
  let products;
  if (color_id) {
    products = await Product.findAll({
      include: [
        { model: ProductVariant, as: 'productVariants' },
        { model: ProductImage, as: 'productImages' }
      ]
    });
    // color_id ile filtreleme için sonradan filtrele
    products = products.filter(p => p.productVariants.some(v => v.colorId == color_id));
  } else {
    products = await Product.findAll({
      include: [
        { model: ProductVariant, as: 'productVariants' },
        { model: ProductImage, as: 'productImages' }
      ]
    });
  }
  res.json(products.map(p => p.toJSON()));
};

exports.createProduct = async (req, res) => {
  const exists = await Product.findOne({ where: { barcode: req.body.barcode } });
  if (exists) return res.status(400).json({ error: 'Bu barcode zaten kullanılıyor!' });
  const product = await Product.create(req.body);
  res.status(201).json(toCamelCase(product.toJSON()));
};

exports.getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.id, {
    include: [
      { model: ProductVariant, as: 'productVariants' },
      { model: ProductImage, as: 'productImages' }
    ]
  });
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  res.json(toCamelCase(product.toJSON()));
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  // Barcode benzersizliği kontrolü (güncellerken)
  if (req.body.barcode && req.body.barcode !== product.barcode) {
    const exists = await Product.findOne({ where: { barcode: req.body.barcode } });
    if (exists) return res.status(400).json({ error: 'Bu barcode zaten kullanılıyor!' });
  }
  await product.update(req.body);
  res.json(toCamelCase(product.toJSON()));
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  await product.destroy();
  res.status(204).send();
};

// Varyasyonlar
exports.createVariant = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByPk(productId);
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  if (!product.is_variant) return res.status(400).json({ error: 'Bu ürüne varyasyon eklenemez (standart ürün)!' });
  // Barcode benzersizliği kontrolü
  const exists = await ProductVariant.findOne({ where: { barcode: req.body.barcode } });
  if (exists) return res.status(400).json({ error: 'Bu barcode zaten kullanılıyor!' });
  // Aynı ürün, renk, beden kombinasyonu tekrar edemez (unique constraint migrationda var ama burada da kontrol edelim)
  const duplicate = await ProductVariant.findOne({ where: { product_id: productId, color_id: req.body.color_id, size: req.body.size } });
  if (duplicate) return res.status(400).json({ error: 'Bu ürün için aynı renk ve beden kombinasyonu zaten var!' });
  // En az bir görsel kontrolü (her renk için)
  const images = await ProductImage.findAll({ where: { product_id: productId, color_id: req.body.color_id } });
  if (!images || images.length === 0) return res.status(400).json({ error: 'Bu varyasyonun rengi için en az bir görsel eklenmeli!' });
  const variant = await ProductVariant.create({ ...req.body, product_id: productId });
  res.status(201).json(toCamelCase(variant.toJSON()));
};

exports.getVariantsByProduct = async (req, res) => {
  const { productId } = req.params;
  const variants = await ProductVariant.findAll({
    where: { product_id: productId },
    include: [
      { model: Color, as: 'color' },
      { model: ProductImage, as: 'productImages' }
    ]
  });
  res.json(toCamelCase(variants.map(v => v.toJSON())));
};

exports.updateVariant = async (req, res) => {
  const { variantId } = req.params;
  const variant = await ProductVariant.findByPk(variantId);
  if (!variant) return res.status(404).json({ error: 'Varyasyon bulunamadı' });
  // Barcode benzersizliği kontrolü (güncellerken)
  if (req.body.barcode && req.body.barcode !== variant.barcode) {
    const exists = await ProductVariant.findOne({ where: { barcode: req.body.barcode } });
    if (exists) return res.status(400).json({ error: 'Bu barcode zaten kullanılıyor!' });
  }
  await variant.update(req.body);
  res.json(toCamelCase(variant.toJSON()));
};

exports.deleteVariant = async (req, res) => {
  const { variantId } = req.params;
  const variant = await ProductVariant.findByPk(variantId);
  if (!variant) return res.status(404).json({ error: 'Varyasyon bulunamadı' });
  await variant.destroy();
  res.status(204).send();
};

// Renkler
exports.getAllColors = async (req, res) => {
  const colors = await Color.findAll();
  res.json(toCamelCase(colors.map(c => c.toJSON())));
};

exports.createColor = async (req, res) => {
  const color = await Color.create(req.body);
  res.status(201).json(toCamelCase(color.toJSON()));
};

// Görseller
exports.addProductImage = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByPk(productId);
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  // Standart ürünse, sadece product_id ile eklenir (color_id ve variant_id olmadan)
  // Varyasyonlu ürünse, color_id zorunlu olmalı
  if (product.is_variant && !req.body.color_id) {
    return res.status(400).json({ error: 'Varyasyonlu ürünlerde görsel eklerken color_id zorunludur!' });
  }
  const image = await ProductImage.create({ ...req.body, product_id: productId });
  res.status(201).json(toCamelCase(image.toJSON()));
};

exports.getProductImages = async (req, res) => {
  const { productId } = req.params;
  const { color_id } = req.query;
  const where = { product_id: productId };
  if (color_id) where.color_id = color_id;
  const images = await ProductImage.findAll({ where });
  res.json(toCamelCase(images.map(i => i.toJSON())));
};

exports.uploadProductImage = async (req, res) => {
  const { productId } = req.params;
  const { color_id } = req.body;
  const product = await Product.findByPk(productId);
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı' });
  if (product.is_variant && !color_id) {
    return res.status(400).json({ error: 'Varyasyonlu ürünlerde color_id zorunludur!' });
  }
  if (!req.file) return res.status(400).json({ error: 'Görsel dosyası zorunludur!' });
  const imageUrl = `/uploads/product-images/${req.file.filename}`;
  const image = await ProductImage.create({ product_id: productId, color_id: color_id || null, image_url: imageUrl });
  res.status(201).json(toCamelCase(image.toJSON()));
};

exports.uploadOnlyImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Görsel dosyası zorunludur!' });
  const imageUrl = `/uploads/general/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
};

// snake_case objeyi camelCase objeye dönüştürür
function toCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}
