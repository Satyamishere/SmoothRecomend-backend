// mockData/mockdata.js


export const flights = [
  { 
    airline: "IndiGo", 
    price: 8500, 
    stops: 0, 
    time: "10:00 AM",
    duration: "2h 15m"
  },
  { 
    airline: "Air India", 
    price: 12000, 
    stops: 0, 
    time: "06:00 PM",
    duration: "2h 30m"
  },
  { 
    airline: "SpiceJet", 
    price: 6500, 
    stops: 1, 
    time: "11:00 PM",
    duration: "4h 45m"
  },
  { 
    airline: "Vistara", 
    price: 10500, 
    stops: 0, 
    time: "07:30 AM",
    duration: "2h 20m"
  },
  { 
    airline: "Go First", 
    price: 7200, 
    stops: 1, 
    time: "03:00 PM",
    duration: "5h 10m"
  }
];

export const hotels = [
  { 
    name: "Beachside Hostel", 
    city: "goa",
    pricePerNight: 1200, 
    nearMetro: true, 
    rating: 4.2,
    amenities: ["WiFi", "Breakfast", "Pool"],
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Urban Stay Inn", 
    city: "mumbai",
    pricePerNight: 3500, 
    nearMetro: true, 
    rating: 4.5,
    amenities: ["WiFi", "Breakfast", "Gym", "Restaurant"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Luxury Palms Resort", 
    city: "goa",
    pricePerNight: 15000, 
    nearMetro: false, 
    rating: 5.0,
    amenities: ["WiFi", "Breakfast", "Pool", "Spa", "Beach Access"],
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Coastal Comfort Hotel", 
    city: "kerala",
    pricePerNight: 5500, 
    nearMetro: false, 
    rating: 4.3,
    amenities: ["WiFi", "Breakfast", "Pool"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Budget Traveler's Inn", 
    city: "delhi",
    pricePerNight: 1800, 
    nearMetro: true, 
    rating: 3.8,
    amenities: ["WiFi", "Basic Breakfast"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Heritage Bay Resort", 
    city: "jaipur",
    pricePerNight: 8500, 
    nearMetro: false, 
    rating: 4.7,
    amenities: ["WiFi", "Breakfast", "Pool", "Restaurant", "Cultural Tours"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Ladakh Mountain Retreat", 
    city: "ladakh",
    pricePerNight: 4200, 
    nearMetro: false, 
    rating: 4.8,
    amenities: ["WiFi", "Breakfast", "Heater", "Mountain View", "Bonfire"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Agra Taj View Hotel", 
    city: "agra",
    pricePerNight: 3800, 
    nearMetro: false, 
    rating: 4.6,
    amenities: ["WiFi", "Breakfast", "Restaurant", "Rooftop View"],
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Bangalore Tech Hub Stay", 
    city: "banglore",
    pricePerNight: 2900, 
    nearMetro: true, 
    rating: 4.1,
    amenities: ["WiFi", "Breakfast", "Gym", "Coworking Space"],
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Hyderabad Nizam Palace", 
    city: "hyderabad",
    pricePerNight: 4800, 
    nearMetro: true, 
    rating: 4.4,
    amenities: ["WiFi", "Breakfast", "Pool", "Restaurant", "Spa"],
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80" 
  }
];


export let activities = [
  // MUMBAI
  { 
    name: "Gateway of India & Colaba Tour", 
    location: "mumbai",
    tags: ["sightseeing", "culture", "history"], 
    moods: ["culture", "history"],
    price: 600,
    duration: "3 hours",
    description: "Iconic monument and heritage walk"
  },
  { 
    name: "Marine Drive Evening Walk", 
    location: "mumbai",
    tags: ["scenic", "relaxation", "nature"], 
    moods: ["relaxation", "peaceful"],
    price: 0,
    duration: "2 hours",
    description: "Mumbai's famous seaside promenade at sunset"
  },
  { 
    name: "Bollywood Studio Tour", 
    location: "mumbai",
    tags: ["culture", "entertainment", "learning"], 
    moods: ["entertainment"],
    price: 1200,
    duration: "4 hours",
    description: "Behind-the-scenes Bollywood film studio experience"
  },
  { 
    name: "Street Food Tour in Bandra", 
    location: "mumbai",
    tags: ["food", "culture", "adventure"], 
    price: 800,
    duration: "3 hours",
    description: "Authentic street food with local guide"
  },
  { 
    name: "Island Hopping Cruise", 
    location: "mumbai",
    tags: ["water", "adventure", "scenic"], 
    price: 1500,
    duration: "4 hours",
    description: "Visit nearby islands and forts"
  },

  // DELHI
  { 
    name: "Red Fort & Old Delhi Heritage Walk", 
    location: "delhi",
    tags: ["sightseeing", "culture", "history"], 
    price: 500,
    duration: "4 hours",
    description: "Mughal architecture and heritage lanes"
  },
  { 
    name: "Raj Ghat & Gandhi Memorial Tour", 
    location: "delhi",
    tags: ["sightseeing", "history", "culture"], 
    price: 0,
    duration: "2 hours",
    description: "Historical monuments and memorials"
  },
  { 
    name: "New Delhi Monument Cycle Tour", 
    location: "delhi",
    tags: ["adventure", "fitness", "sightseeing"], 
    price: 400,
    duration: "3 hours",
    description: "India Gate, Parliament, and central monuments"
  },
  { 
    name: "Chandni Chowk Shopping & Food Adventure", 
    location: "delhi",
    tags: ["shopping", "food", "culture"], 
    price: 600,
    duration: "3 hours",
    description: "Historic bazaar and street delicacies"
  },
  { 
    name: "Sufi Music & Poetry Evening", 
    location: "delhi",
    tags: ["culture", "entertainment", "relaxation"], 
    price: 800,
    duration: "2.5 hours",
    description: "Traditional Sufi performances and qawwali"
  },

  // GOA
  { 
    name: "Scuba Diving Expedition", 
    location: "goa",
    tags: ["adventure", "water", "sports"], 
    moods: ["adventure"],
    price: 3500,
    duration: "4 hours",
    description: "Explore underwater marine life and coral"
  },
  { 
    name: "Dudhsagar Waterfall Trek", 
    location: "goa",
    tags: ["adventure", "nature", "hiking"], 
    moods: ["adventure", "nature"],
    price: 1800,
    duration: "Full day",
    description: "Trek through jungle to India's tallest waterfall"
  },
  { 
    name: "Spice Plantation Tour", 
    location: "goa",
    tags: ["nature", "culture", "food"], 
    moods: ["relaxation", "culture"],
    price: 900,
    duration: "4 hours",
    description: "Learn about local spices and enjoy traditional lunch"
  },
  { 
    name: "Beach Parasailing & Water Sports", 
    location: "goa",
    tags: ["adventure", "water", "sports"], 
    moods: ["celebration", "adventure"],
    price: 2500,
    duration: "2 hours",
    description: "Parasailing, jet ski, and banana boat rides"
  },
  { 
    name: "Old Goa Heritage Walk", 
    location: "goa",
    tags: ["culture", "history", "sightseeing"], 
    moods: ["culture", "history"],
    price: 500,
    duration: "3 hours",
    description: "Ancient churches, convents, and monuments"
  },
  { 
    name: "Sunset Catamaran Cruise with Dinner", 
    location: "goa",
    tags: ["romantic", "water", "food"], 
    moods: ["celebration", "romantic"],
    price: 2000,
    duration: "3 hours",
    description: "Evening boat ride with dinner and music"
  },

  // JAIPUR
  { 
    name: "City Palace & Jantar Mantar Tour", 
    location: "jaipur",
    tags: ["sightseeing", "culture", "history"], 
    moods: ["culture", "history"],
    price: 700,
    duration: "3 hours",
    description: "Royal palaces and astronomical monuments"
  },
  { 
    name: "Hawa Mahal (Palace of Winds) Visit", 
    location: "jaipur",
    tags: ["sightseeing", "photography", "culture"], 
    moods: ["culture", "history"],
    price: 200,
    duration: "1.5 hours",
    description: "Iconic pink structure with street photography"
  },
  { 
    name: "Albert Hall Museum & Bazaar Walk", 
    location: "jaipur",
    tags: ["culture", "shopping", "learning"], 
    moods: ["culture"],
    price: 600,
    duration: "3 hours",
    description: "Museum visit and local markets"
  },
  { 
    name: "Desert Jeep Safari & Camping", 
    location: "jaipur",
    tags: ["adventure", "nature", "camping"], 
    moods: ["adventure", "nature"],
    price: 3000,
    duration: "Full day",
    description: "Jeep safari in Thar Desert with sunset camp"
  },
  { 
    name: "Cooking Class - Rajasthani Cuisine", 
    location: "jaipur",
    tags: ["food", "culture", "learning"], 
    moods: ["culture"],
    price: 1200,
    duration: "3 hours",
    description: "Traditional Rajasthani cooking workshop"
  },

  // BANGALORE
  { 
    name: "Tech Campus Tour & Innovation Hub", 
    location: "banglore",
    tags: ["technology", "learning", "sightseeing"], 
    price: 500,
    duration: "2.5 hours",
    description: "Silicon Valley of India tour"
  },
  { 
    name: "Cubbon Park Nature Walk", 
    location: "banglore",
    tags: ["nature", "fitness", "relaxation"], 
    price: 0,
    duration: "2 hours",
    description: "Urban forest with diverse flora and fauna"
  },
  { 
    name: "Bangalore Fort & Vidhana Soudha Heritage Tour", 
    location: "banglore",
    tags: ["sightseeing", "history", "culture"], 
    price: 400,
    duration: "2.5 hours",
    description: "Historical monuments and architecture"
  },
  { 
    name: "Coffee Plantation Visit Near Bangalore", 
    location: "banglore",
    tags: ["nature", "food", "learning"], 
    price: 1000,
    duration: "4 hours",
    description: "Coffee estates and tasting experience"
  },
  { 
    name: "Nightlife & Craft Beer Tour", 
    location: "banglore",
    tags: ["food", "entertainment", "culture"], 
    price: 1500,
    duration: "3 hours",
    description: "Breweries and local craft beer experience"
  },

  // HYDERABAD
  { 
    name: "Charminar & Old City Heritage Walk", 
    location: "hyderabad",
    tags: ["sightseeing", "history", "culture"], 
    price: 600,
    duration: "3 hours",
    description: "400-year-old monument and historic lanes"
  },
  { 
    name: "Biryani Cooking Class", 
    location: "hyderabad",
    tags: ["food", "culture", "learning"], 
    price: 800,
    duration: "3 hours",
    description: "Learn to cook authentic Hyderabadi biryani"
  },
  { 
    name: "Chowmahalla Palace & Salar Jung Museum", 
    location: "hyderabad",
    tags: ["culture", "history", "learning"], 
    price: 700,
    duration: "3 hours",
    description: "Royal palace and art museum"
  },
  { 
    name: "Hussain Sagar Lake Sunset Boat Ride", 
    location: "hyderabad",
    tags: ["water", "scenic", "relaxation"], 
    price: 400,
    duration: "1.5 hours",
    description: "Lake cruise with city skyline views"
  },

  // KERALA
  { 
    name: "Backwater Houseboat Experience", 
    location: "kerala",
    tags: ["water", "scenic", "relaxation"], 
    price: 4000,
    duration: "Full day",
    description: "Traditional houseboat journey through backwaters"
  },
  { 
    name: "Coconut Plantation & Spice Tour", 
    location: "kerala",
    tags: ["nature", "culture", "food"], 
    price: 900,
    duration: "4 hours",
    description: "Spice gardens and plantation life"
  },
  { 
    name: "Kathakali Dance Performance & Makeup", 
    location: "kerala",
    tags: ["culture", "entertainment", "learning"], 
    price: 1200,
    duration: "3 hours",
    description: "Traditional Kerala dance form and costumes"
  },
  { 
    name: "Beach Yoga & Ayurveda Wellness", 
    location: "kerala",
    tags: ["wellness", "fitness", "relaxation"], 
    price: 1500,
    duration: "3 hours",
    description: "Yoga and Ayurvedic massage by the beach"
  },

  // LADAKH
  { 
    name: "Leh Palace & Shanti Stupa Trek", 
    location: "ladakh",
    tags: ["sightseeing", "hiking", "culture"], 
    price: 600,
    duration: "3 hours",
    description: "Ancient palace and Buddhist monument with views"
  },
  { 
    name: "Pangong Tso Lake High-Altitude Adventure", 
    location: "ladakh",
    tags: ["adventure", "nature", "scenic"], 
    price: 2500,
    duration: "Full day",
    description: "World's highest saltwater lake drive"
  },
  { 
    name: "Monastery Tour & Buddhist Culture", 
    location: "ladakh",
    tags: ["culture", "spirituality", "learning"], 
    price: 700,
    duration: "4 hours",
    description: "Visit ancient monasteries and meet monks"
  },
  { 
    name: "Mountain Biking Expedition", 
    location: "ladakh",
    tags: ["adventure", "fitness", "nature"], 
    price: 1800,
    duration: "Full day",
    description: "High-altitude mountain biking experience"
  },

  // AGRA
  { 
    name: "Taj Mahal Sunrise & Guided Tour", 
    location: "agra",
    tags: ["sightseeing", "photography", "culture"], 
    price: 1200,
    duration: "4 hours",
    description: "Experience the monument of love at sunrise"
  },
  { 
    name: "Agra Fort Heritage Tour", 
    location: "agra",
    tags: ["history", "sightseeing", "culture"], 
    price: 500,
    duration: "2.5 hours",
    description: "Mughal emperor's fortress and palaces"
  },
  { 
    name: "Taj Mahal Sunset & Evening Tour", 
    location: "agra",
    tags: ["romantic", "photography", "culture"], 
    price: 1000,
    duration: "3 hours",
    description: "Taj Mahal illuminated in soft evening light"
  }
];




// Destination metadata for future scaling
export const destinations = {
  "Mumbai": {
    bestMonths: ["October", "November", "December", "January", "February"],
    weather: "Tropical",
    timezone: "IST",
    currency: "INR"
  },
  "Delhi": {
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    weather: "Temperate",
    timezone: "IST",
    currency: "INR"
  },
  "Goa": {
    bestMonths: ["November", "December", "January", "February"],
    weather: "Tropical",
    timezone: "IST",
    currency: "INR"
  },
  "Jaipur": {
    bestMonths: ["October", "November", "December", "February", "March"],
    weather: "Semi-arid",
    timezone: "IST",
    currency: "INR"
  },
  "Banglore": {
    bestMonths: ["September", "October", "November", "December", "January"],
    weather: "Moderate",
    timezone: "IST",
    currency: "INR"
  },
  "Hyderabad": {
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    weather: "Semi-arid",
    timezone: "IST",
    currency: "INR"
  },
  "Kerala": {
    bestMonths: ["September", "October", "November", "December", "January"],
    weather: "Tropical",
    timezone: "IST",
    currency: "INR"
  },
  "Ladakh": {
    bestMonths: ["June", "July", "August", "September"],
    weather: "Alpine",
    timezone: "IST",
    currency: "INR"
  },
  "Agra": {
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    weather: "Temperate",
    timezone: "IST",
    currency: "INR"
  }
};