# Telangana Tourism Website

A comprehensive full-stack website for Telangana tourism featuring interactive maps, place details, festival information, and user reviews.

## Features

### Frontend Features
- **Interactive Home Page**: Telangana map with place markers and hover details
- **Places Page**: Browse and filter tourist destinations with detailed information
- **Place Details**: Comprehensive place information with routing and nearby places
- **Festivals Page**: Explore Telangana's cultural festivals with filtering
- **Festival Details**: Detailed festival information with dates and locations
- **About Page**: Telangana's history and timeline with interactive elements
- **Contact Page**: Review submission with email notifications
- **User Authentication**: Secure login/register system
- **Responsive Design**: Mobile-friendly interface

### Backend Features
- **RESTful API**: Express.js server with MongoDB
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Database Models**: Users, Places, Festivals, Reviews with proper relationships
- **Email Integration**: Nodemailer for review notifications
- **File Upload**: Multer for image handling
- **Security**: Helmet, CORS, rate limiting, input validation
- **Geospatial Queries**: MongoDB geospatial indexing for location-based searches

### Key Technologies
- **Frontend**: React, React Router, Leaflet Maps, Styled Components, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **Maps**: Leaflet, OpenStreetMap
- **Styling**: CSS3, Responsive Design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd telangana-tourism
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/telangana-tourism
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:3000

# Email configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google Maps API (optional for enhanced features)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Admin credentials
ADMIN_EMAIL=admin@telanganatourism.com
ADMIN_PASSWORD=admin123
```

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the database and collections when you start the server.

### 5. Run the Application

#### Development Mode (Recommended)
```bash
# From the root directory
npm run dev
```

This will start both the server (port 5000) and client (port 3000) concurrently.

#### Manual Start
```bash
# Start the server
cd server
npm run dev

# Start the client (in a new terminal)
cd client
npm start
```

### 6. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Places
- `GET /api/places` - Get all places (with filtering)
- `GET /api/places/:id` - Get place by ID
- `GET /api/places/nearby` - Get nearby places
- `POST /api/places` - Create place (Admin only)
- `PUT /api/places/:id` - Update place (Admin only)
- `DELETE /api/places/:id` - Delete place (Admin only)

### Festivals
- `GET /api/festivals` - Get all festivals (with filtering)
- `GET /api/festivals/:id` - Get festival by ID
- `GET /api/festivals/upcoming` - Get upcoming festivals
- `POST /api/festivals` - Create festival (Admin only)
- `PUT /api/festivals/:id` - Update festival (Admin only)
- `DELETE /api/festivals/:id` - Delete festival (Admin only)

### Reviews
- `GET /api/reviews` - Get all reviews (with filtering)
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create review (Authenticated)
- `PUT /api/reviews/:id` - Update review (Owner/Admin)
- `DELETE /api/reviews/:id` - Delete review (Owner/Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/reviews` - Get user's reviews
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  avatar: String,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Place Model
```javascript
{
  name: String,
  description: String,
  shortDescription: String,
  location: {
    type: "Point",
    coordinates: [Number, Number], // [lng, lat]
    address: String,
    district: String
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  category: String,
  bestTimeToVisit: String,
  entryFee: String,
  timings: String,
  facilities: [String],
  rating: {
    average: Number,
    count: Number
  },
  featured: Boolean,
  isActive: Boolean
}
```

### Festival Model
```javascript
{
  name: String,
  description: String,
  shortDescription: String,
  date: {
    start: Date,
    end: Date
  },
  location: {
    type: "Point",
    coordinates: [Number, Number],
    address: String,
    district: String
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  category: String,
  significance: String,
  rituals: [{
    name: String,
    description: String
  }],
  specialAttractions: [String],
  entryFee: String,
  timings: String,
  contactInfo: {
    organizer: String,
    phone: String,
    email: String
  },
  featured: Boolean,
  isActive: Boolean
}
```

### Review Model
```javascript
{
  user: ObjectId (ref: User),
  place: ObjectId (ref: Place), // Either place or festival
  festival: ObjectId (ref: Festival),
  rating: Number (1-5),
  title: String,
  comment: String,
  images: [{
    url: String,
    alt: String
  }],
  helpful: {
    count: Number,
    users: [ObjectId]
  },
  isVerified: Boolean,
  isActive: Boolean
}
```

## Sample Data

The application includes sample data for places and festivals. You can add more data through the admin interface or by directly inserting into the database.

### Sample Places
- Charminar, Hyderabad
- Golconda Fort, Hyderabad
- Warangal Fort, Warangal
- Ramappa Temple, Warangal
- Thousand Pillar Temple, Warangal

### Sample Festivals
- Bonalu Festival
- Bathukamma Festival
- Sammakka Saralamma Jatara
- Kakatiya Festival
- Telangana Formation Day

## Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `client/build` folder
3. Update API URLs in production

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the `server` directory
3. Ensure MongoDB Atlas connection

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/telangana-tourism
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-frontend-domain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_production_email@gmail.com
EMAIL_PASS=your_production_app_password
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@telanganatourism.com or create an issue in the repository.

## Roadmap

- [ ] Mobile app development
- [ ] Advanced booking system
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Advanced analytics
- [ ] AR/VR experiences
- [ ] Offline support
- [ ] Push notifications
# telangana
>>>>>>> 504c7bdda8c049d724c71a770c21a87a0431a381
