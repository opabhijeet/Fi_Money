import Product from "../models/Product";
import { validationResult } from 'express-validator';

export default async (req, res) => {
    const p = await Product.findByIdAndUpdate(req.params.id,
      { quantity: req.body.quantity }, 
      { new: true }
    );
    if (!p){
        return res.status(404).json({ msg: 'Not found' });
    }
    res.json(p);
}