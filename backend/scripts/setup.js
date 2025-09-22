// Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config();

// Now import modules that depend on environment variables
const { sequelize } = require('../models');
const seedDatabase = require('../seeders/seedDatabase');

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    // Sync database models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database models synchronized.');
    
    // Seed database with initial data
    await seedDatabase();
    
    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();
