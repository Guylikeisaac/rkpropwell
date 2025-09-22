# PropertyHub - Premium Real Estate Website

A comprehensive property listing website built with React, featuring a modern red, white, and black color scheme. This project includes admin functionality, property management, and a beautiful user interface.

## Features

### 🏠 Property Management
- **Buy, Rent, Sell** property listings
- **Advanced Search & Filters** by location, price, bedrooms, bathrooms, area
- **Property Details** with image galleries and comprehensive information
- **Property Listing Form** with step-by-step wizard for sellers
- **Comprehensive Amenities** including parking, kitchen, bathrooms, basic amenities
- **Responsive Design** for all devices

### 👨‍💼 Admin Portal
- **Property Management** - Add, edit, delete properties
- **Hero Slideshow Management** - Customize homepage slideshow with editable bullet points
- **Dashboard Analytics** - View property statistics and recent listings
- **User Management** - Admin-only access with secure authentication

### 🎨 Design & UX
- **Modern UI/UX** with red, white, and black color scheme
- **Hero Slideshow** with property images and customizable bullet points
- **Interactive Property Cards** with image navigation and actions
- **Mobile-First Responsive Design**

### 🔐 Authentication
- **User Registration & Login** for property browsing
- **Admin Authentication** for property management
- **Secure Session Management**

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd property-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Example Credentials

### Admin Login
- **Email:** `admin@property.com`
- **Password:** `admin123`
- **Access:** Full admin dashboard, property management, hero slideshow editing

### Test User Login
- **Email:** `user@test.com`
- **Password:** `user123`
- **Access:** Property browsing, favorites, contact features

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   ├── Footer.js       # Site footer
│   ├── PropertyCard.js # Property listing card
│   └── HeroSection.js  # Homepage hero with slideshow
├── pages/              # Main application pages
│   ├── Home.js         # Homepage with hero and featured properties
│   ├── Properties.js   # Property listing page with filters
│   ├── PropertyDetails.js # Individual property details
│   ├── UserLogin.js    # User authentication
│   ├── UserRegister.js # User registration
│   ├── AdminLogin.js   # Admin authentication
│   ├── AdminDashboard.js # Admin control panel
│   ├── AddProperty.js  # Add new property form
│   ├── EditProperty.js # Edit existing property
│   └── SellProperty.js # Step-by-step property listing form
├── context/            # React Context for state management
│   ├── AuthContext.js  # Authentication state
│   └── PropertyContext.js # Property data management
└── App.js             # Main application component
```

## Key Features Explained

### Hero Slideshow
- **Editable Content:** Admins can modify slide images, titles, subtitles, and bullet points
- **Auto-advance:** Slides automatically change every 5 seconds
- **Navigation:** Users can manually navigate between slides
- **Responsive:** Adapts to all screen sizes

### Property Management
- **Comprehensive Forms:** Add/edit properties with all necessary details
- **Step-by-Step Wizard:** Multi-step form for property listing with progress indicator
- **Detailed Amenities:** Kitchen, bathrooms, parking, basic amenities, and more
- **Image Management:** Upload multiple property images with preview
- **Feature Tags:** Add/remove property features dynamically
- **Validation:** Form validation ensures data integrity

### Search & Filtering
- **Advanced Filters:** Filter by type, price range, bedrooms, bathrooms, area
- **Location Search:** Search by city, area, or landmark
- **Sorting Options:** Sort by price, date, area, etc.
- **Real-time Results:** Instant filtering and search results

### Admin Dashboard
- **Property Statistics:** View total properties, types, and recent listings
- **Quick Actions:** Add properties, edit hero slides, manage content
- **Data Tables:** Comprehensive property listing with actions
- **Responsive Design:** Works on desktop and mobile devices

## Color Scheme

The website uses a professional red, white, and black color palette:

- **Primary Red:** `#DC2626` - Used for buttons, links, and accents
- **Dark Red:** `#B91C1C` - Used for hover states and emphasis
- **Light Red:** `#FEE2E2` - Used for backgrounds and highlights
- **White:** `#FFFFFF` - Primary background and text
- **Black:** `#000000` - Primary text and headers
- **Gray Scale:** Various shades for secondary text and borders

## Technologies Used

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **React Icons** - Icon library
- **CSS3** - Styling with custom properties and responsive design
- **Context API** - State management
- **Local Storage** - Session persistence

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment

The application can be deployed to any static hosting service:

- **Netlify**
- **Vercel**
- **GitHub Pages**
- **AWS S3**
- **Firebase Hosting**

## Future Enhancements

- **Payment Integration** for premium listings
- **User Profiles** and saved searches
- **Email Notifications** for new properties
- **Advanced Analytics** for admin dashboard
- **Multi-language Support**
- **Mobile App** development

## Support

For support or questions about this project, please contact the development team.

## License

This project is proprietary software developed for PropertyHub. All rights reserved.

---

**PropertyHub** - Your trusted partner in real estate. Find, buy, sell, and rent properties with confidence and ease.