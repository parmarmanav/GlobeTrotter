const mongoose = require('mongoose');
const dns = require('node:dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']); } catch (e) {}
const bcrypt = require('bcryptjs');
const config = require('../src/config/env');
const User = require('../src/models/User');
const City = require('../src/models/City');
const Activity = require('../src/models/Activity');
const Trip = require('../src/models/Trip');

const seedData = async () => {
  try {
    console.log(`[Seed Script] Connecting to MongoDB: ${config.mongodbUri}...`);
    await mongoose.connect(config.mongodbUri);
    console.log(`[Seed Script] Connected to database: ${mongoose.connection.name}`);

    // 1. Seed Admin & Demo Users
    let adminUser = await User.findOne({ email: 'admin@globetrotter.com' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Admin@12345', salt);
      adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'GlobeTrotter',
        username: 'admin',
        email: 'admin@globetrotter.com',
        passwordHash,
        role: 'ADMIN',
        city: 'New York',
        country: 'USA'
      });
      console.log('[Seed Script] Initial Admin User created!');
    }

    // 2. Seed Destination Cities
    const sampleCities = [
      {
        name: 'Paris',
        country: 'France',
        region: 'Europe',
        description: 'The City of Light known for art, fashion, gastronomy and culture.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        costIndex: 4,
        popularityScore: 98,
        tags: ['romantic', 'culture', 'food', 'museums', 'architecture']
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        region: 'Asia',
        description: 'A vibrant metropolis blending ultra-modern neon-lit skyscrapers with historic temples.',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
        costIndex: 4,
        popularityScore: 96,
        tags: ['technology', 'food', 'culture', 'shopping', 'anime']
      },
      {
        name: 'Rome',
        country: 'Italy',
        region: 'Europe',
        description: 'The Eternal City with nearly 3,000 years of globally influential art and architecture.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
        costIndex: 3,
        popularityScore: 95,
        tags: ['history', 'ruins', 'food', 'architecture', 'culture']
      },
      {
        name: 'New York',
        country: 'USA',
        region: 'North America',
        description: 'The premier global hub for finance, culture, theater and culinary innovation.',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
        costIndex: 5,
        popularityScore: 97,
        tags: ['skyline', 'broadway', 'shopping', 'museums', 'nightlife']
      },
      {
        name: 'Bali',
        country: 'Indonesia',
        region: 'Asia',
        description: 'An Indonesian paradise known for its forested volcanic mountains, beaches and coral reefs.',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
        costIndex: 2,
        popularityScore: 94,
        tags: ['beach', 'nature', 'spiritual', 'surfing', 'wellness']
      }
    ];

    const cityMap = {};
    for (const c of sampleCities) {
      let city = await City.findOne({ name: c.name, country: c.country });
      if (!city) {
        city = await City.create(c);
        console.log(`[Seed Script] Seeded City: ${c.name}`);
      }
      cityMap[c.name] = city;
    }

    // 3. Seed Activities
    const sampleActivities = [
      // Paris
      {
        cityName: 'Paris',
        name: 'Eiffel Tower Summit Tour',
        description: 'Guided tour of the iconic Eiffel Tower with priority summit access.',
        category: 'SIGHTSEEING',
        durationMinutes: 120,
        estimatedCost: 35,
        rating: 4.8,
        popularityScore: 99,
        tags: ['landmark', 'views', 'iconic']
      },
      {
        cityName: 'Paris',
        name: 'Louvre Museum Masterpieces Tour',
        description: 'Skip-the-line guided visit exploring the Mona Lisa, Venus de Milo and more.',
        category: 'CULTURE',
        durationMinutes: 180,
        estimatedCost: 40,
        rating: 4.9,
        popularityScore: 98,
        tags: ['art', 'history', 'museum']
      },
      {
        cityName: 'Paris',
        name: 'Seine River Sunset Dinner Cruise',
        description: 'Gourmet 3-course French dinner while cruising past illuminated monuments.',
        category: 'FOOD',
        durationMinutes: 150,
        estimatedCost: 85,
        rating: 4.7,
        popularityScore: 92,
        tags: ['romantic', 'dinner', 'cruise']
      },
      // Tokyo
      {
        cityName: 'Tokyo',
        name: 'Tsukiji Outer Market Food Crawl',
        description: 'Taste the freshest sushi, tamagoyaki and wagyu beef skewers with a local chef.',
        category: 'FOOD',
        durationMinutes: 150,
        estimatedCost: 50,
        rating: 4.9,
        popularityScore: 95,
        tags: ['sushi', 'market', 'street-food']
      },
      {
        cityName: 'Tokyo',
        name: 'Shibuya Sky & Harajuku Culture Walk',
        description: '360 panoramic views from Shibuya Sky followed by pop-culture exploration in Takeshita Street.',
        category: 'CULTURE',
        durationMinutes: 180,
        estimatedCost: 25,
        rating: 4.8,
        popularityScore: 96,
        tags: ['views', 'fashion', 'shibuya']
      },
      // Rome
      {
        cityName: 'Rome',
        name: 'Colosseum Underground & Ancient Forum',
        description: 'Exclusive restricted access to the arena floor, underground dungeons and gladiators gate.',
        category: 'SIGHTSEEING',
        durationMinutes: 210,
        estimatedCost: 60,
        rating: 4.9,
        popularityScore: 99,
        tags: ['gladiator', 'ancient', 'unesco']
      }
    ];

    for (const act of sampleActivities) {
      const city = cityMap[act.cityName];
      if (city) {
        const existingAct = await Activity.findOne({ name: act.name, cityId: city._id });
        if (!existingAct) {
          await Activity.create({
            cityId: city._id,
            name: act.name,
            description: act.description,
            category: act.category,
            durationMinutes: act.durationMinutes,
            estimatedCost: act.estimatedCost,
            rating: act.rating,
            popularityScore: act.popularityScore,
            tags: act.tags
          });
          console.log(`[Seed Script] Seeded Activity: ${act.name}`);
        }
      }
    }

    // 4. Seed Comprehensive Sample Trip with Budget & Expenses
    const existingTrip = await Trip.findOne({ userId: adminUser._id });
    if (!existingTrip && cityMap['Paris']) {
      const parisCity = cityMap['Paris'];
      const eiffelAct = await Activity.findOne({ name: 'Eiffel Tower Summit Tour' });
      const louvreAct = await Activity.findOne({ name: 'Louvre Museum Masterpieces Tour' });

      await Trip.create({
        userId: adminUser._id,
        name: 'Paris & Beyond 2026',
        description: '5-day luxury culture and gastronomy adventure in Paris',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-09-05'),
        status: 'PLANNED',
        isPublic: true,
        budget: {
          totalBudget: 3000,
          currency: 'EUR'
        },
        stops: [
          {
            cityId: parisCity._id,
            cityName: 'Paris',
            country: 'France',
            startDate: new Date('2026-09-01'),
            endDate: new Date('2026-09-05'),
            sequenceOrder: 1,
            notes: 'Stay at Le Marais boutique hotel'
          }
        ],
        itineraryDays: [
          {
            dayNumber: 1,
            date: new Date('2026-09-01'),
            title: 'Day 1 - Arrival & Landmark Views',
            activities: [
              {
                activityId: eiffelAct ? eiffelAct._id : undefined,
                title: 'Eiffel Tower Summit Tour',
                description: 'Panoramic summit visit',
                startTime: '10:00 AM',
                endTime: '12:00 PM',
                estimatedCost: 35,
                category: 'SIGHTSEEING',
                sequenceOrder: 1
              }
            ]
          },
          {
            dayNumber: 2,
            date: new Date('2026-09-02'),
            title: 'Day 2 - World-Class Art & Gourmet Dining',
            activities: [
              {
                activityId: louvreAct ? louvreAct._id : undefined,
                title: 'Louvre Museum Masterpieces Tour',
                description: 'Mona Lisa and classical antiquities',
                startTime: '09:30 AM',
                endTime: '01:00 PM',
                estimatedCost: 40,
                category: 'CULTURE',
                sequenceOrder: 1
              }
            ]
          }
        ],
        expenses: [
          {
            title: 'Le Marais Boutique Hotel (4 nights)',
            amount: 1200,
            category: 'STAY',
            currency: 'EUR',
            date: new Date('2026-09-01'),
            notes: 'Confirmed booking'
          },
          {
            title: 'Eurostar Express Train Ticket',
            amount: 220,
            category: 'TRANSPORT',
            currency: 'EUR',
            date: new Date('2026-09-01'),
            notes: 'First-class ticket'
          },
          {
            title: 'Tasting Menu at Le Gabriel',
            amount: 350,
            category: 'MEAL',
            currency: 'EUR',
            date: new Date('2026-09-02'),
            notes: '2-Michelin-star dinner'
          },
          {
            title: 'Louvre & Eiffel Guided Entry Tickets',
            amount: 75,
            category: 'ACTIVITY',
            currency: 'EUR',
            date: new Date('2026-09-01'),
            notes: 'Advance skip-the-line passes'
          }
        ]
      });
      console.log('[Seed Script] Sample Trip with Stops, Itinerary, Budget & Expenses created!');
    }

    console.log('[Seed Script] Database seeded successfully! Check MongoDB Atlas Collections now.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Script] Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
