const sequelize = require('../config/database');
const User = require('./User');
const Property = require('./Property');
const PropertyImage = require('./PropertyImage');
const Inquiry = require('./Inquiry');

// Define associations
User.hasMany(Property, { 
  foreignKey: 'userId', 
  as: 'properties',
  onDelete: 'CASCADE'
});

Property.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user'
});

Property.hasMany(PropertyImage, { 
  foreignKey: 'propertyId', 
  as: 'propertyImages',
  onDelete: 'CASCADE'
});

PropertyImage.belongsTo(Property, { 
  foreignKey: 'propertyId', 
  as: 'property'
});

Property.hasMany(Inquiry, { 
  foreignKey: 'propertyId', 
  as: 'inquiries',
  onDelete: 'CASCADE'
});

Inquiry.belongsTo(Property, { 
  foreignKey: 'propertyId', 
  as: 'property'
});

User.hasMany(Inquiry, { 
  foreignKey: 'userId', 
  as: 'inquiries',
  onDelete: 'CASCADE'
});

Inquiry.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user'
});

module.exports = {
  sequelize,
  User,
  Property,
  PropertyImage,
  Inquiry
};
