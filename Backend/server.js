import 'dotenv/config';
import express  from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router   from './routes.js';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './swagger.js';

await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/inventory');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.listen(8080, () => console.log('API on http://localhost:8080'));