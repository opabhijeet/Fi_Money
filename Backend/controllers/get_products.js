import Product from "../models/Product.js";

export default async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const options = { page, 
    limit, 
    sort: { createdAt: -1 } 
  };
  const q = search ? { $text: { $search: search } } : {};
  const products = await Product.paginate(q, options);
  res.json(products.docs);
}