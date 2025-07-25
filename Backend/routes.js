import express from 'express';
import { body, param, validationResult } from 'express-validator';
import * as Auth from './lib/auth.js';

import login from './controllers/login.js';
import register from './controllers/register.js';
import add_product from './controllers/add_product.js';
import update_product from './controllers/update_product.js';
import get_products from './controllers/get_products.js';

const r = express.Router();

r.post('/login',
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty(),
  login
  );

r.post('/register',
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty(),
  register
);

/* --------- protected routes --------- */
r.use(Auth.authMid);

r.post('/products',
  body('name').notEmpty(),
  body('price').isFloat({ gt: 0 }),
  add_product
  );

/** Update quantity */
r.put('/products/:id/quantity',
  param('id').isMongoId(),
  body('quantity').isInt({ min: 0 }),
  update_product
  );

/** Paginated list */
r.get('/products', get_products);

export default r;
