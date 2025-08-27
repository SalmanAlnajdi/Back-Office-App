# 🏢 Back Office Application

A modern, full-stack customer management system built with Angular 20 and Node.js, featuring secure authentication, role-based access control, and comprehensive customer data management.

## ✨ Features

- 🔐 **Secure Authentication System** - JWT-based authentication with refresh tokens
- 👥 **Role-Based Access Control** - Admin and Super Admin roles
- 📊 **Customer Management** - Full CRUD operations for customer data
- �� **Modern UI/UX** - Responsive design with Angular Material-inspired components
- 🚀 **Real-time State Management** - Angular Signals for reactive state
- 🛡️ **Security First** - Password hashing, CORS protection, input validation
- 📱 **Responsive Design** - Mobile-first approach with modern CSS Grid/Flexbox

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (Angular)     │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 4200    │    │   Port: 5050    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend

- **Framework**: Angular 20 (Latest)
- **Language**: TypeScript (Strict mode)
- **State Management**: Angular Signals
- **Styling**: SCSS with CSS Grid & Flexbox
- **Build Tool**: Angular CLI

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Middleware**: CORS, Morgan logging, JSON parsing

### Development Tools

- **Package Manager**: npm
- **Development Server**: Nodemon (Backend), Angular Dev Server (Frontend)
- **Code Quality**: Prettier configuration
- **Testing**: Jasmine & Karma (Frontend)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- MongoDB (local or Atlas cloud)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/Back-Office-App.git
   cd Back-Office-App
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd BProject/back-office
   npm install
   ```

3. **Install Backend Dependencies**

   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the backend directory:

   ```env
   MONGO_URI=Ask me to help to setup the right URI from mongodb
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
   ACCESS_TOKEN_TTL=15m
   REFRESH_TOKEN_TTL=7d
   PORT=5050
   ```

### Running the Application

1. **Start Backend Server**

   ```bash
   cd BProject/backend
   npm start
   ```

   Backend will run on: http://localhost:5050

2. **Start Frontend Application**

   ```bash
   cd BProject/back-office
   npm start
   ```

   Frontend will run on: http://localhost:4200

3. **Access the Application**
   - Open http://localhost:4200 in your browser
   - Register a new admin account or login with existing credentials

## 📁 Project Structure

```
Back-Office-App/
├── BProject/
│   ├── back-office/          # Angular Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/     # Reusable components
│   │   │   │   ├── guards/         # Route guards
│   │   │   │   ├── sections/       # Feature modules
│   │   │   │   │   ├── auth/       # Authentication
│   │   │   │   │   ├── dashboard/  # Main dashboard
│   │   │   │   │   └── customers/  # Customer management
│   │   │   │   └── services/       # API services
│   │   │   └── environments/       # Configuration
│   │   └── package.json
│   └── backend/              # Node.js Backend
│       ├── api/              # API routes
│       │   ├── auth/         # Authentication endpoints
│       │   └── customer/     # Customer endpoints
│       ├── middlewares/      # Custom middleware
│       ├── models/           # Mongoose schemas
│       ├── utils/            # Utility functions
│       └── app.js            # Main server file
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Admin registration
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Get current user (protected)

### Customers

- `GET /api/customers` - Get all customers (public)
- `GET /api/customers/:id` - Get customer by ID (admin only)
- `POST /api/customers` - Create new customer (admin only)
- `PUT /api/customers/:id` - Update customer (admin only)
- `DELETE /api/customers/:id` - Delete customer (admin only)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with 10 salt rounds
- **Role-Based Access**: Admin and Super Admin roles
- **Input Validation**: Mongoose schema validation
- **CORS Protection**: Cross-origin resource sharing
- **Secure Headers**: Authorization headers for protected routes

## 📊 Data Models

### Admin User

```typescript
{
  name: string,           // Required
  email: string,          // Required, unique, validated
  password: string,       // Required, hashed, min 8 chars
  role: "admin" | "superAdmin",  // Default: "admin"
  isActive: boolean,      // Default: true
  lastLogin: Date,
  loginIP: string,
  timestamps: true
}
```

### Customer

```typescript
{
  customerName: string,   // Required, max 255 chars
  customerNumber: number, // Required, 9-digit unique
  dateOfBirth: Date,     // Required
  gender: "M" | "F",     // Required, validated
  timestamps: true
}
```

## Testing

### Frontend Testing

```bash
cd BProject/back-office
npm test
```

### Backend Testing

```bash
cd BProject/backend
npm test
```

## 🚀 Deployment

### Frontend Build

```bash
cd BProject/back-office
npm run build
```

### Backend Production

```bash
cd BProject/backend
NODE_ENV=production npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Salman Alnajdi**
