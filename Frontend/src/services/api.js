import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials) {
    const response = await this.api.post('/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/register', userData);
    return response.data;
  }

  async getProducts(page = 1, limit = 10, search = '') {
    const params = { page, limit };
    if (search) params.search = search;
    
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  async addProduct(productData) {
    const response = await this.api.post('/products', productData);
    return response.data;
  }

  async updateProductQuantity(productId, quantity) {
    const response = await this.api.put(`/products/${productId}/quantity`, { quantity });
    return response.data;
  }

  async getAnalytics() {
    const response = await this.api.get('/analytics');
    return response.data;
  }
}

export default new ApiService();
