import express from 'express';
import { body, param } from 'express-validator';
import * as Auth from './lib/auth.js';

import login from './controllers/login.js';
import register from './controllers/register.js';
import add_product from './controllers/add_product.js';
import update_product from './controllers/update_product.js';
import get_products from './controllers/get_products.js';

const r = express.Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:                     # ⬅ Bearer / JWT security scheme
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT             # for docs only
 *   schemas:
 *     Login:
 *       type: object
 *       required: [username, password]
 *       properties:
 *         username: { type: string, example: alice }
 *         password: { type: string, example: mypassword }
 *     Token:
 *       type: object
 *       properties:
 *         access_token: { type: string, example: eyJhbGciOiJIUzI1... }
 *     ProductIn:
 *       type: object
 *       required: [name, price]
 *       properties:
 *         name:        { type: string, example: Phone }
 *         type:        { type: string, example: Electronics }
 *         sku:         { type: string, example: PHN-001 }
 *         imageUrl:    { type: string, format: uri, example: https://ex.com/phone.jpg }
 *         description: { type: string, example: Latest Phone }
 *         quantity:    { type: integer, example: 5, minimum: 0 }
 *         price:       { type: number, format: float, example: 999.99 }
 *     ProductOut:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductIn'
 *         - type: object
 *           properties:
 *             _id:       { type: string, example: 661eaffb4b1e8c261fdfc9e2 }
 */

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Returns a JWT access token on valid credentials.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Token'
 *       401:
 *         description: Invalid username or password
 */

r.post('/login',
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty(),
  login
  );

/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: User registration
 *     description: Creates a new user account and returns its identifier.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: alice
 *               password:
 *                 type: string
 *                 example: mysecret
 *     responses:
 *       201:
 *         description: Account successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User created
 *                 userId:
 *                   type: string
 *                   example: 66201b8de15f6c9269236571
 *       400:
 *         description: Validation errors (missing or empty fields)
 *       409:
 *         description: Username already exists
 *     security: []          # registration is public, so no bearerAuth here
 */

r.post('/register',
  body('username').isString().notEmpty(),
  body('password').isString().notEmpty(),
  register
);

/* --------- protected routes --------- */
r.use(Auth.authMid);

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Add product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []              # protected endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductIn'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductOut'
 *       409:
 *         description: Duplicate SKU
 */

r.post('/products',
  body('name').notEmpty(),
  body('price').isFloat({ gt: 0 }),
  add_product
  );

/**
 * @openapi
 * /api/products/{id}/quantity:
 *   put:
 *     summary: Update product quantity
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: MongoDB ObjectId of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity: { type: integer, minimum: 0, example: 15 }
 *     responses:
 *       200:
 *         description: Updated product document
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductOut'
 *       404:
 *         description: Product not found
 */

r.put('/products/:id/quantity',
  param('id').isMongoId(),
  body('quantity').isInt({ min: 0 }),
  update_product
  );

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: List products (paginated)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *         description: Page size
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Full-text search string
 *     responses:
 *       200:
 *         description: Paginated product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 docs:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ProductOut' }
 *                 totalDocs:  { type: integer, example: 42 }
 *                 limit:      { type: integer, example: 10 }
 *                 page:       { type: integer, example: 1 }
 *                 totalPages: { type: integer, example: 5 }
 */

r.get('/products', get_products);

export default r;
