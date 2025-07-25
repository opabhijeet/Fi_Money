import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory API',
      version: '1.0.0',
      description: 'CRUD inventory service with JWT auth',
    },
    servers: [{ url: 'http://localhost:8080' }],
  },
  apis: ['./routes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
