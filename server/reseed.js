const mongoose = require('mongoose');
const Place = require('./models/Place');
const Festival = require('./models/Festival');
const User = require('./models/User');
const Review = require('./models/Review');

// Load environment variables
require('dotenv').config();

// Sample data (same as seed.js but with your updated images)
const samplePlaces = [
  {
    name: 'Charminar',
    description: 'Charminar is a monument and mosque located in Hyderabad, Telangana, India. The landmark has become known globally as a symbol of Hyderabad and is listed among the most recognized structures in India. It has also been officially incorporated as the Emblem of Telangana.',
    shortDescription: 'Iconic monument and mosque, symbol of Hyderabad.',
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
        url: 'https://indiano.travel/wp-content/uploads/2022/06/White-Slate-Grey-Company-Dynamic-Neons-Company-Website-1590-%C3%97-1050-px-1060-%C3%97-700-px-1060-%C3%97-700-px-1590-%C3%97-1050-px-1060-%C3%97-700-px-1590-%C3%97-1050-px-1590-%C3%97-1050-px-1060-%C3%97-700-px-1060-%C3%97-700-px-1590-%C3%97-1050-1.jpg',
        alt: 'Golconda Fort view',
        isPrimary: true
      }
    ],
    category: 'Historical',
    bestTimeToVisit: 'October to March',
    entryFee: '₹25 for Indians, ₹300 for foreigners',
    timings: '9:00 AM to 5:30 PM',
    facilities: ['Parking', 'Light and Sound Show', 'Guided Tours', 'Photography'],
    rating: {
      average: 4.3,
      count: 980
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Ramoji Film City',
    description: 'Ramoji Film City is an integrated film studio complex located in Hyderabad, India. Spread over 1,666 acres, it is the largest integrated film city in the world and has been certified by the Guinness World Records as the largest studio complex in the world.',
    shortDescription: 'World\'s largest film studio complex with entertainment zones.',
    location: {
      type: 'Point',
      coordinates: [78.3667, 17.3000],
      address: 'Ramoji Film City, Hyderabad',
      district: 'Hyderabad'
    },
    images: [
      {
        url: 'https://buddymantra.com/wp-content/uploads/2018/01/ramoji-film-city.jpg',
        alt: 'Ramoji Film City entrance',
        isPrimary: true
      }
    ],
    category: 'Cultural',
    bestTimeToVisit: 'October to March',
    entryFee: '₹1,150 per person',
    timings: '9:00 AM to 5:30 PM',
    facilities: ['Parking', 'Food Court', 'Shopping', 'Entertainment Shows'],
    rating: {
      average: 4.2,
      count: 2100
    },
    featured: true,
    isActive: true
  },
  {
    name: 'Warangal Fort',
    description: 'Warangal Fort is located in Warangal District, Telangana, India. It was the capital of the Kakatiya dynasty from the 12th to the 14th centuries. The fort has four ornamental gates, known as Kakatiya Kala Thoranam, that originally formed the entrances to a now ruined great Shiva temple.',
    shortDescription: 'Ancient Kakatiya dynasty fort with impressive architecture.',
    location: {
      type: 'Point',
      coordinates: [79.5833, 17.9667],
      address: 'Warangal Fort, Warangal',
      district: 'Warangal'
    },
    images: [
      {
        url: 'https://indiano.travel/wp-content/uploads/2022/06/White-Slate-Grey-Company-Dynamic-Neons-Company-Website-1590-%C3%97-1050-px-1.jpg',
        alt: 'Warangal Fort ruins',
        isPrimary: true
      }
    ],
    category: 'Historical',
    bestTimeToVisit: 'October to March',
    entryFee: '₹15 for Indians, ₹200 for foreigners',
    timings: '6:00 AM to 6:00 PM',
    facilities: ['Parking', 'Guided Tours', 'Photography'],
    rating: {
      average: 4.1,
      count: 650
    },
    featured: false,
    isActive: true
  },
  {
    name: 'Bhadrachalam Temple',
    description: 'Bhadrachalam Temple is a Hindu temple of Lord Rama located in Bhadrachalam, Telangana, India. The area is called as Bhadrachalam and is the venue of grand celebrations on Rama Navami, when the wedding anniversary of Lord Rama and his consort Sita takes place with much fanfare.',
    shortDescription: 'Sacred temple dedicated to Lord Rama.',
    location: {
      type: 'Point',
      coordinates: [80.8833, 17.6667],
      address: 'Bhadrachalam Temple, Bhadrachalam',
      district: 'Bhadrachalam'
    },
    images: [
      {
        url: 'https://3.bp.blogspot.com/-IHASAmzwTD0/VtfG4ZABhbI/AAAAAAAAINg/qP7-iB7MmDc/s1600/bhadrachalam_temple_river.jpg',
        alt: 'Bhadrachalam Temple',
        isPrimary: true
      }
    ],
    category: 'Religious',
    bestTimeToVisit: 'October to March',
    entryFee: 'Free',
    timings: '4:00 AM to 9:00 PM',
    facilities: ['Parking', 'Prasadam', 'Accommodation'],
    rating: {
      average: 4.4,
      count: 1200
    },
    featured: false,
    isActive: true
  },
  {
    name: 'Nagarjuna Sagar Dam',
    description: 'Nagarjuna Sagar Dam is a masonry dam across the Krishna River at Nagarjuna Sagar which straddles the border between Nalgonda district in Telangana and Palnadu district in Andhra Pradesh. The dam provides irrigation water to the Nalgonda, Suryapet, Krishna, Khammam, West Godavari, Guntur, and Prakasam districts.',
    shortDescription: 'Massive dam with beautiful reservoir and ancient Buddhist sites.',
    location: {
      type: 'Point',
      coordinates: [79.3167, 16.5667],
      address: 'Nagarjuna Sagar Dam, Nalgonda',
      district: 'Nalgonda'
    },
    images: [
      {
        url: 'https://travelsetu.com/apps/uploads/new_destinations_photos/destination/2024/01/01/d27fbb092ce54662ad53869703c3534e_1000x1000.jpg',
        alt: 'Nagarjuna Sagar Dam',
        isPrimary: true
      }
    ],
    category: 'Natural',
    bestTimeToVisit: 'October to March',
    entryFee: '₹20 per person',
    timings: '9:00 AM to 5:00 PM',
    facilities: ['Parking', 'Boat Rides', 'Viewing Gallery'],
    rating: {
      average: 4.0,
      count: 750
    },
    featured: false,
    isActive: true
  },
  {
    name: 'Kuntala Waterfalls',
    description: 'Kuntala Waterfalls is a waterfall located in Adilabad district, Telangana, India. It is the highest waterfall in Telangana with a height of 45 meters. The waterfall is formed by the Kadem River and is surrounded by dense forests.',
    shortDescription: 'Highest waterfall in Telangana surrounded by lush forests.',
    location: {
      type: 'Point',
      coordinates: [78.5167, 19.6667],
      address: 'Kuntala Waterfalls, Adilabad',
      district: 'Adilabad'
    },
    images: [
      {
        url: 'https://4.bp.blogspot.com/-JFCc76lt_6A/UlwfsW1y9cI/AAAAAAAAJ0U/5bvqlGfEu-Q/s1600/IMG_7973_2048x1365.jpg',
        alt: 'Kuntala Waterfalls',
        isPrimary: true
      }
    ],
    category: 'Natural',
    bestTimeToVisit: 'July to October',
    entryFee: '₹10 per person',
    timings: '6:00 AM to 6:00 PM',
    facilities: ['Parking', 'Food Stalls', 'Photography'],
    rating: {
      average: 4.2,
      count: 850
    },
    featured: false,
    isActive: true
  },
  {
    name: 'Medak Cathedral',
    description: 'Medak Cathedral is the seat of the Diocese of Medak of the Church of South India. It is one of the largest churches in India and is known for its Gothic architecture. The cathedral was built by the British Wesleyan Methodists and is a fine example of colonial architecture.',
    shortDescription: 'Largest church in India with stunning Gothic architecture.',
    location: {
      type: 'Point',
      coordinates: [78.2667, 18.0333],
      address: 'Medak Cathedral, Medak',
      district: 'Medak'
    },
    images: [
      {
        url: 'https://2.bp.blogspot.com/-1-sdSfSETSU/VuzP-vid2TI/AAAAAAAAItg/feEQ54h-DoMRjkcv7EC33TfuZl5SqLOFQ/s1600/Medak%2BCathedral%2BMonument.jpg',
        alt: 'Medak Cathedral',
        isPrimary: true
      }
    ],
    category: 'Religious',
    bestTimeToVisit: 'October to March',
    entryFee: 'Free',
    timings: '6:00 AM to 6:00 PM',
    facilities: ['Parking', 'Guided Tours', 'Photography'],
    rating: {
      average: 4.3,
      count: 600
    },
    featured: false,
    isActive: true
  }
];

