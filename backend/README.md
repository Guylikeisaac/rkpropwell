# Property Website Backend

A comprehensive backend API for a property management website built with Node.js, Express, Neon PostgreSQL, and Cloudinary.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password encryption with bcrypt

- **Property Management**
  - CRUD operations for properties
  - Image upload with Cloudinary integration
  - Property search and filtering
  - Property approval system for admin

- **Database**
  - Neon PostgreSQL database with Sequelize ORM
  - Automated database migrations
  - Data seeding for initial setup

- **Security**
  - Rate limiting
  - CORS protection
  - Input validation
  - File upload security

## Technology Stack

- **Backend Framework**: Node.js with Express
- **Database**: Neon PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **File Upload**: Multer

## Project Structure

```
backend/
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   └── database.js            # Database configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── propertyController.js  # Property management
│   └── userController.js      # User management
├── middleware/
│   ├── auth.js               # Authentication middleware
│   ├── upload.js             # File upload middleware
│   └── validation.js         # Input validation
├── models/
│   ├── User.js               # User model
│   ├── Property.js           # Property model
│   ├── PropertyImage.js      # Property images model
│   ├── Inquiry.js            # Inquiry model
│   └── index.js              # Model associations
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── propertyRoutes.js     # Property routes
│   └── userRoutes.js         # User routes
├── seeders/
│   └── seedDatabase.js       # Database seeding
├── scripts/
│   └── setup.js              # Database setup script
├── utils/
│   ├── fileUtils.js          # File utilities
│   ├── helpers.js            # Helper functions
│   └── jwt.js                # JWT utilities
├── .env.example              # Environment variables example
├── .gitignore                # Git ignore file
├── index.js                  # Main application file
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- Neon PostgreSQL account (free tier available)
- npm or yarn package manager

### 1. Clone the repository

```bash
git clone <repository-url>
cd property-anshu/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the `.env.example` file to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Neon Database Configuration
DATABASE_URL=postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/property_website?sslmode=require

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_secure
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@property.com
ADMIN_PASSWORD=admin123
```

### 4. Neon Database Setup

1. **Create a Neon account**: Go to [neon.tech](https://neon.tech) and sign up for a free account

2. **Create a new project**: Create a new PostgreSQL project in your Neon dashboard

3. **Get connection string**: Copy your connection string from the Neon dashboard

4. **Update .env file**: Add your Neon connection string to the `DATABASE_URL` in your `.env` file

5. **Run setup script**: Initialize the database with:

```bash
npm run setup
```

This will:
- Create all necessary tables
- Set up relationships between models
- Seed the database with initial data (admin user and sample properties)

### 5. Start the server

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will run on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `POST /admin/login` - Admin login
- `POST /logout` - Logout
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `PUT /change-password` - Change password (Protected)

### Property Routes (`/api/properties`)

- `GET /` - Get all properties (with filters)
- `GET /featured` - Get featured properties
- `GET /:id` - Get property by ID
- `POST /` - Create new property (Protected)
- `PUT /:id` - Update property (Protected)
- `DELETE /:id` - Delete property (Protected)
- `GET /user/my-properties` - Get user's properties (Protected)
- `GET /admin/all` - Get all properties for admin (Admin only)
- `PUT /:id/status` - Update property status (Admin only)
- `DELETE /:propertyId/images/:imageId` - Delete property image (Protected)

### User Routes (`/api/users`)

- `GET /stats` - Get user statistics (Protected)
- `GET /` - Get all users (Admin only)
- `GET /admin/stats` - Get admin dashboard stats (Admin only)
- `GET /:id` - Get user by ID (Admin only)
- `PUT /:id/status` - Update user status (Admin only)
- `DELETE /:id` - Delete user (Admin only)

## Database Models

### User Model
- Basic user information
- Role-based access (user/admin)
- Password encryption
- Account status management

### Property Model
- Comprehensive property details
- Location information
- Amenities and features
- Pricing and specifications
- Approval and status management

### PropertyImage Model
- Property image management
- Cloudinary integration
- Image ordering and primary image selection

### Inquiry Model
- User inquiries for properties
- Contact information
- Inquiry status tracking

## File Upload

The application supports image uploads with the following features:
- Multiple image upload for properties
- Automatic image optimization via Cloudinary
- File type validation (images only)
- File size limits (10MB per file)
- Secure file handling

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: bcrypt for password hashing
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for frontend integration
- **File Upload Security**: Secure file handling and validation

## Default Credentials

After running the setup script, you can use these credentials:

**Admin Login:**
- Email: admin@property.com
- Password: admin123

**Test User Login:**
- Email: user@test.com
- Password: user123

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run setup` - Run database setup and seeding

## Error Handling

The application includes comprehensive error handling:
- Global error handler middleware
- Validation error responses
- Database error handling
- File upload error handling
- Authentication error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
