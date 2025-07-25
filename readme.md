# Fi Money - Inventory Management System

An inventory management application with JWT authentication, built with Node.js, Express, and MongoDB.

## 🚀 Features

### Backend
- **Authentication System**
  - User registration and login
  - JWT-based authentication
  - Protected routes with middleware
  
- **Product Management**
  - Add new products with name, price, and other details
  - Update product quantities
  - Paginated product listing with search functionality
  - MongoDB integration with Mongoose

- **API Documentation**
  - Complete OpenAPI 3.0 documentation
  - Interactive Swagger UI at `/api-docs`
  - Request/response schemas and examples

- **Validation & Security**
  - Input validation using express-validator
  - Password hashing with bcrypt
  - CORS support
  - Environment variable configuration

### 🚧 In Progress
- Admin portal
- Basic analytics (e.g., most added products)
- Basic frontend with React or Vue
- Dockerize the application

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Documentation**: Swagger UI + OpenAPI 3.0
- **Security**: bcrypt for password hashing

### Frontend (Planned)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Getting Started

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/opabhijeet/Fi_Money.git
   cd Fi_Money/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the Backend directory:
   ```env
   MONGO_URL=mongodb://localhost:27017/inventory
   JWT_SECRET=your_jwt_secret_key
   PORT=8080
   ```

4. **Start the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   - API Base URL: `http://localhost:8080/api`
   - API Documentation: `http://localhost:8080/api-docs`

## 📚 API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - User login

### Products (Protected Routes)
- `POST /api/products` - Add a new product
- `GET /api/products` - Get paginated product list
- `PUT /api/products/:id/quantity` - Update product quantity

### Documentation
- `GET /api-docs` - Interactive API documentation

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Schema

### User Model
```javascript
{
  username: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String (required),
  type: String,
  sku: String,
  imageUrl: String,
  description: String,
  quantity: Number (default: 0),
  price: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

You can test the API using:
- **Swagger UI**: Visit `http://localhost:8080/api-docs` for interactive testing
- **Postman**: Import the OpenAPI spec from `/api-docs`
- **Python Script**: Use the included `test_api.py` script

## 📁 Project Structure

```
Fi_Money/
├── Backend/
│   ├── controllers/          # Route handlers
│   │   ├── add_product.js
│   │   ├── get_products.js
│   │   ├── login.js
│   │   ├── register.js
│   │   └── update_product.js
│   ├── lib/
│   │   └── auth.js          # Authentication middleware
│   ├── models/              # Mongoose models
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes.js           # API routes definition
│   ├── server.js           # Express server setup
│   ├── swagger.js          # Swagger configuration
│   ├── package.json
│   └── test_api.py         # API testing script
├── Frontend/               # 🚧 In Progress
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhijeet Awasthi**
- GitHub: [@opabhijeet](https://github.com/opabhijeet)

## 🙏 Acknowledgments

- Express.js for the robust web framework
- MongoDB for flexible document storage
- Swagger for excellent API documentation
- JWT for secure authentication