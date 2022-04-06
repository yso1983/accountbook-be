const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: 'AccountBook Test API',
      version: '1.0.0',
      description: 'Test API with express',
      contact: {
        email: 'yso1983@gmail.com'
      }, 
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    host: 'localhost:3000',
    basePath: '/',
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT"
        },
      }
    },
    security: [{
      jwt: []
    }],
  },
  apis: ['./app/routes/*.js', './routes/lotto/*.js', './swagger/*'],
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};