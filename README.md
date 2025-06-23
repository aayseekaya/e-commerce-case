# e-COMMERCE CASE

Bu proje, standart ve varyasyonlu ürün yönetimi için Node.js, Express, Sequelize ve PostgreSQL kullanılarak hazırlanmıştır. Swagger ile API dokümantasyonu sunar ve Docker Compose ile kolayca ayağa kaldırılır.

## Özellikler
- Standart ve varyasyonlu ürün desteği
- Renk, beden, fiyat, stok, barcode yönetimi
- Her varyasyon için renk bazlı görsel desteği
- Barcode ve varyasyon kombinasyonlarında benzersizlik
- Renk ile ürün filtreleme
- Swagger ile API dokümantasyonu

## Kurulum

### Gereksinimler
- Docker & Docker Compose

### Başlatma
1. Proje klasöründe terminal açın.
2. Aşağıdaki komutu çalıştırın:
   ```sh
   docker-compose up --build
   ```
3. Uygulama ve veritabanı otomatik olarak başlatılır.

### Migration (İlk kurulumda otomatik çalışır)
Eğer elle çalıştırmak isterseniz:
```sh
docker-compose exec app npx sequelize-cli db:migrate
```

## Seed (Demo Veri) İşlemleri

### Demo Verileri Yüklemek
Aşağıdaki komut ile demo verileri veritabanına ekleyebilirsin:

```sh
docker-compose exec app npx sequelize-cli db:seed:all
```

### Demo Verileri Sıfırlamak (Tümünü Silip Baştan Yüklemek)
1. Tüm seed verilerini sil:
   ```sh
   docker-compose exec app npx sequelize-cli db:seed:undo:all
   ```
2. (Opsiyonel) Tüm veritabanını sıfırla ve migrationları tekrar uygula:
   ```sh
   docker-compose exec app npx sequelize-cli db:migrate:undo:all
   docker-compose exec app npx sequelize-cli db:migrate
   ```
3. Demo verileri tekrar yükle:
   ```sh
   docker-compose exec app npx sequelize-cli db:seed:all
   ```

> **Not:** Bu işlemler development ortamı içindir. Gerçek veritabanında kullanmayınız!

## API Kullanımı

### Swagger Arayüzü
Tüm endpointleri ve örnekleri görmek için:
```
http://localhost:3000/api-docs
```

### Temel Endpointler

#### Ürünler
- **GET /products** : Tüm ürünleri listeler
- **POST /products** : Yeni ürün ekler
- **GET /products/:id** : Ürün detayını getirir
- **PUT /products/:id** : Ürünü günceller
- **DELETE /products/:id** : Ürünü siler

#### Varyasyonlar
- **POST /products/:productId/variants** : Ürüne varyasyon ekler
- **GET /products/:productId/variants** : Ürünün varyasyonlarını listeler
- **PUT /variants/:variantId** : Varyasyonu günceller
- **DELETE /variants/:variantId** : Varyasyonu siler

#### Renkler
- **GET /colors** : Renkleri listeler
- **POST /colors** : Yeni renk ekler

#### Görseller
- **POST /products/:productId/images** : Ürüne/renge görsel ekler
- **GET /products/:productId/images?color_id=RENKID** : Ürünün belirli renge ait görsellerini getirir

### Örnek Ürün Ekleme (Standart)
```bash
curl -X POST 'http://localhost:3000/products' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Tişört",
    "description": "Pamuklu beyaz tişört",
    "is_variant": false,
    "price": 199.99,
    "stock": 50,
    "barcode": "ABC123"
  }'
```

### Örnek Ürün Ekleme (Varyasyonlu)
```bash
curl -X POST 'http://localhost:3000/products' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Sweatshirt",
    "description": "Kapüşonlu sweatshirt",
    "is_variant": true
  }'
```

### Renk Ekleme
```bash
curl -X POST 'http://localhost:3000/colors' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Red",
    "hex_code": "#FF0000"
  }'
```

### Varyasyon Ekleme
Önce ilgili ürün ve renk için en az bir görsel ekleyin:
```bash
curl -X POST 'http://localhost:3000/products/1/images' \
  -H 'Content-Type: application/json' \
  -d '{
    "color_id": 1,
    "image_url": "https://example.com/red-m.jpg"
  }'
```
Sonra varyasyon ekleyin:
```bash
curl -X POST 'http://localhost:3000/products/1/variants' \
  -H 'Content-Type: application/json' \
  -d '{
    "color_id": 1,
    "size": "M",
    "price": 249.99,
    "stock": 20,
    "barcode": "SWEAT-RED-M"
  }'
```

### Renkle Ürün Filtreleme
```
GET /products?color_id=1
```

## Mimari
- **models/**: Sequelize modelleri
- **migrations/**: Veritabanı migration dosyaları
- **src/routes/**: Express route dosyaları
- **src/controllers/**: CRUD ve iş kuralları

## Notlar
- Standart ürünlerde görseller doğrudan ürünle ilişkilidir (sadece product_id ile eklenir).
- Varyasyonlu ürünlerde, her renk için en az bir görsel eklenmelidir.
- Barcode hem ürün hem varyasyon için benzersizdir.
- Aynı ürün, aynı renk+beden kombinasyonunu tekrar ekleyemez.

---
Her türlü soru ve katkı için iletişime geçebilirsiniz! 