import User from "../../models/User.js";
import Product from "../../models/Product.js";

export default async (req, res) => {
  try {
    const [userCount, productCount, lowStockCount, totalValue, mostAddedProduct] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Product.countDocuments({ quantity: { $lt: 10 } }),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$price'] } } } }
      ]),
      Product.aggregate([
        { $group: { _id: '$name', totalQuantity: { $sum: '$quantity' } } },
        { $sort: { totalQuantity: -1 } },
        { $limit: 1 }
      ])
    ]);

    res.json({
      users: userCount,
      products: productCount,
      lowStockAlerts: lowStockCount,
      totalInventoryValue: totalValue[0]?.total || 0,
      mostAddedProduct: mostAddedProduct[0] ? { name: mostAddedProduct[0]._id, totalQuantity: mostAddedProduct[0].totalQuantity } : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve statistics' });
  }
}