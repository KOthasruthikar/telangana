import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaStar, FaArrowRight } from 'react-icons/fa';
import './About.css';

const About = () => {
  const [activeTimelineItem, setActiveTimelineItem] = useState(0);

  const timelineData = [
    {
      year: '1956',
      title: 'Formation of Andhra Pradesh',
      description: 'Telangana region was merged with Andhra State to form Andhra Pradesh state.',
      image: 'https://resorcio.com/_next/image?url=https:%2F%2Fd1xuqjt1wg0fxw.cloudfront.net%2F942ba140-e0c1-11ec-b78d-03556ef79d78.jpg&w=512&q=75'
    },
    {
      year: '1969',
      title: 'Telangana Agitation',
      description: 'First major movement for separate Telangana state began with student protests.',
      image: 'https://media.telanganatoday.com/wp-content/uploads/2022/04/GO-36.jpg'
    },
    {
      year: '2001',
      title: 'KCR\'s Fast',
      description: 'K. Chandrashekar Rao began his fast unto death for separate Telangana state.',
      image: 'https://media.telanganatoday.com/wp-content/uploads/2023/11/KCR-3.jpg'
    },
    {
      year: '2014',
      title: 'Telangana State Formation',
      description: 'Telangana was officially formed as the 29th state of India on June 2, 2014.',
      image: 'https://images.indianexpress.com/2023/06/Untitled-design-46.jpg'
    }
  ];

  const stats = [
    { icon: FaMapMarkerAlt, label: 'Districts', value: '33' },
    { icon: FaUsers, label: 'Population', value: '3.5 Cr' },
    { icon: FaCalendarAlt, label: 'Formed', value: '2014' },
    { icon: FaStar, label: 'Capital', value: 'Hyderabad' }
  ];

  const features = [
    {
      title: 'Rich Heritage',
      description: 'Home to ancient Kakatiya dynasty monuments and UNESCO World Heritage Sites.',
      image: 'https://3.bp.blogspot.com/-LcUj6Ju3cBQ/V49QW-edmzI/AAAAAAAAATQ/W0LdBLjk_pcPdkELpG7SZdM7i2fmqQdsQCLcB/s1600/Kakatiya-Rulers-exploretelangana.jpg'
    },
    {
      title: 'Vibrant Culture',
      description: 'Diverse festivals, traditional arts, and cultural practices that reflect the state\'s unique identity.',
      image: 'https://static.toiimg.com/imagenext/toiblogs/photo/blogs/wp-content/uploads/2015/02/TEL-3.jpg'
    },
    {
      title: 'Natural Beauty',
      description: 'From the Deccan Plateau to lush forests, Telangana offers diverse landscapes.',
      image: 'https://www.godigit.com/content/dam/godigit/directportal/en/contenthm/waterfalls-in-hyderabad.jpg'
    },
    {
      title: 'Modern Development',
      description: 'Hyderabad as a major IT hub while preserving traditional values and heritage.',
      image: 'https://images.indianexpress.com/2023/06/talangana.jpg  '
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimelineItem((prev) => (prev + 1) % timelineData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [timelineData.length]);

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About Telangana</h1>
            <p>
              Discover the rich history, vibrant culture, and natural beauty of Telangana - 
              the youngest state of India with an ancient soul.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="stat-item">
                  <div className="stat-icon">
                    <Icon />
                  </div>
                  <div className="stat-content">
                    <h3>{stat.value}</h3>
                    <p>{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="overview-section">
        <div className="container">
          <div className="section-header">
            <h2>Welcome to Telangana</h2>
            <p>
              Telangana, the 29th state of India, was formed on June 2, 2014. 
              Located in the southern part of India, it is known for its rich cultural heritage, 
              historical monuments, and rapid economic development.
            </p>
          </div>

          <div className="overview-content">
            <div className="overview-text">
              <h3>Geographical Overview</h3>
              <p>
                Telangana is situated on the Deccan Plateau and is bordered by Maharashtra to the north, 
                Chhattisgarh to the northeast, Karnataka to the west, and Andhra Pradesh to the south and east. 
                The state covers an area of 112,077 square kilometers and has a population of over 35 million people.
              </p>
              
              <h3>Capital City</h3>
              <p>
                Hyderabad, the capital of Telangana, is a major IT hub and one of the fastest-growing cities in India. 
                Known as the "City of Pearls" and "Cyberabad," it perfectly blends traditional heritage with modern development.
              </p>

              <h3>Economy</h3>
              <p>
                Telangana has a diverse economy with agriculture, industry, and services sectors. 
                The state is a major producer of rice, cotton, and sugarcane. Hyderabad is home to 
                numerous IT companies, pharmaceutical industries, and research institutions.
              </p>
            </div>
            
            <div className="overview-image">
              <img src="https://d-maps.com/m/asia/india/telangana/telangana69.gif" alt="Telangana Map" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>What Makes Telangana Special</h2>
            <p>Explore the unique aspects that make Telangana a must-visit destination</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-image">
                  <img src={feature.image} alt={feature.title} />
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>Journey Through Time</h2>
            <p>Key milestones in Telangana's history and formation</p>
          </div>

          <div className="timeline-container">
            <div className="timeline-nav">
              {timelineData.map((item, index) => (
                <button
                  key={index}
                  className={`timeline-nav-item ${activeTimelineItem === index ? 'active' : ''}`}
                  onClick={() => setActiveTimelineItem(index)}
                >
                  <span className="timeline-year">{item.year}</span>
                  <span className="timeline-title">{item.title}</span>
                </button>
              ))}
            </div>

            <div className="timeline-content">
              <div className="timeline-image">
                <img 
                  src={timelineData[activeTimelineItem].image} 
                  alt={timelineData[activeTimelineItem].title}
                />
              </div>
              <div className="timeline-text">
                <h3>{timelineData[activeTimelineItem].title}</h3>
                <p>{timelineData[activeTimelineItem].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="culture-section">
        <div className="container">
          <div className="section-header">
            <h2>Rich Cultural Heritage</h2>
            <p>Experience the vibrant traditions and cultural diversity of Telangana</p>
          </div>

          <div className="culture-content">
            <div className="culture-text">
              <h3>Languages</h3>
              <p>
                Telugu is the official language, while Urdu is widely spoken, especially in Hyderabad. 
                The state also has significant populations speaking Hindi, Marathi, and Kannada.
              </p>

              <h3>Festivals</h3>
              <p>
                Telangana celebrates a variety of festivals including Bathukamma, Bonalu, 
                Sammakka Saralamma Jatara, and traditional Hindu festivals. These celebrations 
                showcase the state's rich cultural traditions.
              </p>

              <h3>Arts and Crafts</h3>
              <p>
                The state is known for its traditional handicrafts including Bidri work, 
                Nirmal paintings, and Pochampally sarees. These art forms have been passed 
                down through generations and continue to thrive.
              </p>
            </div>

            <div className="culture-images">
              <div className="culture-image-grid">
                <img src="https://4.bp.blogspot.com/-K2P3zoDNiqs/V_KcrGBHLoI/AAAAAAAAALA/i66NEMkuKP4t07kGYlsRItoHNyw4SXwUACK4B/s1600/Bathukamma-Telangana-flower-Festival-13.jpg" alt="Bathukamma Festival" />
                <img src="https://www.christies.com/img/LotImages/2013/CSK/2013_CSK_09917_0092_000(four_silver-inlaid_bidri_vessels_bidar_deccan_19th_century).jpg" alt="Bidri Work" />
                <img src="https://media.telanganatoday.com/wp-content/uploads/2022/08/On-handloom-day-visit-this-village-in-Telangana-to-witness-art-of-weaving.jpg" alt="Pochampally Sarees" />
                <img src="https://i.pinimg.com/originals/55/56/d6/5556d634ee9fc86dd09cfdfe0ebf4a94.jpg" alt="Kuchipudi Dance" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tourism Section */}
      <section className="tourism-section">
        <div className="container">
          <div className="section-header">
            <h2>Tourism in Telangana</h2>
            <p>Discover the diverse attractions that make Telangana a tourist paradise</p>
          </div>

          <div className="tourism-content">
            <div className="tourism-categories">
              <div className="tourism-category">
                <h3>Historical Monuments</h3>
                <p>
                  Explore ancient forts, temples, and monuments that tell the story of 
                  Telangana's rich history from the Kakatiya dynasty to the Qutb Shahi period.
                </p>
                <ul>
                  <li>Charminar - Iconic monument of Hyderabad</li>
                  <li>Golconda Fort - Ancient fort with rich history</li>
                  <li>Warangal Fort - Kakatiya dynasty architecture</li>
                  <li>Ramappa Temple - UNESCO World Heritage Site</li>
                </ul>
              </div>

              <div className="tourism-category">
                <h3>Religious Sites</h3>
                <p>
                  Visit sacred temples and religious sites that attract devotees from 
                  across the country and showcase the spiritual heritage of the region.
                </p>
                <ul>
                  <li>Birla Mandir - Modern temple in Hyderabad</li>
                  <li>Mecca Masjid - Historic mosque</li>
                  <li>Thousand Pillar Temple - Ancient temple architecture</li>
                  <li>Basara Temple - Temple of Goddess Saraswati</li>
                </ul>
              </div>

              <div className="tourism-category">
                <h3>Natural Attractions</h3>
                <p>
                  Experience the natural beauty of Telangana through its wildlife sanctuaries, 
                  lakes, and scenic landscapes that offer perfect getaways.
                </p>
                <ul>
                  <li>KBR National Park - Urban wildlife sanctuary</li>
                  <li>Hussain Sagar Lake - Heart of Hyderabad</li>
                  <li>Pakhal Lake - Scenic lake in Warangal</li>
                  <li>Kawal Wildlife Sanctuary - Rich biodiversity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore Telangana?</h2>
            <p>Start your journey today and discover the amazing places and experiences that await you.</p>
            <div className="cta-buttons">
              <a href="/places" className="btn btn-primary">
                Explore Places <FaArrowRight />
              </a>
              <a href="/festivals" className="btn btn-secondary">
                View Festivals <FaArrowRight />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
