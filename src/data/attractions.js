export const ATTRACTIONS_DB = {
  'Chennai': [
    { name: 'Marina Beach', type: 'nature', rating: 4.2, cost: 0, desc: 'Second longest beach in the world' },
    { name: 'Kapaleeswarar Temple', type: 'culture', rating: 4.8, cost: 0, desc: 'Ancient Hindu temple' },
    { name: 'Fort St. George', type: 'culture', rating: 4.5, cost: 100, desc: 'Historic British fort' },
    { name: 'Government Museum', type: 'culture', rating: 4.6, cost: 80, desc: 'Museum of history and art' },
    { name: 'Guindy National Park', type: 'nature', rating: 4.3, cost: 100, desc: 'Wildlife sanctuary in the city' },
  ],
  'Villupuram': [
    { name: 'Tirupati Temple', type: 'culture', rating: 4.9, cost: 0, desc: 'Pilgrimage site with mountain views' },
    { name: 'Kanakavalli Waterfall', type: 'nature', rating: 4.4, cost: 0, desc: 'Scenic waterfall during monsoon' },
  ],
  'Trichy': [
    { name: 'Rockfort Temple', type: 'culture', rating: 4.7, cost: 50, desc: 'Ancient temple on a rock formation' },
    { name: 'Meenakshi Temple', type: 'culture', rating: 4.8, cost: 0, desc: 'Grand Hindu temple complex' },
    { name: 'Sri Ranganathaswamy Temple', type: 'culture', rating: 4.7, cost: 0, desc: 'One of the largest temples in India' },
  ],
  'Madurai': [
    { name: 'Meenakshi Amman Temple', type: 'culture', rating: 4.9, cost: 0, desc: 'Ancient temple with 14 gopurams' },
    { name: 'Thirumalai Nayakkar Palace', type: 'culture', rating: 4.6, cost: 80, desc: 'Grand 17th century palace' },
    { name: 'Azhagar Kovil', type: 'culture', rating: 4.5, cost: 0, desc: 'Sacred temple in hills' },
    { name: 'Vaigai River Park', type: 'nature', rating: 4.2, cost: 0, desc: 'Scenic riverside park' },
  ],
};

export const RESTAURANTS_DB = {
  'Chennai': [
    { name: 'Saravana Bhavan', cuisine: 'South Indian', style: 'budget', rating: 4.6, cost: 250, area: 'T. Nagar', desc: 'Famous for authentic South Indian meals. Hygienic and affordable. Try their dosa and sambar.' },
    { name: 'Rajdhani', cuisine: 'North Indian', style: 'comfort', rating: 4.4, cost: 450, area: 'Nungambakkam', desc: 'Premium North Indian buffet with unlimited curries. Great for lunch. Excellent service.' },
    { name: 'The Raintree', cuisine: 'Continental', style: 'luxury', rating: 4.8, cost: 900, area: 'Nageswara Rao Park', desc: 'Award-winning fine dining. Perfect for dinner. Reservations recommended. Wine collection available.' },
    { name: 'Copper Chimney', cuisine: 'North Indian', style: 'comfort', rating: 4.5, cost: 500, area: 'Egmore', desc: 'Casual dining with great ambiance. Popular for biryanis. Budget-friendly fine dine.' },
    { name: 'Pho By An Nam', cuisine: 'Vietnamese', style: 'comfort', rating: 4.3, cost: 400, area: 'Nungambakkam', desc: 'Authentic Vietnamese cuisine. Fresh ingredients. Great for lunch.' },
  ],
  'Villupuram': [
    { name: 'Highway Kitchen', cuisine: 'South Indian', style: 'budget', rating: 4.2, cost: 180, area: 'Main Road', desc: 'Quick service highway restaurant. Good for breakfast & lunch. Fresh idli & vada.' },
    { name: 'Andhra Curry House', cuisine: 'Andhra', style: 'budget', rating: 4.4, cost: 220, area: 'Bus Stand', desc: 'Authentic Andhra cuisine. Spicy curries. Great value for money.' },
    { name: 'Tamil Saravana', cuisine: 'South Indian', style: 'budget', rating: 4.3, cost: 200, area: 'Town', desc: 'Traditional Tamil food. Family-friendly. Good for large groups.' },
  ],
  'Trichy': [
    { name: 'Sree Saravana Bhavan', cuisine: 'South Indian', style: 'budget', rating: 4.5, cost: 200, area: 'Cantonment', desc: 'Popular chain restaurant. Quick service. Perfect for breakfast & lunch.' },
    { name: 'Hotel Pankaj', cuisine: 'North Indian', style: 'comfort', rating: 4.3, cost: 400, area: 'Chintamani Nagar', desc: 'Multi-cuisine restaurant. Good ambiance. Family dining preferred.' },
    { name: 'Sri Krishan Hotel', cuisine: 'South Indian', style: 'budget', rating: 4.4, cost: 190, area: 'Teppakulam', desc: 'Budget-friendly. Great for authentic Trichy meals.' },
  ],
  'Madurai': [
    { name: 'Mutt Mess', cuisine: 'South Indian', style: 'budget', rating: 4.4, cost: 150, area: 'Town Hall', desc: 'Legendary mess restaurant. Famous for their tiffin & lunch. Super affordable.' },
    { name: 'Aavin Milk Bar', cuisine: 'Cafe', style: 'budget', rating: 4.2, cost: 120, area: 'City Center', desc: 'Iconic cafe. Great for breakfast with filter coffee & snacks.' },
    { name: 'Hotel Supreme', cuisine: 'North Indian', style: 'comfort', rating: 4.3, cost: 450, area: 'West Mada Street', desc: 'Spacious dining hall. Multi-cuisine options. Good for celebrations.' },
  ],
};

