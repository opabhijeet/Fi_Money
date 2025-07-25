import express  from 'express';
import mongoose from 'mongoose';
import router   from './routes.js';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './swagger.js';

await mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/inventory');

const app = express();
app.use(express.json());
app.use('/api', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,           
}));

app.listen(8080, () => console.log('API on http://localhost:8080'));