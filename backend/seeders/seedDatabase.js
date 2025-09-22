// Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config();

// Now import modules
const { User, Property } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL || 'admin@property.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
        phone: '+91 98765 43210'
      });
      console.log('✅ Admin user created');
    }

    // Create test user
    const testUserExists = await User.findOne({ where: { email: 'user@test.com' } });
    if (!testUserExists) {
      await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: 'user123',
        role: 'user',
        phone: '+91 98765 43211'
      });
      console.log('✅ Test user created');
    }

    // Create sample properties
    const propertyCount = await Property.count();
    if (propertyCount === 0) {
      const adminUser = await User.findOne({ where: { role: 'admin' } });
      const testUser = await User.findOne({ where: { email: 'user@test.com' } });

      const sampleProperties = [
        {
          title: "Luxury Villa in Downtown Mumbai",
          description: "Beautiful luxury villa with modern amenities, located in the heart of the city. Perfect for families looking for comfort and convenience.",
          type: "buy",
          propertyType: "villa",
          price: 25000000,
          location: "Mumbai, Maharashtra",
          city: "Mumbai",
          state: "Maharashtra",
          bedrooms: 4,
          bathrooms: 3,
          kitchens: 1,
          area: 2500,
          builtYear: 2020,
          floor: 5,
          totalFloors: 10,
          facing: 'south',
          parking: 2,
          balcony: 2,
          garden: true,
          swimmingPool: true,
          gym: true,
          security: true,
          wifi: true,
          tv: true,
          ac: true,
          lift: true,
          powerBackup: true,
          waterSupply: true,
          gasConnection: true,
          furnished: 'fully-furnished',
          features: ["Swimming Pool", "Garden", "Parking", "Security", "Gym"],
          contact: "+91 98765 43210",
          owner: "John Doe",
          status: "available",
          isApproved: true,
          isFeatured: true,
          userId: adminUser.id
        },
        {
          title: "Modern Apartment for Rent in Bangalore",
          description: "Fully furnished modern apartment with all amenities. Great location with easy access to IT parks and shopping centers.",
          type: "rent",
          propertyType: "apartment",
          price: 45000,
          location: "Bangalore, Karnataka",
          city: "Bangalore",
          state: "Karnataka",
          bedrooms: 2,
          bathrooms: 2,
          kitchens: 1,
          area: 1200,
          builtYear: 2019,
          floor: 3,
          totalFloors: 8,
          facing: 'east',
          parking: 1,
          balcony: 1,
          garden: false,
          swimmingPool: false,
          gym: false,
          security: true,
          wifi: true,
          tv: true,
          lift: true,
          powerBackup: true,
          waterSupply: true,
          gasConnection: true,
          furnished: 'fully-furnished',
          features: ["Furnished", "Balcony", "Parking", "Lift", "Security"],
          contact: "+91 98765 43211",
          owner: "Jane Smith",
          status: "available",
          isApproved: true,
          isFeatured: true,
          userId: testUser.id
        },
        {
          title: "Spacious House in Delhi",
          description: "Large family house with garden and multiple rooms. Perfect for joint families.",
          type: "buy",
          propertyType: "house",
          price: 15000000,
          location: "Delhi, Delhi",
          city: "Delhi",
          state: "Delhi",
          bedrooms: 5,
          bathrooms: 4,
          kitchens: 2,
          area: 3000,
          builtYear: 2018,
          floor: 0,
          totalFloors: 2,
          facing: 'north',
          parking: 3,
          balcony: 3,
          garden: true,
          swimmingPool: false,
          gym: false,
          security: true,
          wifi: true,
          tv: false,
          powerBackup: true,
          waterSupply: true,
          gasConnection: true,
          furnished: 'semi-furnished',
          features: ["Garden", "Parking", "Security", "Multiple Floors"],
          contact: "+91 98765 43212",
          owner: "Raj Kumar",
          status: "available",
          isApproved: true,
          isFeatured: false,
          userId: adminUser.id
        },
        {
          title: "Commercial Office Space in Pune",
          description: "Prime commercial office space in the business district of Pune. Ideal for startups and established businesses.",
          type: "rent",
          propertyType: "office",
          price: 80000,
          location: "Pune, Maharashtra",
          city: "Pune",
          state: "Maharashtra",
          bedrooms: 0,
          bathrooms: 2,
          kitchens: 1,
          area: 1500,
          builtYear: 2021,
          floor: 7,
          totalFloors: 15,
          facing: 'west',
          parking: 5,
          balcony: 0,
          garden: false,
          swimmingPool: false,
          gym: true,
          security: true,
          wifi: true,
          tv: false,
          ac: true,
          lift: true,
          powerBackup: true,
          waterSupply: true,
          gasConnection: false,
          furnished: 'semi-furnished',
          features: ["Central AC", "High Speed Internet", "24/7 Security", "Parking", "Gym"],
          contact: "+91 98765 43213",
          owner: "Business Properties Ltd",
          status: "available",
          isApproved: true,
          isFeatured: true,
          userId: testUser.id
        }
      ];

      await Property.bulkCreate(sampleProperties);
      console.log('✅ Sample properties created');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};

module.exports = seedDatabase;
