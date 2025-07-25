import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export default function AddProductModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '0',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ApiService.addProduct({
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Product</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input-field mt-1"
                rows="3"
              />
            </div>

            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