const sampleFestivals = [
  {
    name: 'Bathukamma',
    description: 'Bathukamma is a floral festival celebrated by the women of Telangana. It is a celebration of the inherent relationship between earth, water, and human beings. The festival is celebrated for nine days during Durga Navratri.',
    shortDescription: 'Colorful floral festival celebrating the bond between nature and women.',
    date: {
      start: '2024-10-03',
      end: '2024-10-11'
    },
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.3616], // Hyderabad coordinates
      district: 'All Districts',
      address: 'Throughout Telangana'
    },
    images: [
      {
        url: 'https://4.bp.blogspot.com/-K2P3zoDNiqs/V_KcrGBHLoI/AAAAAAAAALA/i66NEMkuKP4t07kGYlsRItoHNyw4SXwUACK4B/s1600/Bathukamma-Telangana-flower-Festival-13.jpg',
        alt: 'Bathukamma festival celebration',
        isPrimary: true
      }
    ],
    category: 'Cultural',
    significance: 'Celebrates the relationship between earth, water, and human beings',
    activities: ['Flower arrangement', 'Traditional songs', 'Dance performances', 'Community gatherings'],
    featured: true,
    isActive: true
  },
  {
    name: 'Bonalu',
    description: 'Bonalu is a Hindu festival celebrated in Telangana, especially in Hyderabad and Secunderabad. It is dedicated to the goddess Mahakali. The festival involves offering food to the goddess and is celebrated with great enthusiasm.',
    shortDescription: 'Traditional festival dedicated to goddess Mahakali with vibrant processions.',
    date: {
      start: '2024-07-21',
      end: '2024-07-21'
    },
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.3616], // Hyderabad coordinates
      district: 'Hyderabad',
      address: 'Various temples in Hyderabad'
    },
    images: [
      {
        url: 'https://www.abhibus.com/blog/wp-content/uploads/2023/06/Hyderabad-Bonalu-2023-1024x683.jpg',
        alt: 'Bonalu festival procession',
        isPrimary: true
      }
    ],
    category: 'Religious',
    significance: 'Dedicated to goddess Mahakali, seeking blessings and protection',
    activities: ['Temple visits', 'Processions', 'Traditional offerings', 'Cultural programs'],
    featured: true,
    isActive: true
  },
  {
    name: 'Kakatiya Festival',
    description: 'Kakatiya Festival is celebrated to honor the Kakatiya dynasty that ruled over Telangana. The festival showcases the rich cultural heritage and architectural marvels of the Kakatiya period.',
    shortDescription: 'Cultural festival celebrating the legacy of Kakatiya dynasty.',
    date: {
      start: '2024-12-15',
      end: '2024-12-17'
    },
    location: {
      type: 'Point',
      coordinates: [79.5833, 17.9667], // Warangal coordinates
      district: 'Warangal',
      address: 'Warangal Fort and surrounding areas'
    },
    images: [
      {
        url: 'https://images.hindustantimes.com/img/2022/07/05/1600x900/FWYkc7FUYAAKOfV_1657027851794_1657027867866.jpg',
        alt: 'Kakatiya Festival cultural show',
        isPrimary: true
      }
    ],
    category: 'Cultural',
    significance: 'Honors the Kakatiya dynasty and Telangana\'s cultural heritage',
    activities: ['Cultural performances', 'Heritage walks', 'Traditional crafts', 'Food festivals'],
    featured: false,
    isActive: true
  },
  {
    name: 'Sammakka Saralamma Jatara',
    description: 'Sammakka Saralamma Jatara is a tribal festival held in Medaram, Telangana. It is one of the largest tribal festivals in the world, attracting millions of devotees. The festival is dedicated to the tribal goddesses Sammakka and Saralamma.',
    shortDescription: 'World\'s largest tribal festival honoring tribal goddesses.',
    date: {
      start: '2024-02-21',
      end: '2024-02-24'
    },
    location: {
      type: 'Point',
      coordinates: [80.1833, 18.0333], // Medaram coordinates
      district: 'Mulugu',
      address: 'Medaram, Mulugu District'
    },
    images: [
      {
        url: 'https://1.bp.blogspot.com/-qTRiDhatHfk/WmmaUn-5NGI/AAAAAAAAANY/8SY3NSEofBs7TSpcJJC_kuesTgkwN9WVgCLcBGAs/s1600/Medaram%2BSammakka%2BSaralamma%2BJatara%2Bimages%2B%25285%2529.jpg',
        alt: 'Sammakka Saralamma Jatara festival',
        isPrimary: true
      }
    ],
    category: 'Traditional',
    significance: 'Dedicated to tribal goddesses Sammakka and Saralamma',
    activities: ['Tribal rituals', 'Traditional dances', 'Community feasts', 'Cultural programs'],
    featured: true,
    isActive: true
  },
  {
    name: 'Telangana Formation Day',
    description: 'Telangana Formation Day is celebrated on June 2nd every year to commemorate the formation of the state of Telangana. The day is marked by various cultural programs, flag hoisting, and celebrations across the state.',
    shortDescription: 'State formation day celebration with cultural programs and festivities.',
    date: {
      start: '2024-06-02',
      end: '2024-06-02'
    },
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.3616], // Hyderabad coordinates
      district: 'All Districts',
      address: 'Throughout Telangana'
    },
    images: [
      {
        url: 'https://assets.thehansindia.com/h-upload/2024/05/30/1450630-telangana-formation-day-.webp',
        alt: 'Telangana Formation Day celebration',
        isPrimary: true
      }
    ],
    category: 'Modern',
    significance: 'Commemorates the formation of Telangana state',
    activities: ['Flag hoisting', 'Cultural programs', 'Parades', 'Government functions'],
    featured: false,
    isActive: true
  },
  {
    name: 'Vinayaka Chavithi',
    description: 'Vinayaka Chavithi is a Hindu festival dedicated to Lord Ganesha. It is celebrated with great enthusiasm across Telangana, with people bringing home Ganesha idols and celebrating for several days.',
    shortDescription: 'Festival dedicated to Lord Ganesha with colorful celebrations.',
    date: {
      start: '2024-09-07',
      end: '2024-09-07'
    },
    location: {
      type: 'Point',
      coordinates: [78.4747, 17.3616], // Hyderabad coordinates
      district: 'All Districts',
      address: 'Throughout Telangana'
    },
    images: [
      {
        url: 'https://static.toiimg.com/photo/imgsize-23456,msid-123507337,resizemode-4/ganesh-chaturthi-2025.jpg',
        alt: 'Vinayaka Chavithi celebration',
        isPrimary: true
      }
    ],
    category: 'Religious',
    significance: 'Dedicated to Lord Ganesha, the remover of obstacles',
    activities: ['Idol installation', 'Prayers', 'Cultural programs', 'Community celebrations'],
    featured: false,
    isActive: true
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@telanganatourism.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  }
];

async function clearAndReseed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telangana-tourism', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Place.deleteMany({});
    await Festival.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log('Existing data cleared');

    // Insert new data
    console.log('Inserting new data...');
    const places = await Place.insertMany(samplePlaces);
    const festivals = await Festival.insertMany(sampleFestivals);
    const users = await User.insertMany(sampleUsers);
    
    console.log(`Inserted ${places.length} places`);
    console.log(`Inserted ${festivals.length} festivals`);
    console.log(`Inserted ${users.length} users`);
    
    console.log('Database reseeding completed successfully!');
    
    console.log('\nSample login credentials:');
    console.log('Admin: admin@telanganatourism.com / admin123');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');
    
  } catch (error) {
    console.error('Error during reseeding:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

clearAndReseed();
