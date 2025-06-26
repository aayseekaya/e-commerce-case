const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'e-COMMERCE CASE API',
      version: '1.0.0',
      description: 'Ürün ve varyasyon API dokümantasyonu'
    },
    servers: [
      { url: 'http://localhost:3000' }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('e-COMMERCE CASE API Çalışıyor!');
});

const productRoutes = require('./routes/product');
app.use(productRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
}); 