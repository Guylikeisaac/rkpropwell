const { Op } = require('sequelize');
const { Property } = require('../models');

// Get hero slides (featured properties + custom slides)
const getHeroSlides = async (req, res) => {
  try {
    // Get featured properties for hero slides
    const featuredProperties = await Property.findAll({
      where: {
        isFeatured: true,
        isApproved: true,
        status: 'available'
      },
      include: [{
        model: require('../models').User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'phone']
      }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Convert properties to hero slide format
    const propertySlides = featuredProperties.map(property => ({
      id: `property-${property.id}`,
      title: property.title,
      subtitle: property.description,
      description: property.description,
      image: property.images && property.images.length > 0 ? property.images[0] : '/images/default-property.jpg',
      price: property.price ? `₹${Number(property.price).toLocaleString('en-IN')}` : null,
      location: property.location,
      link: `/property/${property.id}`,
      bulletPoints: [
        `${property.bedrooms || 0} Bedrooms`,
        `${property.bathrooms || 0} Bathrooms`,
        `${property.area || 0} sq ft`
      ],
      propertyId: property.id,
      type: 'property'
    }));

    // Get custom hero slides from database (if you have a HeroSlides table)
    // For now, we'll return property-based slides
    const heroSlides = propertySlides;

    // Add default slides if needed
    if (heroSlides.length < 3) {
      const defaultSlides = [
        {
          id: 'default-1',
          title: 'Find Your Dream Home',
          subtitle: 'Discover amazing properties in prime locations',
          description: 'Discover amazing properties in prime locations with our expert team',
          image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3',
          price: null,
          location: 'Various Locations',
          link: '/properties',
          bulletPoints: ['Premium Locations', 'Best Prices', 'Quality Assured'],
          type: 'default'
        },
        {
          id: 'default-2',
          title: 'Luxury Living Spaces',
          subtitle: 'Experience comfort and elegance in our premium properties',
          description: 'Experience comfort and elegance in our premium properties',
          image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3',
          price: null,
          location: 'Premium Areas',
          link: '/properties',
          bulletPoints: ['Luxury Amenities', 'Modern Design', 'Prime Location'],
          type: 'default'
        }
      ];

      heroSlides.push(...defaultSlides.slice(0, 3 - heroSlides.length));
    }

    res.json({
      success: true,
      message: 'Hero slides retrieved successfully',
      data: heroSlides
    });

  } catch (error) {
    console.error('Error fetching hero slides:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero slides',
      error: error.message
    });
  }
};

// Update property featured status for hero slides
const updatePropertyFeatured = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { isFeatured } = req.body;

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await property.update({ isFeatured });

    res.json({
      success: true,
      message: `Property ${isFeatured ? 'added to' : 'removed from'} hero slideshow`,
      data: property
    });

  } catch (error) {
    console.error('Error updating property featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property featured status',
      error: error.message
    });
  }
};

// Get hero section statistics
const getHeroStats = async (req, res) => {
  try {
    const stats = {
      totalProperties: await Property.count({
        where: { isApproved: true, status: 'available' }
      }),
      featuredProperties: await Property.count({
        where: { isFeatured: true, isApproved: true, status: 'available' }
      }),
      propertiesForSale: await Property.count({
        where: { type: 'buy', isApproved: true, status: 'available' }
      }),
      propertiesForRent: await Property.count({
        where: { type: 'rent', isApproved: true, status: 'available' }
      })
    };

    res.json({
      success: true,
      message: 'Hero statistics retrieved successfully',
      data: stats
    });

  } catch (error) {
    console.error('Error fetching hero stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero statistics',
      error: error.message
    });
  }
};

module.exports = {
  getHeroSlides,
  updatePropertyFeatured,
  getHeroStats
};