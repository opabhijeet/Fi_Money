import { useState, useEffect } from 'react';
import { 
  CubeIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import ApiService from '../services/api';
import AddProductModal from '../components/AddProduct.jsx';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    users: 0,
    mostAddedProduct: null
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const productsData = await ApiService.getProducts(1, 5);
      setRecentProducts(productsData || []);
      
      const productStats = await ApiService.getAnalytics();
      
      // Calculate stats from products data
      const totalProducts = productStats.products || 0;
      const totalValue = productStats.totalInventoryValue || 0;
      const lowStock = productStats.lowStockAlerts || 0;
      const users = productStats.users || 0;
      const mostAddedProduct = productStats.mostAddedProduct || null;

      setStats({ totalProducts, totalValue, lowStock, users, mostAddedProduct });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: CubeIcon,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      title: 'Low Stock',
      value: stats.lowStock,
      icon: ChartBarIcon,
      color: 'bg-orange-500',
    },
    {
      title: 'Total Users',
      value: stats.users,
      icon: CubeIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'Most Added Product',
      value: stats.mostAddedProduct ? stats.mostAddedProduct.name : 'N/A',
      icon: CubeIcon,
      color: 'bg-yellow-500',
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.title}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Products</h2>
          <button className="btn-primary text-sm"
          onClick={() => setShowAddModal(true)}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Product
          </button>
        </div>
        
        {recentProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.quantity < 10 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {product.quantity < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No products</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding a new product.
            </p>
          </div>
        )}
      </div>

      {showAddModal && (
            <AddProductModal 
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
                setShowAddModal(false);
                fetchProducts();
            }}
            />
        )}
    </div>
  );
}

export default Dashboard;
