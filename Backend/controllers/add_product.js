import { validationResult } from 'express-validator';
import Product from '../models/Product.js';

export default async (req, res) => {
    const valErr = validationResult(req);
    if (!valErr.isEmpty()){
        return res.status(400).json({ errors: valErr.array() });
    }
    try { 
        const p = await Product.create(req.body); 
        const productObj = p.toObject();
        productObj.product_id = p._id;
        res.status(201).json(productObj); 
    }
    catch (e) { 
        res.status(409).json({ msg: 'Duplicate SKU' }); 
    }
}