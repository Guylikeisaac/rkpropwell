const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testConfiguration = () => {
  console.log('🔍 Testing Backend Configuration...\n');

  // Check environment variables
  const requiredEnvVars = [
    'DB_HOST',
    'DB_PORT', 
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
  ];

  let allConfigured = true;

  console.log('📋 Environment Variables Check:');
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅' : '❌';
    const displayValue = varName.includes('PASSWORD') || varName.includes('SECRET') || varName.includes('API') 
      ? '***hidden***' 
      : value || 'NOT SET';
    
    console.log(`${status} ${varName}: ${displayValue}`);
    
    if (!value) {
      allConfigured = false;
    }
  });

  console.log('\n📊 Configuration Summary:');
  console.log(`Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log(`Server Port: ${process.env.PORT || 5000}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`JWT Expires: ${process.env.JWT_EXPIRES_IN || '7d'}`);
  console.log(`Admin Email: ${process.env.ADMIN_EMAIL || 'admin@property.com'}`);

  if (allConfigured) {
    console.log('\n🎉 All required environment variables are configured!');
    console.log('✅ Backend is ready to run!');
  } else {
    console.log('\n⚠️  Some required environment variables are missing.');
    console.log('Please check your .env file.');
  }

  return allConfigured;
};

// Test database connection
const testDatabaseConnection = async () => {
  try {
    const { sequelize } = require('./models');
    await sequelize.authenticate();
    console.log('\n✅ Database connection successful!');
    await sequelize.close();
    return true;
  } catch (error) {
    console.log('\n❌ Database connection failed:');
    console.log(error.message);
    return false;
  }
};

// Test Cloudinary configuration
const testCloudinaryConnection = () => {
  try {
    const { initializeCloudinary } = require('./config/cloudinary');
    
    // Check if all required environment variables are present
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (cloudName && apiKey && apiSecret) {
      console.log('\n✅ Cloudinary configuration is valid!');
      console.log(`Cloud Name: ${cloudName}`);
      return true;
    } else {
      console.log('\n❌ Cloudinary configuration is incomplete!');
      console.log(`Cloud Name: ${cloudName || 'NOT SET'}`);
      console.log(`API Key: ${apiKey ? 'SET' : 'NOT SET'}`);
      console.log(`API Secret: ${apiSecret ? 'SET' : 'NOT SET'}`);
      return false;
    }
  } catch (error) {
    console.log('\n❌ Cloudinary configuration failed:');
    console.log(error.message);
    return false;
  }
};

const runTests = async () => {
  console.log('🚀 Property Website Backend Configuration Test\n');
  
  const envConfigured = testConfiguration();
  const dbConnected = await testDatabaseConnection();
  const cloudinaryConfigured = testCloudinaryConnection();
  
  console.log('\n' + '='.repeat(50));
  console.log('📋 FINAL RESULTS:');
  console.log('='.repeat(50));
  console.log(`Environment Variables: ${envConfigured ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Database Connection: ${dbConnected ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Cloudinary Configuration: ${cloudinaryConfigured ? '✅ PASS' : '❌ FAIL'}`);
  
  if (envConfigured && dbConnected && cloudinaryConfigured) {
    console.log('\n🎉 BACKEND IS FULLY CONFIGURED AND READY!');
    console.log('You can now run: npm run setup (to initialize database)');
    console.log('Then run: npm run dev (to start the server)');
  } else {
    console.log('\n⚠️  CONFIGURATION INCOMPLETE');
    console.log('Please fix the issues above before running the backend.');
  }
};

// Run the tests
runTests().catch(console.error);