export const STAYS_DB = {
  'Chennai': [
    { name: 'Budget Inn Chennai', style: 'budget', rating: 3.8, cost: 2500, desc: 'Clean rooms with WiFi. Hot water 24/7. Good for budget travelers. Central location.', amenities: 'WiFi, Hot Water, TV, AC' },
    { name: 'Hotel Southern Star', style: 'comfort', rating: 4.4, cost: 5500, desc: 'Business hotel with excellent service. Restaurant on-site. Good for families. Near airport.', amenities: 'WiFi, Restaurant, AC, Parking' },
    { name: 'Taj Coromandel', style: 'luxury', rating: 4.8, cost: 12000, desc: 'Five-star beachfront resort with spa. World-class amenities. Best location. Michelin restaurants.', amenities: 'Spa, Restaurant, Beach Access, Room Service' },
    { name: 'The Leela Palace', style: 'luxury', rating: 4.9, cost: 13500, desc: 'Ultra-luxury palace hotel. Premium service. Swimming pool. Best dining options.', amenities: 'Pool, Spa, Multiple Restaurants, Concierge' },
  ],
  'Villupuram': [
    { name: 'Tourist Inn', style: 'budget', rating: 3.6, cost: 1500, desc: 'Simple budget lodging. Clean rooms. Good for transit. No frills but comfortable.' },
    { name: 'Hotel Residency', style: 'comfort', rating: 4.0, cost: 3500, desc: 'Mid-range hotel with restaurant. Good service. AC rooms. Peaceful ambiance.' },
    { name: 'Villupuram Rest House', style: 'budget', rating: 3.7, cost: 1800, desc: 'Government run rest house. Very affordable. Basic amenities. Quiet location.' },
  ],
  'Trichy': [
    { name: 'Trichy Lodge', style: 'budget', rating: 3.7, cost: 1800, desc: 'Economy rooms with basic amenities. Budget travelers preferred. Central location.' },
    { name: 'Sangam Hotel', style: 'comfort', rating: 4.3, cost: 4500, desc: 'Well-equipped rooms with restaurant. Good customer service. River view available.' },
    { name: 'ITC Hotel Trichy', style: 'luxury', rating: 4.7, cost: 10000, desc: 'Premium luxury hotel. Multi-cuisine restaurant. Conference facilities. Best in Trichy.' },
    { name: 'Femina Hotel', style: 'comfort', rating: 4.2, cost: 4200, desc: 'Popular hotel with good ambiance. Multi-cuisine restaurant. Family rooms available.' },
  ],
  'Madurai': [
    { name: 'Town Lodge', style: 'budget', rating: 3.5, cost: 1200, desc: 'Very budget accommodation. Basic rooms. 24-hour check-in available. Good for backpackers.' },
    { name: 'Hotel Pandyan', style: 'comfort', rating: 4.2, cost: 4000, desc: 'Classic comfort hotel. Good service. Restaurant on-site. Near temple.' },
    { name: 'Grand Madurai', style: 'luxury', rating: 4.6, cost: 9500, desc: 'Premium experience. Spa facilities. Multi-cuisine dining. Best views in city.' },
    { name: 'Madurai Residency', style: 'comfort', rating: 4.1, cost: 4300, desc: 'Comfortable stay with excellent staff. Complimentary breakfast. Central location.' },
  ],
};
