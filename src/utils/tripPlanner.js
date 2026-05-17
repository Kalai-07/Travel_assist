import { ATTRACTIONS_DB, RESTAURANTS_DB, STAYS_DB } from '../data/attractions';

const FUEL_MILEAGE = {
  petrol: { city: 12, highway: 16, mixed: 14 },
  diesel: { city: 16, highway: 20, mixed: 18 },
  ev: { consumption: 5 },
};

const FUEL_PRICES = {
  petrol: 100,
  diesel: 95,
  ev: 15,
};

export const calculateFuelConsumption = (distance, fuelType) => {
  let mileage = FUEL_MILEAGE[fuelType]?.mixed || 14;
  let pricePerUnit = FUEL_PRICES[fuelType] || 100;

  if (fuelType === 'ev') {
    const kwhNeeded = distance / mileage;
    const cost = kwhNeeded * pricePerUnit;
    return { quantity: kwhNeeded.toFixed(1), unit: 'kWh', cost: Math.round(cost) };
  } else {
    const litersNeeded = distance / mileage;
    const cost = litersNeeded * pricePerUnit;
    return { quantity: litersNeeded.toFixed(1), unit: 'L', cost: Math.round(cost) };
  }
};

export const getAttractionsForLocation = (location, interests) => {
  const attractions = ATTRACTIONS_DB[location] || [];
  if (!interests || interests.length === 0) return attractions;

  const interestMap = {
    'Culture': 'culture',
    'Food & Dining': 'food',
    'Adventure': 'adventure',
    'Shopping': 'shopping',
    'Nature': 'nature',
    'Relaxation': 'relaxation',
  };

  return attractions.filter(a => {
    const matchInterest = interests.some(i => interestMap[i] === a.type);
    return matchInterest || interests.length === 0;
  });
};

export const getRestaurantsForLocation = (location, style, budget) => {
  const restaurants = RESTAURANTS_DB[location] || [];

  let filtered = restaurants.filter(r => {
    const styleMatch = r.style === style.toLowerCase() ||
                      (style.toLowerCase() === 'comfort' && r.style !== 'luxury') ||
                      (style.toLowerCase() === 'luxury' && (r.style === 'luxury' || r.style === 'comfort'));
    const budgetMatch = r.cost <= budget;
    return styleMatch && budgetMatch;
  });

  if (filtered.length === 0) {
    filtered = restaurants.filter(r => r.cost <= budget);
  }

  return filtered.sort((a, b) => b.rating - a.rating).slice(0, 3);
};

export const getStaysForLocation = (location, style, budget) => {
  const stays = STAYS_DB[location] || [];

  let filtered = stays.filter(s => {
    const styleMatch = s.style === style.toLowerCase() ||
                      (style.toLowerCase() === 'comfort' && s.style !== 'luxury') ||
                      (style.toLowerCase() === 'luxury' && (s.style === 'luxury' || s.style === 'comfort'));
    const budgetMatch = s.cost <= budget;
    return styleMatch && budgetMatch;
  });

  if (filtered.length === 0) {
    filtered = stays.filter(s => s.cost <= budget);
  }

  return filtered.sort((a, b) => b.rating - a.rating).slice(0, 3);
};

export const generateDayByDayPlan = (from, to, days, interests, totalBudget, style, fuelType = 'petrol') => {
  const DISTANCE = 463;
  const dailyDistance = Math.round(DISTANCE / days);
  const budgetPerDay = Math.round(totalBudget / days);

  const locations = [from, 'Villupuram', 'Trichy', to];
  const itinerary = [];

  let cumulativeDistance = 0;

  for (let d = 1; d <= days; d++) {
    const currentLocation = d === 1 ? from : d === days ? to : locations[d % locations.length];
    const distanceToday = d === days ? DISTANCE - cumulativeDistance : dailyDistance;
    cumulativeDistance += distanceToday;

    const fuelData = calculateFuelConsumption(distanceToday, fuelType);

    const attractions = getAttractionsForLocation(currentLocation, interests);
    const restaurants = getRestaurantsForLocation(currentLocation, style, budgetPerDay * 0.3);
    const stays = getStaysForLocation(currentLocation, style, budgetPerDay * 0.4);

    const mealsForDay = [
      { type: 'breakfast', cost: 300 },
      { type: 'lunch', cost: 600 },
      { type: 'dinner', cost: 500 },
    ];
    const mealsCost = mealsForDay.reduce((sum, m) => sum + m.cost, 0);

    const stayCost = stays.length > 0 ? stays[0].cost : 2500;
    const attractionsCost = attractions.slice(0, 2).reduce((sum, a) => sum + a.cost, 0);

    const dailyTotal = mealsCost + stayCost + attractionsCost + fuelData.cost;

    itinerary.push({
      day: d,
      location: currentLocation,
      distance: distanceToday,
      fuelCost: fuelData.cost,
      fuelQuantity: fuelData.quantity,
      fuelUnit: fuelData.unit,
      meals: mealsForDay,
      mealsCost,
      attractions: attractions.slice(0, 3),
      attractionsCost,
      stay: stays[0] || { name: 'Hotel', cost: 2500, rating: 4.0 },
      stayCost,
      dailyTotal,
      weatherAlert: Math.random() > 0.7 ? { type: 'rain', suggestion: 'Visit museum or indoor attraction instead' } : null,
    });
  }

  return {
    itinerary,
    totalCost: itinerary.reduce((sum, d) => sum + d.dailyTotal, 0),
    totalDistance: DISTANCE,
    totalFuel: itinerary.reduce((sum, d) => sum + parseFloat(d.fuelQuantity), 0),
  };
};

export const formatCurrency = (num) => {
  return `₹ ${num.toLocaleString('en-IN')}`;
};

export const formatDistance = (km) => {
  return `${km} km`;
};
