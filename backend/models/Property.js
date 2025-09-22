const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('buy', 'rent', 'sell'),
    allowNull: false
  },
  propertyType: {
    type: DataTypes.ENUM('apartment', 'house', 'villa', 'plot', 'commercial', 'office'),
    allowNull: false,
    defaultValue: 'apartment'
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 20
    }
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 20
    }
  },
  kitchens: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
    validate: {
      min: 0,
      max: 10
    }
  },
  area: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Area in square feet'
  },
  builtYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1800,
      max: new Date().getFullYear() + 2
    }
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  totalFloors: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  facing: {
    type: DataTypes.ENUM('north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest'),
    allowNull: true
  },
  parking: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  balcony: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  // Amenities - Boolean fields
  garden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  swimmingPool: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  gym: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  security: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  wifi: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tv: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ac: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  heating: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lift: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  powerBackup: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  waterSupply: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  gasConnection: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  furnished: {
    type: DataTypes.ENUM('unfurnished', 'semi-furnished', 'fully-furnished'),
    defaultValue: 'unfurnished'
  },
  // Additional fields
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  owner: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('available', 'sold', 'rented', 'pending', 'inactive'),
    defaultValue: 'available'
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['propertyType']
    },
    {
      fields: ['location']
    },
    {
      fields: ['price']
    },
    {
      fields: ['status']
    },
    {
      fields: ['isApproved']
    },
    {
      fields: ['isFeatured']
    }
  ]
});

module.exports = Property;
