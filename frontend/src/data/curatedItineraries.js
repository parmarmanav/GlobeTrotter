/**
 * Curated Day-by-Day Itineraries for Destination Cities
 * All costs in INR (₹)
 */

export const CITY_CURATED_ITINERARIES = {
  // EUROPE
  Paris: {
    durationDays: 3,
    estimatedBudgetINR: 65000,
    tagline: 'Art, Romance & Parisian Gastronomy',
    days: [
      {
        dayNumber: 1,
        title: 'Iconic Landmarks & Seine River Sunset',
        summary: 'Ascend the Eiffel Tower, stroll Champ de Mars, and enjoy a luxury evening Seine dinner cruise.',
        activities: [
          {
            title: 'Eiffel Tower Summit & Trocadéro Viewpoint',
            description: 'Start early at Place du Trocadéro for pristine sunrise photos before taking the elevator to the Eiffel Tower summit.',
            startTime: '09:00 AM',
            endTime: '12:00 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 3200,
          },
          {
            title: 'Lunch at Rue Cler Market Bistro',
            description: 'Indulge in artisanal cheeses, fresh baguettes, and duck confit at a classic open-air pedestrian market.',
            startTime: '12:30 PM',
            endTime: '02:00 PM',
            category: 'FOOD',
            estimatedCost: 2400,
          },
          {
            title: 'Seine River Sunset Dinner Cruise',
            description: 'Gourmet 3-course French dinner on a glass canopy boat floating past illuminated monuments.',
            startTime: '06:30 PM',
            endTime: '09:00 PM',
            category: 'FOOD',
            estimatedCost: 7500,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Masterpieces of Louvre & Latin Quarter',
        summary: 'Explore the Mona Lisa, wander the Tuileries Garden, and discover vibrant Latin Quarter bookshops.',
        activities: [
          {
            title: 'Louvre Museum Masterpieces Guided Tour',
            description: 'Priority entry exploring the Mona Lisa, Winged Victory of Samothrace, and ancient Egyptian galleries.',
            startTime: '09:30 AM',
            endTime: '01:00 PM',
            category: 'CULTURE',
            estimatedCost: 3800,
          },
          {
            title: 'Tuileries Gardens & Angelina Hot Chocolate',
            description: 'Relax in sculpted royal gardens and sample world-famous African hot chocolate and Mont Blanc pastries.',
            startTime: '02:00 PM',
            endTime: '04:00 PM',
            category: 'FOOD',
            estimatedCost: 1800,
          },
          {
            title: 'Notre-Dame & Saint-Germain Jazz Evening',
            description: 'View the restored Notre-Dame facade followed by live jazz and wine tasting in Saint-Germain-des-Prés.',
            startTime: '06:00 PM',
            endTime: '09:30 PM',
            category: 'NIGHTLIFE',
            estimatedCost: 4500,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Bohemian Montmartre & Le Marais Boutiques',
        summary: 'Sacré-Cœur basilica views, portrait artists at Place du Tertre, and chic shopping in Le Marais.',
        activities: [
          {
            title: 'Sacré-Cœur Basilica & Montmartre Funicular',
            description: 'Climb the dome of Sacré-Cœur for breathtaking panoramic views over Paris and visit historic windmills.',
            startTime: '09:00 AM',
            endTime: '12:00 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 1500,
          },
          {
            title: 'Artisanal Falafel & Boutiques in Le Marais',
            description: 'Explore Renaissance courtyards, modern art galleries, and legendary street food on Rue des Rosiers.',
            startTime: '01:30 PM',
            endTime: '05:00 PM',
            category: 'SHOPPING',
            estimatedCost: 3500,
          },
          {
            title: 'Opera Garnier Evening Tour & French Bistro',
            description: 'Admire Marc Chagall ceiling frescoes inside Palais Garnier followed by traditional French onion soup.',
            startTime: '06:30 PM',
            endTime: '09:30 PM',
            category: 'CULTURE',
            estimatedCost: 4200,
          },
        ],
      },
    ],
  },

  Rome: {
    durationDays: 3,
    estimatedBudgetINR: 52000,
    tagline: 'Gladiators, Renaissance Palaces & Authentic Trastevere',
    days: [
      {
        dayNumber: 1,
        title: 'Ancient Colosseum, Forum & Palatine Hill',
        summary: 'Step back in time to the Roman Empire arena floor and emperor palaces.',
        activities: [
          {
            title: 'Colosseum Underground & Gladiators Arena',
            description: 'Skip-the-line VIP access to the arena floor, subterranean chambers, and Emperor viewing boxes.',
            startTime: '09:00 AM',
            endTime: '12:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 4800,
          },
          {
            title: 'Roman Forum & Palatine Hill Walking Tour',
            description: 'Stroll among Temple of Saturn, Julius Caesar cremation altar, and imperial residential ruins.',
            startTime: '02:00 PM',
            endTime: '05:00 PM',
            category: 'CULTURE',
            estimatedCost: 2000,
          },
          {
            title: 'Trastevere Pasta & Wine Crawl',
            description: 'Savor handmade Cacio e Pepe, Carbonara, and local Chianti wines in cobblestone alleys.',
            startTime: '07:00 PM',
            endTime: '10:00 PM',
            category: 'FOOD',
            estimatedCost: 3600,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Vatican Museums, Sistine Chapel & St. Peter’s',
        summary: 'Marvel at Michelangelo frescoes and the world’s grandest basilica.',
        activities: [
          {
            title: 'Vatican Museums & Sistine Chapel Tour',
            description: 'Exclusive morning entry past Raphael Rooms to view Michelangelo’s Genesis and The Last Judgment.',
            startTime: '08:30 AM',
            endTime: '12:30 PM',
            category: 'CULTURE',
            estimatedCost: 4500,
          },
          {
            title: 'St. Peter’s Basilica Dome Climb',
            description: 'Climb 551 steps to the top of the basilica dome for 360-degree views of St. Peter’s Square.',
            startTime: '01:30 PM',
            endTime: '03:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 1200,
          },
          {
            title: 'Castel Sant’Angelo Sunset Walk',
            description: 'Walk across Ponte Sant’Angelo bridge lined with Bernini marble angels at golden hour.',
            startTime: '05:30 PM',
            endTime: '08:00 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 1800,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Trevi Fountain, Pantheon & Piazza Navona',
        summary: 'Toss coins in Trevi Fountain, gaze through the Pantheon oculus, and taste artisanal gelato.',
        activities: [
          {
            title: 'Trevi Fountain Coin Toss & Spanish Steps',
            description: 'Make a wish at the Baroque Trevi Fountain and climb the Piazza di Spagna staircase.',
            startTime: '09:00 AM',
            endTime: '11:30 AM',
            category: 'SIGHTSEEING',
            estimatedCost: 500,
          },
          {
            title: 'Pantheon Architecture & Giolitti Gelato',
            description: 'Enter the 2,000-year-old preserved dome followed by Rome’s oldest 100-flavor gelateria.',
            startTime: '12:00 PM',
            endTime: '02:30 PM',
            category: 'FOOD',
            estimatedCost: 1200,
          },
          {
            title: 'Piazza Navona Fountains & Rooftop Apertivo',
            description: 'Admire Bernini’s Fountain of Four Rivers while sipping Aperol Spritz from a palazzo rooftop.',
            startTime: '05:00 PM',
            endTime: '08:30 PM',
            category: 'NIGHTLIFE',
            estimatedCost: 3500,
          },
        ],
      },
    ],
  },

  Barcelona: {
    durationDays: 3,
    estimatedBudgetINR: 48000,
    tagline: 'Gaudí Architecture, Gothic Quarters & Mediterranean Beaches',
    days: [
      {
        dayNumber: 1,
        title: 'Sagrada Família & Modernist Wonders',
        summary: 'Explore Gaudí’s architectural magnum opus and the colorful ceramic mosaics of Park Güell.',
        activities: [
          {
            title: 'Sagrada Família Basilica & Towers Tour',
            description: 'Guided tour of the stained-glass forest interior and elevator ride up the Nativity facade tower.',
            startTime: '09:30 AM',
            endTime: '12:30 PM',
            category: 'CULTURE',
            estimatedCost: 3500,
          },
          {
            title: 'Park Güell Mosaic Serpent Terrace',
            description: 'Wander gingerbread houses, stone colonnades, and panoramic Mediterranean sea views.',
            startTime: '02:30 PM',
            endTime: '05:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 1800,
          },
          {
            title: 'El Born Tapas & Sangria Evening',
            description: 'Sample Iberico ham, patatas bravas, pimientos de padrón, and fresh seafood paella.',
            startTime: '07:30 PM',
            endTime: '10:30 PM',
            category: 'FOOD',
            estimatedCost: 3200,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Gothic Quarter, La Boqueria & Barceloneta Beach',
        summary: 'Medieval stone alleyways, vibrant food markets, and beachfront seafood dining.',
        activities: [
          {
            title: 'Gothic Quarter Walking Tour & Cathedral',
            description: 'Discover Roman ruins, the Bridge of Sighs, and secret plazas in the historic center.',
            startTime: '09:30 AM',
            endTime: '12:00 PM',
            category: 'CULTURE',
            estimatedCost: 1500,
          },
          {
            title: 'Mercat de la Boqueria Food Tasting',
            description: 'Sample fresh exotic fruit juices, artisan cheeses, and grilled octopus skewers.',
            startTime: '12:30 PM',
            endTime: '02:30 PM',
            category: 'FOOD',
            estimatedCost: 2000,
          },
          {
            title: 'Barceloneta Beachfront Sunset & Paella',
            description: 'Relax along the palm-lined Mediterranean coast and savor authentic black rice paella.',
            startTime: '05:00 PM',
            endTime: '09:00 PM',
            category: 'RELAXATION',
            estimatedCost: 3800,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Casa Batlló, Passeig de Gràcia & Montjuïc Castle',
        summary: 'Gaudí dragon rooftops, luxury avenue shopping, and cable car rides to Montjuïc Castle.',
        activities: [
          {
            title: 'Casa Batlló Immersive Gaudí Experience',
            description: 'Augmented reality tour through the fantastical ocean-inspired dragon bone house.',
            startTime: '09:30 AM',
            endTime: '12:00 PM',
            category: 'CULTURE',
            estimatedCost: 3200,
          },
          {
            title: 'Montjuïc Cable Car & Castle Panoramic Views',
            description: 'Ride the aerial cable car above the harbor to the 17th-century fortress.',
            startTime: '02:30 PM',
            endTime: '05:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 2200,
          },
          {
            title: 'Magic Fountain of Montjuïc Light Show',
            description: 'Watch musical fountain choreography with water, light, and classical soundtrack.',
            startTime: '07:30 PM',
            endTime: '09:30 PM',
            category: 'NIGHTLIFE',
            estimatedCost: 1000,
          },
        ],
      },
    ],
  },

  // ASIA
  Tokyo: {
    durationDays: 3,
    estimatedBudgetINR: 58000,
    tagline: 'Futuristic Skyscrapers, Shinto Shrines & Michelin Ramen',
    days: [
      {
        dayNumber: 1,
        title: 'Shibuya Scramble, Meiji Shrine & Harajuku',
        summary: 'Experience the world’s busiest crosswalk, peaceful forested shrines, and colorful youth fashion.',
        activities: [
          {
            title: 'Meiji Jingu Forest Shrine Morning Walk',
            description: 'Pass massive wooden Torii gates into serene 170-acre forest shrine dedicated to Emperor Meiji.',
            startTime: '08:30 AM',
            endTime: '11:00 AM',
            category: 'CULTURE',
            estimatedCost: 800,
          },
          {
            title: 'Harajuku Takeshita Street & Sweet Crepes',
            description: 'Explore trendy boutiques, kawaii culture stores, and famous marionette matcha crepes.',
            startTime: '11:30 AM',
            endTime: '02:30 PM',
            category: 'SHOPPING',
            estimatedCost: 2200,
          },
          {
            title: 'Shibuya Sky Observatory & Scramble Crossing',
            description: 'Open-air glass rooftop observatory 229 meters above Shibuya followed by crossing the neon intersection.',
            startTime: '05:00 PM',
            endTime: '08:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 2600,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Tsukiji Fish Market & Historic Asakusa Senso-ji',
        summary: 'Fresh sashimi breakfast, rickshaw rides past Tokyo’s oldest temple, and futuristic river cruise.',
        activities: [
          {
            title: 'Tsukiji Outer Market Seafood Breakfast',
            description: 'Taste grilled giant scallops, A5 wagyu skewers, tamagoyaki egg, and fresh tuna sashimi bowls.',
            startTime: '08:00 AM',
            endTime: '11:00 AM',
            category: 'FOOD',
            estimatedCost: 3500,
          },
          {
            title: 'Senso-ji Temple & Nakamise Dori Shopping',
            description: 'Incense burning rituals at Tokyo’s 7th-century temple and sampling melon pan and ningyo-yaki.',
            startTime: '12:00 PM',
            endTime: '03:30 PM',
            category: 'CULTURE',
            estimatedCost: 1500,
          },
          {
            title: 'Sumida River Water Bus to Odaiba Rainbow Bridge',
            description: 'Futuristic water boat cruise to Odaiba for life-sized Gundam statue and Rainbow Bridge night views.',
            startTime: '04:30 PM',
            endTime: '08:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 2800,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'teamLab Planets Digital Art & Shinjuku Nightlife',
        summary: 'Walk through water inside immersive digital art installations and explore Shinjuku Golden Gai alleys.',
        activities: [
          {
            title: 'teamLab Planets Immersive Digital Museum',
            description: 'Barefoot sensory art experience walking through crystal universe light fields and floating flower gardens.',
            startTime: '09:30 AM',
            endTime: '12:30 PM',
            category: 'CULTURE',
            estimatedCost: 3200,
          },
          {
            title: 'Ginza Luxury Avenue & Depachika Food Hall',
            description: 'Window shopping along Tokyo’s premier boulevard and gourmet food sampling in Mitsukoshi basement.',
            startTime: '01:30 PM',
            endTime: '04:30 PM',
            category: 'SHOPPING',
            estimatedCost: 2500,
          },
          {
            title: 'Shinjuku Omoide Yokocho & Golden Gai Izakaya',
            description: 'Atmospheric lantern-lit alleyways with charcoal yakitori skewers and craft Japanese highballs.',
            startTime: '06:00 PM',
            endTime: '09:30 PM',
            category: 'NIGHTLIFE',
            estimatedCost: 4000,
          },
        ],
      },
    ],
  },

  Bali: {
    durationDays: 3,
    estimatedBudgetINR: 38000,
    tagline: 'Emerald Rice Terraces, Sacred Temples & Coastal Sunsets',
    days: [
      {
        dayNumber: 1,
        title: 'Ubud Sacred Monkey Forest & Tegallalang Terraces',
        summary: 'Encounter playful macaque monkeys and swing over cascading emerald rice paddies.',
        activities: [
          {
            title: 'Sacred Monkey Forest Sanctuary Ubud',
            description: 'Walk through lush mossy jungle ravines home to hundreds of Balinese long-tailed monkeys and ancient temples.',
            startTime: '09:00 AM',
            endTime: '11:30 AM',
            category: 'NATURE',
            estimatedCost: 1200,
          },
          {
            title: 'Tegallalang Rice Terrace & Jungle Giant Swing',
            description: 'Trek along centuries-old Subak irrigation terrace slopes and fly on the viral tropical valley swing.',
            startTime: '12:30 PM',
            endTime: '03:30 PM',
            category: 'ADVENTURE',
            estimatedCost: 2500,
          },
          {
            title: 'Tirta Empul Holy Water Temple Purification',
            description: 'Participate in sacred Hindu water cleansing rituals in natural volcanic spring stone pools.',
            startTime: '04:30 PM',
            endTime: '06:30 PM',
            category: 'CULTURE',
            estimatedCost: 1000,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Mount Batur Sunrise Trek & Hot Springs',
        summary: 'Hike up an active volcano before dawn for cloud-top sunrise views and soak in thermal springs.',
        activities: [
          {
            title: 'Mount Batur Volcano Sunrise Guided Trek',
            description: 'Pre-dawn hike with headlamps to the crater summit for breakfast cooked by volcanic steam at sunrise.',
            startTime: '03:30 AM',
            endTime: '09:00 AM',
            category: 'ADVENTURE',
            estimatedCost: 4200,
          },
          {
            title: 'Toya Devasya Natural Volcanic Hot Springs',
            description: 'Relax tired muscles in infinity mineral pools overlooking Lake Batur and surrounding mountain peaks.',
            startTime: '10:00 AM',
            endTime: '01:00 PM',
            category: 'RELAXATION',
            estimatedCost: 1800,
          },
          {
            title: 'Traditional Balinese Spa & Herbal Massage',
            description: 'Full body lulur scrub, flower petal bath, and aromatherapy massage at a tranquil river sanctuary.',
            startTime: '04:00 PM',
            endTime: '06:30 PM',
            category: 'WELLNESS',
            estimatedCost: 2800,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Uluwatu Cliff Temple, Kecak Fire Dance & Jimbaran Seafood',
        summary: 'Dramatic 70-meter ocean cliff temples, hypnotic sunset fire dances, and candlelit beach dining.',
        activities: [
          {
            title: 'Padang Padang & Suluban Hidden Surf Beaches',
            description: 'Walk through limestone sea caves to pristine white sand beaches with world-class turquoise surf.',
            startTime: '10:00 AM',
            endTime: '02:00 PM',
            category: 'RELAXATION',
            estimatedCost: 800,
          },
          {
            title: 'Uluwatu Temple & Sunset Kecak Fire Dance',
            description: 'Perched on high cliffs over the Indian Ocean, watch 50 chanting performers reenact the Ramayana epic.',
            startTime: '04:30 PM',
            endTime: '07:00 PM',
            category: 'CULTURE',
            estimatedCost: 2200,
          },
          {
            title: 'Jimbaran Bay Candlelight Grilled Seafood Feast',
            description: 'Fresh grilled lobster, red snapper, and jumbo prawns served at tables right on the ocean sand.',
            startTime: '07:30 PM',
            endTime: '10:00 PM',
            category: 'FOOD',
            estimatedCost: 3500,
          },
        ],
      },
    ],
  },

  Bangkok: {
    durationDays: 3,
    estimatedBudgetINR: 32000,
    tagline: 'Glittering Wats, Chao Phraya Longtail Boats & Street Food',
    days: [
      {
        dayNumber: 1,
        title: 'Grand Palace, Wat Pho & Wat Arun',
        summary: 'Royal throne halls, the 46-meter Reclining Buddha, and the Temple of Dawn at sunset.',
        activities: [
          {
            title: 'Grand Palace & Temple of Emerald Buddha',
            description: 'Explore the golden spires, intricate mother-of-pearl throne halls, and the sacred jade Emerald Buddha.',
            startTime: '09:00 AM',
            endTime: '12:00 PM',
            category: 'CULTURE',
            estimatedCost: 2000,
          },
          {
            title: 'Wat Pho Reclining Buddha & Thai Massage School',
            description: 'View the massive gold-leaf Buddha and experience authentic traditional acupressure massage.',
            startTime: '12:30 PM',
            endTime: '03:00 PM',
            category: 'WELLNESS',
            estimatedCost: 1500,
          },
          {
            title: 'Wat Arun Cross-River Boat & Sunset Views',
            description: 'Cross the Chao Phraya by ferry to climb the porcelain mosaic prang towers of Wat Arun.',
            startTime: '04:30 PM',
            endTime: '07:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 800,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Damnoen Saduak Floating Market & Chinatown',
        summary: 'Paddle past floating fruit vendors and feast on Michelin-starred street food in Yaowarat.',
        activities: [
          {
            title: 'Damnoen Saduak Wooden Longtail Boat Market',
            description: 'Cruise narrow canals buying freshly sliced mango sticky rice, coconut pancakes, and noodle soup.',
            startTime: '07:30 AM',
            endTime: '12:30 PM',
            category: 'FOOD',
            estimatedCost: 3200,
          },
          {
            title: 'Yaowarat Chinatown Street Food Evening Crawl',
            description: 'Follow the neon signs for crispy pork belly, dim sum, toasted butter buns, and crab fried rice.',
            startTime: '06:00 PM',
            endTime: '09:30 PM',
            category: 'FOOD',
            estimatedCost: 2200,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Chatuchak Weekend Market & Sky Bar Rooftop',
        summary: 'Browse 15,000 artisan stalls and sip signature cocktails 64 floors above the Bangkok skyline.',
        activities: [
          {
            title: 'Chatuchak Market Silk & Handicrafts Hunting',
            description: 'Get lost in the world’s largest open-air market for handmade ceramics, vintage clothing, and teak wood.',
            startTime: '10:00 AM',
            endTime: '03:00 PM',
            category: 'SHOPPING',
            estimatedCost: 3000,
          },
          {
            title: 'Lebua State Tower Sky Bar Sunset Cocktails',
            description: 'Panoramic gold dome rooftop bar with 360-degree night views of the shimmering Chao Phraya river.',
            startTime: '05:30 PM',
            endTime: '08:30 PM',
            category: 'NIGHTLIFE',
            estimatedCost: 4500,
          },
        ],
      },
    ],
  },

  // AMERICAS
  'New York': {
    durationDays: 3,
    estimatedBudgetINR: 75000,
    tagline: 'Manhattan Skyline, Central Park & Broadway Lights',
    days: [
      {
        dayNumber: 1,
        title: 'Statue of Liberty, Wall Street & Brooklyn Bridge',
        summary: 'Sail past Lady Liberty, stroll the financial capital, and walk across the historic suspension bridge.',
        activities: [
          {
            title: 'Statue of Liberty & Ellis Island Ferry Cruise',
            description: 'Morning ferry to Liberty Island with pedestal access and audio tour through American immigration history.',
            startTime: '09:00 AM',
            endTime: '12:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 3200,
          },
          {
            title: 'Wall Street, 9/11 Memorial & Oculus',
            description: 'Visit the Charging Bull, NYSE facade, twin reflecting pools, and Santiago Calatrava’s Oculus.',
            startTime: '01:30 PM',
            endTime: '04:30 PM',
            category: 'CULTURE',
            estimatedCost: 2400,
          },
          {
            title: 'Brooklyn Bridge Sunset Walk & DUMBO Pizza',
            description: 'Walk across the wooden promenade into DUMBO for waterfront views and coal-fired Grimaldi’s pizza.',
            startTime: '05:30 PM',
            endTime: '09:00 PM',
            category: 'FOOD',
            estimatedCost: 3800,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Central Park, The Met & Times Square Broadway',
        summary: 'Row boats on the lake, admire 5,000 years of global art, and experience a blockbuster Broadway musical.',
        activities: [
          {
            title: 'Central Park Bike Tour & Bethesda Terrace',
            description: 'Cycle past Strawberry Fields, Bow Bridge, and the Mall elm canopy on a guided morning ride.',
            startTime: '09:00 AM',
            endTime: '11:30 AM',
            category: 'NATURE',
            estimatedCost: 2800,
          },
          {
            title: 'The Metropolitan Museum of Art (The Met)',
            description: 'Explore the Temple of Dendur, European Impressionist masters, and rooftop garden installations.',
            startTime: '12:30 PM',
            endTime: '04:00 PM',
            category: 'CULTURE',
            estimatedCost: 3200,
          },
          {
            title: 'Times Square Neon & Broadway Evening Show',
            description: 'Walk through the dazzling heart of theater district followed by orchestra seats for a Broadway musical.',
            startTime: '06:30 PM',
            endTime: '10:30 PM',
            category: 'ENTERTAINMENT',
            estimatedCost: 12000,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'The High Line, Chelsea Market & Summit One Vanderbilt',
        summary: 'Elevated railway gardens, gourmet food halls, and glass mirror skydecks.',
        activities: [
          {
            title: 'The High Line Elevated Park & Hudson Yards',
            description: 'Stroll the 1.45-mile repurposed railway garden above Chelsea streets to view the Vessel sculpture.',
            startTime: '09:30 AM',
            endTime: '11:30 AM',
            category: 'SIGHTSEEING',
            estimatedCost: 500,
          },
          {
            title: 'Chelsea Market Food Crawl & Lobster Rolls',
            description: 'Taste Maine lobster rolls, artisan tacos, and freshly pulled noodles in the historic Nabisco factory.',
            startTime: '12:00 PM',
            endTime: '02:30 PM',
            category: 'FOOD',
            estimatedCost: 3500,
          },
          {
            title: 'SUMMIT One Vanderbilt Mirrored Skydeck',
            description: 'Step into three floors of multi-sensory infinity mirror rooms and glass skyboxes above Grand Central.',
            startTime: '04:30 PM',
            endTime: '07:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 4500,
          },
        ],
      },
    ],
  },

  // AFRICA
  'Cape Town': {
    durationDays: 3,
    estimatedBudgetINR: 42000,
    tagline: 'Table Mountain, Cape Peninsula & Boulders Penguins',
    days: [
      {
        dayNumber: 1,
        title: 'Table Mountain Cableway & Kirstenbosch Gardens',
        summary: 'Ascend the rotating cable car to the flat-topped summit and walk the tree-canopy boomslang walkway.',
        activities: [
          {
            title: 'Table Mountain Rotating Cableway Summit',
            description: 'Ride the 360-degree rotating aerial cable car to the 1,086m mountain summit overlooking the Atlantic Ocean.',
            startTime: '09:00 AM',
            endTime: '12:30 PM',
            category: 'NATURE',
            estimatedCost: 2800,
          },
          {
            title: 'Kirstenbosch National Botanical Garden Walk',
            description: 'Stroll among UNESCO-protected Cape floral fynbos flora and cross the elevated Boomslang canopy bridge.',
            startTime: '02:00 PM',
            endTime: '05:00 PM',
            category: 'NATURE',
            estimatedCost: 1500,
          },
          {
            title: 'V&A Waterfront Sunset Dinner & Live Marimba',
            description: 'Waterfront dining overlooking Table Mountain with fresh grilled kingklip and African drum performances.',
            startTime: '06:30 PM',
            endTime: '09:30 PM',
            category: 'FOOD',
            estimatedCost: 3200,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Cape Point, Chapman’s Peak & Boulders Beach Penguins',
        summary: 'Scenic cliffside coastal drives and swimming alongside endangered African penguin colonies.',
        activities: [
          {
            title: 'Chapman’s Peak Scenic Coastal Marine Drive',
            description: 'One of the world’s most spectacular ocean drives carved into the cliffs between Hout Bay and Noordhoek.',
            startTime: '09:00 AM',
            endTime: '11:00 AM',
            category: 'SIGHTSEEING',
            estimatedCost: 1200,
          },
          {
            title: 'Boulders Beach African Penguin Colony',
            description: 'Walk wooden boardwalks to see thousands of wild African penguins nesting on granite boulder beaches.',
            startTime: '11:30 AM',
            endTime: '02:00 PM',
            category: 'NATURE',
            estimatedCost: 2200,
          },
          {
            title: 'Cape Point & Cape of Good Hope Funicular',
            description: 'Take the Flying Dutchman funicular to the old lighthouse where the Atlantic meets panoramic sea breezes.',
            startTime: '02:30 PM',
            endTime: '05:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 2500,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Bo-Kaap Heritage, Camps Bay & Lion’s Head Sunset',
        summary: 'Vibrant pastel houses, Cape Malay curry cooking, and golden sunset over Camps Bay beach.',
        activities: [
          {
            title: 'Bo-Kaap Colorful Houses & Spice Walk',
            description: 'Photowalk through the historic Muslim quarter with brightly painted Victorian facades and spice markets.',
            startTime: '09:30 AM',
            endTime: '12:00 PM',
            category: 'CULTURE',
            estimatedCost: 800,
          },
          {
            title: 'Camps Bay Beach & Tidal Pool Relaxation',
            description: 'Lounge on white sand beneath the Twelve Apostles mountain peaks and take a dip in ocean tidal pools.',
            startTime: '01:00 PM',
            endTime: '04:30 PM',
            category: 'RELAXATION',
            estimatedCost: 1500,
          },
          {
            title: 'Lion’s Head Sunset Aperitif & Views',
            description: 'Watch the sun drop into the Atlantic while city lights begin to twinkle across Cape Town bowl.',
            startTime: '05:30 PM',
            endTime: '08:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 2000,
          },
        ],
      },
    ],
  },

  // OCEANIA
  Sydney: {
    durationDays: 3,
    estimatedBudgetINR: 62000,
    tagline: 'Opera House Sails, Harbour Ferries & Bondi Coastal Walks',
    days: [
      {
        dayNumber: 1,
        title: 'Sydney Opera House, Harbour Bridge & The Rocks',
        summary: 'Tour the UNESCO architectural icon and wander Sydney’s oldest cobblestone convict quarter.',
        activities: [
          {
            title: 'Sydney Opera House Architectural Tour',
            description: 'Go behind the scenes inside the famous ceramic sail shells and world-class acoustic concert halls.',
            startTime: '09:30 AM',
            endTime: '11:30 AM',
            category: 'CULTURE',
            estimatedCost: 3500,
          },
          {
            title: 'The Rocks Historic Walking Tour & Pub Lunch',
            description: 'Learn about early convict settlements and enjoy craft Australian beers and meat pies in a 1840s pub.',
            startTime: '12:00 PM',
            endTime: '02:30 PM',
            category: 'FOOD',
            estimatedCost: 2400,
          },
          {
            title: 'Sydney Harbour Bridge Pylon Lookout & Sunset Ferry',
            description: 'Climb 200 stairs inside the South Pylon for harbour views, followed by a public ferry ride to Circular Quay.',
            startTime: '04:30 PM',
            endTime: '07:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 2000,
          },
        ],
      },
      {
        dayNumber: 2,
        title: 'Bondi to Coogee Coastal Walk & Icebergs Ocean Pool',
        summary: '6km cliffside ocean trail past pristine beaches, turquoise coves, and crashing Pacific surf.',
        activities: [
          {
            title: 'Bondi Beach & Icebergs Ocean Pool Swim',
            description: 'Swim in the world-famous saltwater ocean pool right next to breaking Pacific waves on south Bondi headland.',
            startTime: '08:30 AM',
            endTime: '11:30 AM',
            category: 'RELAXATION',
            estimatedCost: 1200,
          },
          {
            title: 'Bondi to Bronte & Coogee Coastal Trail',
            description: 'Scenic cliff path passing Tamarama beach, carved Aboriginal rock engravings, and scenic coastal lookouts.',
            startTime: '12:00 PM',
            endTime: '03:30 PM',
            category: 'NATURE',
            estimatedCost: 500,
          },
          {
            title: 'Coogee Pavilion Seafood & Craft Cocktails',
            description: 'Rooftop dining with fresh Sydney rock oysters, grilled barramundi, and sunset ocean breezes.',
            startTime: '05:30 PM',
            endTime: '08:30 PM',
            category: 'FOOD',
            estimatedCost: 4200,
          },
        ],
      },
      {
        dayNumber: 3,
        title: 'Manly Beach Ferry, Taronga Zoo & Darling Harbour',
        summary: 'Iconic yellow ferry across Sydney heads, native wildlife encounters, and illuminated waterfront dining.',
        activities: [
          {
            title: 'Taronga Zoo Wildlife & Sky Safari Gondola',
            description: 'Meet kangaroos, koalas, and giraffes framed by spectacular Sydney skyline harbour backdrops.',
            startTime: '09:00 AM',
            endTime: '01:00 PM',
            category: 'NATURE',
            estimatedCost: 3800,
          },
          {
            title: 'Manly Beach Corso & Fish and Chips',
            description: 'Ferry ride to Manly for pine tree lined surf beaches, seaside cafes, and crispy ocean fish and chips.',
            startTime: '01:30 PM',
            endTime: '05:00 PM',
            category: 'FOOD',
            estimatedCost: 2000,
          },
          {
            title: 'Darling Harbour Fireworks & Waterfront Dining',
            description: 'Evening promenade dining along Cockle Bay wharf with seasonal weekend fireworks displays.',
            startTime: '06:30 PM',
            endTime: '09:30 PM',
            category: 'NIGHTLIFE',
            estimatedCost: 4500,
          },
        ],
      },
    ],
  },
}

/**
 * Get or dynamically generate a high-quality curated multi-day itinerary for any city
 */
export function getCuratedItineraryForCity(city) {
  if (!city) return null

  const cityName = city.name || ''
  if (CITY_CURATED_ITINERARIES[cityName]) {
    return CITY_CURATED_ITINERARIES[cityName]
  }

  // Generic rich fallback itinerary (3 days) tailored to the city and region
  const country = city.country || 'Global Destination'
  const region = city.region || 'World'

  return {
    durationDays: 3,
    estimatedBudgetINR: 45000,
    tagline: `Essential Highlights & Cultural Journey of ${cityName}`,
    days: [
      {
        dayNumber: 1,
        title: `Day 1: Arrival & Historic Center of ${cityName}`,
        summary: `Discover the top architectural monuments, landmark plazas, and authentic local cuisine in ${country}.`,
        activities: [
          {
            title: `Historic Downtown & Landmark Tour of ${cityName}`,
            description: `Guided exploration of central plazas, iconic architectural facades, and historic heritage sites.`,
            startTime: '09:30 AM',
            endTime: '12:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 2500,
          },
          {
            title: `Traditional ${country} Lunch & Market Crawl`,
            description: `Sample regional specialties, fresh market produce, and beloved street food favorites.`,
            startTime: '01:00 PM',
            endTime: '03:00 PM',
            category: 'FOOD',
            estimatedCost: 2000,
          },
          {
            title: `Sunset River & City Viewpoint Walk`,
            description: `Scenic golden hour walk along the main riverfront or elevated lookout overlooking ${cityName}.`,
            startTime: '05:30 PM',
            endTime: '08:30 PM',
            category: 'SIGHTSEEING',
            estimatedCost: 1500,
          },
        ],
      },
      {
        dayNumber: 2,
        title: `Day 2: Art, Culture & Scenic Neighborhoods`,
        summary: `Immerse in premier museums, botanical parks, and vibrant arts districts.`,
        activities: [
          {
            title: `${cityName} National Museum & Art Gallery`,
            description: `Explore national treasures, historical artifacts, and curated art exhibitions.`,
            startTime: '10:00 AM',
            endTime: '01:00 PM',
            category: 'CULTURE',
            estimatedCost: 2200,
          },
          {
            title: `Botanical Gardens & Artisan Cafe Lunch`,
            description: `Relax amidst lush native flora followed by artisanal specialty coffee and regional pastries.`,
            startTime: '01:30 PM',
            endTime: '04:00 PM',
            category: 'FOOD',
            estimatedCost: 1800,
          },
          {
            title: `Evening Culinary Tour & Craft Beverage Tasting`,
            description: `Experience the evening restaurant quarter with a guided food and beverage tasting tour.`,
            startTime: '06:30 PM',
            endTime: '09:30 PM',
            category: 'NIGHTLIFE',
            estimatedCost: 3500,
          },
        ],
      },
      {
        dayNumber: 3,
        title: `Day 3: Nature Excursions & Souvenir Hunting`,
        summary: `Enjoy panoramic mountain or coastline vistas and collect memorable handcrafted keepsakes.`,
        activities: [
          {
            title: `Scenic Nature Excursion & Viewpoint Trail`,
            description: `Morning excursion to famous natural parks, coastal cliffs, or mountain trails near ${cityName}.`,
            startTime: '09:00 AM',
            endTime: '12:30 PM',
            category: 'NATURE',
            estimatedCost: 3000,
          },
          {
            title: `Artisanal Craft Bazaar & Souvenir Shopping`,
            description: `Browse authentic textiles, handmade ceramics, and locally roasted spices to take home.`,
            startTime: '02:00 PM',
            endTime: '05:00 PM',
            category: 'SHOPPING',
            estimatedCost: 2800,
          },
          {
            title: `Farewell Rooftop Dinner over ${cityName}`,
            description: `Celebrate the final evening with panoramic skyline views, fine dining, and local music.`,
            startTime: '07:00 PM',
            endTime: '10:00 PM',
            category: 'FOOD',
            estimatedCost: 4500,
          },
        ],
      },
    ],
  }
}
