const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Place = require('./models/Place');
const Festival = require('./models/Festival');

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@telanganatourism.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
];

const samplePlaces = [
  {
    name: 'Charminar',
    description: 'The Charminar is a monument and mosque located in Hyderabad, Telangana, India. The landmark has become known globally as a symbol of Hyderabad and is listed among the most recognized structures in India. It has also been officially incorporated as the Emblem of Telangana.',
    shortDescription: 'Iconic monument and mosque in Hyderabad, symbol of the city.',
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.3616],
      address: 'Charminar, Hyderabad',
      district: 'Hyderabad'
    },
    images: [
      {
        url: 'https://www.adotrip.com/public/images/areas/master_images/5c4edc96a044b-Charminar_Places_to_See.jpg',
        alt: 'Charminar monument',
        isPrimary: true
      }
    ],
    category: 'Historical',
    bestTimeToVisit: 'October to March',
    entryFee: '₹5 for Indians, ₹100 for foreigners',
    timings: '9:30 AM to 5:30 PM',
    facilities: ['Parking', 'Guided Tours', 'Photography', 'Wheelchair Access'],
    rating: {
      average: 4.5,
      count: 1250
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Golconda Fort',
    description: 'Golconda Fort is a fortified citadel and an early capital city of the Qutb Shahi dynasty, located in Hyderabad, Telangana, India. Because of the vicinity of diamond mines, especially Kollur Mine, Golconda flourished as a trade centre of large diamonds, known as the Golconda Diamonds.',
    shortDescription: 'Ancient fort with rich history and diamond trade legacy.',
    location: {
      type: 'Point',
      coordinates: [78.4011, 17.3833],
      address: 'Golconda Fort, Hyderabad',
      district: 'Hyderabad'
    },
    images: [
      {
        url: '/images/golconda.jpg',
        alt: 'Golconda Fort',
        isPrimary: true
      }
    ],
    category: 'Historical',
    bestTimeToVisit: 'October to March',
    entryFee: '₹15 for Indians, ₹200 for foreigners',
    timings: '9:00 AM to 5:30 PM',
    facilities: ['Parking', 'Light and Sound Show', 'Guided Tours', 'Museum'],
    rating: {
      average: 4.3,
      count: 980
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Warangal Fort',
    description: 'Warangal Fort is located in Warangal District, Telangana, India. It was the capital of the Kakatiya dynasty from the 12th to the 14th centuries. The fort has four ornamental gates, known as Kakatiya Kala Thoranam, that originally formed the entrances to a now ruined great Shiva temple.',
    shortDescription: 'Historic fort from the Kakatiya dynasty era.',
    location: {
      type: 'Point',
      coordinates: [79.6029, 17.9689],
      address: 'Warangal Fort, Warangal',
      district: 'Warangal'
    },
    images: [
      {
        url: '/images/warangal-fort.jpg',
        alt: 'Warangal Fort',
        isPrimary: true
      }
    ],
    category: 'Historical',
    bestTimeToVisit: 'October to March',
    entryFee: '₹10 for Indians, ₹100 for foreigners',
    timings: '6:00 AM to 6:00 PM',
    facilities: ['Parking', 'Guided Tours', 'Photography'],
    rating: {
      average: 4.2,
      count: 750
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Ramappa Temple',
    description: 'Ramappa Temple, also known as the Rudreswara temple, is a Kakatiya style Hindu temple dedicated to the god Shiva, located in Palampet village, Mulugu district, Telangana, India. It is 15 km from Mulugu, 66 km from Warangal, 209 km from Hyderabad.',
    shortDescription: 'UNESCO World Heritage Site, Kakatiya style temple.',
    location: {
      type: 'Point',
      coordinates: [79.9431, 18.2594],
      address: 'Palampet, Mulugu District',
      district: 'Mulugu'
    },
    images: [
      {
        url: '/images/ramappa-temple.jpg',
        alt: 'Ramappa Temple',
        isPrimary: true
      }
    ],
    category: 'Religious',
    bestTimeToVisit: 'October to March',
    entryFee: 'Free',
    timings: '6:00 AM to 6:00 PM',
    facilities: ['Parking', 'Guided Tours', 'Photography'],
    rating: {
      average: 4.6,
      count: 650
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Thousand Pillar Temple',
    description: 'The Thousand Pillar Temple or Rudreswara Swamy Temple is a historic Hindu temple located in the town of Hanamakonda, Telangana State, India. It is dedicated to Lord Shiva, Vishnu and Surya. The temple was built by the Kakatiya King Rudra Deva in 1163 AD.',
    shortDescription: 'Historic temple with thousand pillars, Kakatiya architecture.',
    location: {
      type: 'Point',
      coordinates: [79.6029, 17.9689],
      address: 'Hanamakonda, Warangal',
      district: 'Warangal'
    },
    images: [
      {
        url: '/images/thousand-pillar-temple.jpg',
        alt: 'Thousand Pillar Temple',
        isPrimary: true
      }
    ],
    category: 'Religious',
    bestTimeToVisit: 'October to March',
    entryFee: 'Free',
    timings: '6:00 AM to 8:00 PM',
    facilities: ['Parking', 'Guided Tours', 'Photography'],
    rating: {
      average: 4.4,
      count: 580
    },
    featured: false,
    isActive: true
  },
  {
    name: 'Birla Mandir',
    description: 'Birla Mandir is a Hindu temple built on a 280 feet high hillock called Naubath Pahad on a 13 acres plot. The construction took 10 years and was opened in 1976 by Swami Ranganathananda of Ramakrishna Mission. The temple was constructed by Birla Foundation, which has also constructed several similar temples across India.',
    shortDescription: 'Modern temple dedicated to Lord Venkateswara with beautiful architecture.',
    location: {
      type: 'Point',
      coordinates: [78.4618, 17.4065],
      address: 'Naubath Pahad, Hyderabad',
      district: 'Hyderabad'
    },
    images: [
      {
        url: '/images/birla-mandir.jpg',
        alt: 'Birla Mandir',
        isPrimary: true
      }
    ],
    category: 'Religious',
    bestTimeToVisit: 'October to March',
    entryFee: 'Free',
    timings: '7:00 AM to 12:00 PM, 3:00 PM to 9:00 PM',
    facilities: ['Parking', 'Photography', 'Wheelchair Access'],
    rating: {
      average: 4.2,
      count: 750
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Hussain Sagar Lake',
    description: 'Hussain Sagar is a heart-shaped lake in Hyderabad, Telangana, built by Ibrahim Quli Qutb Shah in 1563. It is spread across an area of 5.7 square kilometers and is fed by the Musi River. The lake is famous for the monolithic statue of Lord Buddha installed in the middle of the lake.',
    shortDescription: 'Heart-shaped lake with Buddha statue in the center.',
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.4239],
      address: 'Hussain Sagar, Hyderabad',
      district: 'Hyderabad'
    },
    images: [
      {
        url: '/images/hussain-sagar.jpg',
        alt: 'Hussain Sagar Lake',
        isPrimary: true
      }
    ],
    category: 'Natural',
    bestTimeToVisit: 'October to March',
    entryFee: 'Free',
    timings: '5:00 AM to 10:00 PM',
    facilities: ['Boating', 'Parking', 'Food Court', 'Photography'],
    rating: {
      average: 4.1,
      count: 920
    },
    featured: true,
    isActive: true
  },
  {
    name: 'KBR National Park',
    description: 'Kasu Brahmananda Reddy National Park, also known as KBR National Park, is a national park located in Jubilee Hills, Hyderabad. It is spread over 390 acres and is home to over 600 species of plants and 140 species of birds. The park is a perfect escape from the city hustle.',
    shortDescription: 'Urban wildlife sanctuary with diverse flora and fauna.',
    location: {
      type: 'Point',
      coordinates: [78.4065, 17.4239],
      address: 'Jubilee Hills, Hyderabad',
      district: 'Hyderabad'
    },
    images: [
      {
        url: '/images/kbr-park.jpg',
        alt: 'KBR National Park',
        isPrimary: true
      }
    ],
    category: 'Natural',
    bestTimeToVisit: 'October to March',
    entryFee: '₹20 for adults, ₹10 for children',
    timings: '5:30 AM to 10:00 AM, 4:00 PM to 6:30 PM',
    facilities: ['Walking Trails', 'Bird Watching', 'Photography', 'Parking'],
    rating: {
      average: 4.3,
      count: 680
    },
    featured: false,
    isActive: true
  }
];

const sampleFestivals = [
  {
    name: 'Bonalu Festival',
    description: 'Bonalu is a Hindu festival where Goddess Mahakali is worshiped. It is celebrated in Telangana, especially in the twin cities of Hyderabad and Secunderabad. The festival is celebrated annually in the month of Ashada (July/August).',
    shortDescription: 'Hindu festival dedicated to Goddess Mahakali.',
    date: {
      start: new Date('2024-07-15'),
      end: new Date('2024-07-17')
    },
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.3616],
      address: 'Various temples in Hyderabad',
      district: 'Hyderabad'
    },
    images: [
      {
        url: '/images/bonalu-festival.jpg',
        alt: 'Bonalu Festival',
        isPrimary: true
      }
    ],
    category: 'Religious',
    significance: 'Dedicated to Goddess Mahakali, seeking blessings and protection',
    rituals: [
      {
        name: 'Bonam Offering',
        description: 'Offering of cooked rice, jaggery, and curd to the goddess'
      },
      {
        name: 'Potharaju Dance',
        description: 'Traditional dance performed by men with drums and bells'
      }
    ],
    specialAttractions: ['Traditional Dances', 'Colorful Processions', 'Temple Decorations'],
    entryFee: 'Free',
    timings: 'All day',
    contactInfo: {
      organizer: 'Hyderabad Bonalu Committee',
      phone: '+91 40 2345 6789',
      email: 'bonalu@hyderabad.com'
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Bathukamma Festival',
    description: 'Bathukamma is a floral festival celebrated by the women of Telangana. It is celebrated during the months of September and October. The festival represents the cultural spirit of Telangana and is celebrated with great enthusiasm.',
    shortDescription: 'Floral festival celebrated by women of Telangana.',
    date: {
      start: new Date('2024-10-10'),
      end: new Date('2024-10-18')
    },
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.3616],
      address: 'Various locations in Telangana',
      district: 'Hyderabad'
    },
    images: [
      {
        url: '/images/bathukamma-festival.jpg',
        alt: 'Bathukamma Festival',
        isPrimary: true
      }
    ],
    category: 'Cultural',
    significance: 'Celebration of womanhood and nature, seeking prosperity and happiness',
    rituals: [
      {
        name: 'Bathukamma Making',
        description: 'Women create colorful flower stacks in concentric circles'
      },
      {
        name: 'Bathukamma Songs',
        description: 'Traditional songs sung while dancing around the flower stacks'
      }
    ],
    specialAttractions: ['Floral Arrangements', 'Traditional Songs', 'Women Dances'],
    entryFee: 'Free',
    timings: 'Evening celebrations',
    contactInfo: {
      organizer: 'Telangana Cultural Department',
      phone: '+91 40 2345 6789',
      email: 'bathukamma@telangana.gov.in'
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Sammakka Saralamma Jatara',
    description: 'Sammakka Saralamma Jatara is a tribal festival held every two years in Medaram, Telangana. It is one of the largest tribal religious gatherings in the world, with millions of devotees participating.',
    shortDescription: 'Largest tribal religious gathering in the world.',
    date: {
      start: new Date('2024-02-15'),
      end: new Date('2024-02-18')
    },
    location: {
      type: 'Point',
      coordinates: [80.1234, 18.3456],
      address: 'Medaram, Mulugu District',
      district: 'Mulugu'
    },
    images: [
      {
        url: '/images/sammakka-jatara.jpg',
        alt: 'Sammakka Saralamma Jatara',
        isPrimary: true
      }
    ],
    category: 'Traditional',
    significance: 'Honoring tribal goddesses Sammakka and Saralamma',
    rituals: [
      {
        name: 'Jaggery Offering',
        description: 'Offering of jaggery to the goddesses'
      },
      {
        name: 'Tribal Dances',
        description: 'Traditional tribal dances and music'
      }
    ],
    specialAttractions: ['Tribal Culture', 'Traditional Dances', 'Religious Processions'],
    entryFee: 'Free',
    timings: 'All day',
    contactInfo: {
      organizer: 'Medaram Jatara Committee',
      phone: '+91 40 2345 6789',
      email: 'jatara@medaram.com'
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Kakatiya Festival',
    description: 'Kakatiya Festival is a cultural festival celebrated in Warangal to showcase the rich heritage of the Kakatiya dynasty. The festival features traditional arts, crafts, music, and dance performances that reflect the glorious past of Telangana.',
    shortDescription: 'Cultural festival celebrating Kakatiya dynasty heritage.',
    date: {
      start: new Date('2024-12-15'),
      end: new Date('2024-12-17')
    },
    location: {
      type: 'Point',
      coordinates: [79.6029, 17.9689],
      address: 'Warangal Fort, Warangal',
      district: 'Warangal'
    },
    images: [
      {
        url: '/images/kakatiya-festival.jpg',
        alt: 'Kakatiya Festival',
        isPrimary: true
      }
    ],
    category: 'Cultural',
    significance: 'Celebrating the rich cultural heritage of Kakatiya dynasty',
    rituals: [
      {
        name: 'Light and Sound Show',
        description: 'Spectacular show depicting Kakatiya history'
      },
      {
        name: 'Cultural Performances',
        description: 'Traditional dance and music performances'
      }
    ],
    specialAttractions: ['Light Show', 'Cultural Performances', 'Craft Exhibition', 'Food Festival'],
    entryFee: '₹50 for adults, ₹25 for children',
    timings: '6:00 PM to 10:00 PM',
    contactInfo: {
      organizer: 'Warangal Tourism Department',
      phone: '+91 870 2345 6789',
      email: 'kakatiya@warangal.gov.in'
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Telangana Formation Day',
    description: 'Telangana Formation Day is celebrated on June 2nd every year to commemorate the formation of Telangana as the 29th state of India. The day is marked with cultural programs, flag hoisting, and various events across the state.',
    shortDescription: 'State formation day celebration with cultural programs.',
    date: {
      start: new Date('2024-06-02'),
      end: new Date('2024-06-02')
    },
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.3616],
      address: 'Tank Bund, Hyderabad',
      district: 'Hyderabad'
    },
    images: [
      {
        url: '/images/telangana-formation-day.jpg',
        alt: 'Telangana Formation Day',
        isPrimary: true
      }
    ],
    category: 'Modern',
    significance: 'Commemorating the formation of Telangana state',
    rituals: [
      {
        name: 'Flag Hoisting',
        description: 'Official flag hoisting ceremony'
      },
      {
        name: 'Cultural Parade',
        description: 'Parade showcasing Telangana culture'
      }
    ],
    specialAttractions: ['Flag Hoisting', 'Cultural Parade', 'Fireworks', 'Cultural Programs'],
    entryFee: 'Free',
    timings: 'All day',
    contactInfo: {
      organizer: 'Telangana Government',
      phone: '+91 40 2345 6789',
      email: 'formationday@telangana.gov.in'
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Dasara Festival',
    description: 'Dasara is a major Hindu festival celebrated across Telangana with great enthusiasm. The festival marks the victory of good over evil and is celebrated with traditional rituals, cultural programs, and community gatherings.',
    shortDescription: 'Hindu festival celebrating victory of good over evil.',
    date: {
      start: new Date('2024-10-12'),
      end: new Date('2024-10-22')
    },
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.3616],
      address: 'Various temples across Telangana',
      district: 'Hyderabad'
    },
    images: [
      {
        url: '/images/dasara-festival.jpg',
        alt: 'Dasara Festival',
        isPrimary: true
      }
    ],
    category: 'Religious',
    significance: 'Celebrating the victory of Goddess Durga over demon Mahishasura',
    rituals: [
      {
        name: 'Durga Puja',
        description: 'Worship of Goddess Durga for nine days'
      },
      {
        name: 'Vijayadashami',
        description: 'Celebration of victory on the tenth day'
      }
    ],
    specialAttractions: ['Durga Puja', 'Cultural Programs', 'Community Feasts', 'Processions'],
    entryFee: 'Free',
    timings: 'All day',
    contactInfo: {
      organizer: 'Various Temple Committees',
      phone: '+91 40 2345 6789',
      email: 'dasara@telangana.gov.in'
    },
    featured: false,
    isActive: true
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telangana-tourism');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Place.deleteMany({});
    await Festival.deleteMany({});
    console.log('Cleared existing data');

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // Insert users
    const users = await User.insertMany(hashedUsers);
    console.log(`Inserted ${users.length} users`);

    // Insert places
    const places = await Place.insertMany(samplePlaces);
    console.log(`Inserted ${places.length} places`);

    // Insert festivals
    const festivals = await Festival.insertMany(sampleFestivals);
    console.log(`Inserted ${festivals.length} festivals`);

    console.log('Database seeding completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@telanganatourism.com / admin123');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

// Check if this file is being run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase, connectDB };
