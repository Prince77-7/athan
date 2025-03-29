// Data structure for city information
export interface City {
  city: string;
  lat: number;
  lng: number;
  country: string;
  population: number;
}

// Global cache for loaded cities
let citiesCache: City[] = [];

// Load fallback cities data
export async function loadCities(): Promise<City[]> {
  // If we already have cities in cache, return them
  if (citiesCache.length > 0) {
    return citiesCache;
  }
  
  console.log('Loading fallback cities data');
  const fallbackCities = getFallbackCities();
  citiesCache = fallbackCities;
  return fallbackCities;
}

// Search cities by name and/or country (used as fallback)
export function searchCities(query: string, cities: City[], limit = 5): City[] {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase();
  
  // Filter cities that match the query - with null checks for country
  const matches = cities.filter(city => 
    (city.city && city.city.toLowerCase().includes(normalizedQuery)) || 
    (city.country && city.country.toLowerCase().includes(normalizedQuery))
  );
  
  // Sort by population (largest first)
  matches.sort((a, b) => (b.population || 0) - (a.population || 0));
  
  // Return top matches
  return matches.slice(0, limit);
}

// Get user's location using browser geolocation
export function getUserLocation(): Promise<{lat: number, lng: number}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    // Try to get user's location with increased timeout
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success case
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log("Successfully retrieved coordinates:", coords);
        resolve(coords);
      },
      (error) => {
        // Error case - provide more helpful messages
        let errorMessage = 'Unknown error acquiring position';
        
        switch(error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location permission denied by user';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location information is unavailable';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out';
            break;
        }
        
        console.error(`Geolocation error (${error.code}): ${errorMessage}`);
        reject({...error, customMessage: errorMessage});
      },
      {
        enableHighAccuracy: false, // Try with standard accuracy first
        timeout: 10000,           // Increased timeout to 10 seconds
        maximumAge: 60000         // Allow cached positions up to 1 minute old
      }
    );
  });
}

// Find nearest city to coordinates (used as fallback)
export function findNearestCity(lat: number, lng: number, cities: City[]): City | null {
  if (cities.length === 0) return null;
  
  let nearestCity: City | null = null;
  let smallestDistance = Number.MAX_VALUE;
  
  cities.forEach(city => {
    // Simple distance calculation (not taking into account Earth's curvature)
    const distance = Math.sqrt(
      Math.pow(city.lat - lat, 2) + 
      Math.pow(city.lng - lng, 2)
    );
    
    if (distance < smallestDistance) {
      smallestDistance = distance;
      nearestCity = city;
    }
  });
  
  return nearestCity;
}

// Fallback cities list with major world cities
function getFallbackCities(): City[] {
  // Return a list of major world cities
  return [
    // United States
    { city: "New York", lat: 40.7128, lng: -74.0060, country: "United States", population: 8804190 },
    { city: "Los Angeles", lat: 34.0522, lng: -118.2437, country: "United States", population: 3990456 },
    { city: "Chicago", lat: 41.8781, lng: -87.6298, country: "United States", population: 2705994 },
    { city: "Houston", lat: 29.7604, lng: -95.3698, country: "United States", population: 2320268 },
    { city: "Phoenix", lat: 33.4484, lng: -112.0740, country: "United States", population: 1680992 },
    { city: "Philadelphia", lat: 39.9526, lng: -75.1652, country: "United States", population: 1584064 },
    { city: "San Antonio", lat: 29.4241, lng: -98.4936, country: "United States", population: 1547253 },
    { city: "San Diego", lat: 32.7157, lng: -117.1611, country: "United States", population: 1423851 },
    { city: "Dallas", lat: 32.7767, lng: -96.7970, country: "United States", population: 1343573 },
    { city: "San Jose", lat: 37.3382, lng: -121.8863, country: "United States", population: 1030119 },
    { city: "Austin", lat: 30.2672, lng: -97.7431, country: "United States", population: 978908 },
    { city: "Jacksonville", lat: 30.3322, lng: -81.6557, country: "United States", population: 911507 },
    { city: "Fort Worth", lat: 32.7555, lng: -97.3308, country: "United States", population: 909585 },
    { city: "Columbus", lat: 39.9612, lng: -82.9988, country: "United States", population: 905748 },
    { city: "San Francisco", lat: 37.7749, lng: -122.4194, country: "United States", population: 883305 },
    { city: "Charlotte", lat: 35.2271, lng: -80.8431, country: "United States", population: 874579 },
    { city: "Indianapolis", lat: 39.7684, lng: -86.1581, country: "United States", population: 876384 },
    { city: "Seattle", lat: 47.6062, lng: -122.3321, country: "United States", population: 737015 },
    { city: "Denver", lat: 39.7392, lng: -104.9903, country: "United States", population: 716492 },
    { city: "Washington", lat: 38.9072, lng: -77.0369, country: "United States", population: 702455 },
    { city: "Boston", lat: 42.3601, lng: -71.0589, country: "United States", population: 694583 },
    { city: "El Paso", lat: 31.7619, lng: -106.4850, country: "United States", population: 682669 },
    { city: "Detroit", lat: 42.3314, lng: -83.0458, country: "United States", population: 677116 },
    { city: "Nashville", lat: 36.1627, lng: -86.7816, country: "United States", population: 670820 },
    { city: "Portland", lat: 45.5152, lng: -122.6784, country: "United States", population: 653115 },
    { city: "Memphis", lat: 35.1495, lng: -90.0490, country: "United States", population: 651073 },
    { city: "Oklahoma City", lat: 35.4676, lng: -97.5164, country: "United States", population: 649021 },
    { city: "Las Vegas", lat: 36.1699, lng: -115.1398, country: "United States", population: 644644 },
    { city: "Louisville", lat: 38.2527, lng: -85.7585, country: "United States", population: 633045 },
    { city: "Baltimore", lat: 39.2904, lng: -76.6122, country: "United States", population: 593490 },
    { city: "Milwaukee", lat: 43.0389, lng: -87.9065, country: "United States", population: 577222 },
    { city: "Albuquerque", lat: 35.0844, lng: -106.6504, country: "United States", population: 564559 },
    { city: "Tucson", lat: 32.2226, lng: -110.9747, country: "United States", population: 546495 },
    { city: "Fresno", lat: 36.7378, lng: -119.7871, country: "United States", population: 542107 },
    { city: "Sacramento", lat: 38.5816, lng: -121.4944, country: "United States", population: 524943 },
    { city: "Atlanta", lat: 33.7490, lng: -84.3880, country: "United States", population: 524050 },
    
    // Canada
    { city: "Toronto", lat: 43.6532, lng: -79.3832, country: "Canada", population: 2930000 },
    { city: "Montreal", lat: 45.5017, lng: -73.5673, country: "Canada", population: 1780000 },
    { city: "Vancouver", lat: 49.2827, lng: -123.1207, country: "Canada", population: 675218 },
    { city: "Calgary", lat: 51.0447, lng: -114.0719, country: "Canada", population: 1336000 },
    { city: "Edmonton", lat: 53.5461, lng: -113.4938, country: "Canada", population: 981280 },
    { city: "Ottawa", lat: 45.4215, lng: -75.6972, country: "Canada", population: 994837 },
    
    // Europe
    { city: "London", lat: 51.5074, lng: -0.1278, country: "United Kingdom", population: 8982000 },
    { city: "Paris", lat: 48.8566, lng: 2.3522, country: "France", population: 2148271 },
    { city: "Berlin", lat: 52.5200, lng: 13.4050, country: "Germany", population: 3669491 },
    { city: "Madrid", lat: 40.4168, lng: -3.7038, country: "Spain", population: 3223334 },
    { city: "Rome", lat: 41.9028, lng: 12.4964, country: "Italy", population: 2872800 },
    { city: "Amsterdam", lat: 52.3676, lng: 4.9041, country: "Netherlands", population: 872680 },
    { city: "Barcelona", lat: 41.3851, lng: 2.1734, country: "Spain", population: 1620343 },
    { city: "Munich", lat: 48.1351, lng: 11.5820, country: "Germany", population: 1471508 },
    { city: "Milan", lat: 45.4642, lng: 9.1900, country: "Italy", population: 1396059 },
    { city: "Prague", lat: 50.0755, lng: 14.4378, country: "Czech Republic", population: 1309000 },
    { city: "Warsaw", lat: 52.2297, lng: 21.0122, country: "Poland", population: 1765000 },
    { city: "Vienna", lat: 48.2082, lng: 16.3738, country: "Austria", population: 1897491 },
    { city: "Dublin", lat: 53.3498, lng: -6.2603, country: "Ireland", population: 544107 },
    { city: "Brussels", lat: 50.8503, lng: 4.3517, country: "Belgium", population: 1208542 },
    { city: "Budapest", lat: 47.4979, lng: 19.0402, country: "Hungary", population: 1752286 },
    { city: "Copenhagen", lat: 55.6761, lng: 12.5683, country: "Denmark", population: 602481 },
    { city: "Athens", lat: 37.9838, lng: 23.7275, country: "Greece", population: 664046 },
    { city: "Stockholm", lat: 59.3293, lng: 18.0686, country: "Sweden", population: 975904 },
    { city: "Lisbon", lat: 38.7223, lng: -9.1393, country: "Portugal", population: 505526 },
    { city: "Oslo", lat: 59.9139, lng: 10.7522, country: "Norway", population: 698660 },
    { city: "Helsinki", lat: 60.1699, lng: 24.9384, country: "Finland", population: 655235 },
    { city: "Zurich", lat: 47.3769, lng: 8.5417, country: "Switzerland", population: 402762 },
    { city: "Istanbul", lat: 41.0082, lng: 28.9784, country: "Turkey", population: 15460000 },
    { city: "Moscow", lat: 55.7558, lng: 37.6173, country: "Russia", population: 12506468 },
    
    // Asia
    { city: "Tokyo", lat: 35.6762, lng: 139.6503, country: "Japan", population: 13929286 },
    { city: "Delhi", lat: 28.7041, lng: 77.1025, country: "India", population: 29399141 },
    { city: "Shanghai", lat: 31.2304, lng: 121.4737, country: "China", population: 26317104 },
    { city: "Dhaka", lat: 23.8103, lng: 90.4125, country: "Bangladesh", population: 21006000 },
    { city: "Mumbai", lat: 19.0760, lng: 72.8777, country: "India", population: 12478447 },
    { city: "Beijing", lat: 39.9042, lng: 116.4074, country: "China", population: 21540000 },
    { city: "Dubai", lat: 25.2048, lng: 55.2708, country: "United Arab Emirates", population: 3331420 },
    { city: "Singapore", lat: 1.3521, lng: 103.8198, country: "Singapore", population: 5850000 },
    { city: "Seoul", lat: 37.5665, lng: 126.9780, country: "South Korea", population: 9776000 },
    { city: "Bangkok", lat: 13.7563, lng: 100.5018, country: "Thailand", population: 8281000 },
    { city: "Hong Kong", lat: 22.3193, lng: 114.1694, country: "China", population: 7482500 },
    { city: "Jakarta", lat: -6.2088, lng: 106.8456, country: "Indonesia", population: 10770487 },
    { city: "Kuala Lumpur", lat: 3.1390, lng: 101.6869, country: "Malaysia", population: 1808000 },
    { city: "Manila", lat: 14.5995, lng: 120.9842, country: "Philippines", population: 13923452 },
    { city: "Taipei", lat: 25.0330, lng: 121.5654, country: "Taiwan", population: 2646204 },
    { city: "Riyadh", lat: 24.7136, lng: 46.6753, country: "Saudi Arabia", population: 7676654 },
    { city: "Jeddah", lat: 21.5433, lng: 39.1728, country: "Saudi Arabia", population: 4076000 },
    { city: "Mecca", lat: 21.3891, lng: 39.8579, country: "Saudi Arabia", population: 1919900 },
    { city: "Medina", lat: 24.5247, lng: 39.5692, country: "Saudi Arabia", population: 1300000 },
    { city: "Karachi", lat: 24.8607, lng: 67.0011, country: "Pakistan", population: 14910352 },
    { city: "Lahore", lat: 31.5204, lng: 74.3587, country: "Pakistan", population: 11126285 },
    { city: "Kolkata", lat: 22.5726, lng: 88.3639, country: "India", population: 4496694 },
    { city: "Chennai", lat: 13.0827, lng: 80.2707, country: "India", population: 4646732 },
    { city: "Bangalore", lat: 12.9716, lng: 77.5946, country: "India", population: 8443675 },
    { city: "Hyderabad", lat: 17.3850, lng: 78.4867, country: "India", population: 6809970 },
    
    // Africa
    { city: "Cairo", lat: 30.0444, lng: 31.2357, country: "Egypt", population: 9500000 },
    { city: "Lagos", lat: 6.5244, lng: 3.3792, country: "Nigeria", population: 14368000 },
    { city: "Kinshasa", lat: -4.4419, lng: 15.2663, country: "Democratic Republic of the Congo", population: 11587000 },
    { city: "Johannesburg", lat: -26.2041, lng: 28.0473, country: "South Africa", population: 5635127 },
    { city: "Casablanca", lat: 33.5731, lng: -7.5898, country: "Morocco", population: 3359818 },
    { city: "Cape Town", lat: -33.9249, lng: 18.4241, country: "South Africa", population: 433688 },
    { city: "Nairobi", lat: -1.2921, lng: 36.8219, country: "Kenya", population: 4397073 },
    { city: "Dar es Salaam", lat: -6.7924, lng: 39.2083, country: "Tanzania", population: 6701650 },
    { city: "Addis Ababa", lat: 9.0054, lng: 38.7636, country: "Ethiopia", population: 3352000 },
    { city: "Algiers", lat: 36.7538, lng: 3.0588, country: "Algeria", population: 3415811 },
    
    // South America
    { city: "Sao Paulo", lat: -23.5505, lng: -46.6333, country: "Brazil", population: 12325232 },
    { city: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, country: "Brazil", population: 6718903 },
    { city: "Buenos Aires", lat: -34.6037, lng: -58.3816, country: "Argentina", population: 3075646 },
    { city: "Lima", lat: -12.0464, lng: -77.0428, country: "Peru", population: 9751717 },
    { city: "Bogota", lat: 4.7110, lng: -74.0721, country: "Colombia", population: 7181469 },
    { city: "Santiago", lat: -33.4489, lng: -70.6693, country: "Chile", population: 6257516 },
    { city: "Caracas", lat: 10.4806, lng: -66.9036, country: "Venezuela", population: 3000000 },
    { city: "Quito", lat: -0.1807, lng: -78.4678, country: "Ecuador", population: 2011388 },
    
    // Mexico & Central America
    { city: "Mexico City", lat: 19.4326, lng: -99.1332, country: "Mexico", population: 9209944 },
    { city: "Guatemala City", lat: 14.6349, lng: -90.5069, country: "Guatemala", population: 2450212 },
    { city: "Panama City", lat: 8.9936, lng: -79.5197, country: "Panama", population: 880691 },
    { city: "San Jose", lat: 9.9281, lng: -84.0907, country: "Costa Rica", population: 288054 },
    
    // Australia & Oceania
    { city: "Sydney", lat: -33.8688, lng: 151.2093, country: "Australia", population: 5312163 },
    { city: "Melbourne", lat: -37.8136, lng: 144.9631, country: "Australia", population: 5078193 },
    { city: "Brisbane", lat: -27.4698, lng: 153.0251, country: "Australia", population: 2560720 },
    { city: "Perth", lat: -31.9505, lng: 115.8605, country: "Australia", population: 2059484 },
    { city: "Auckland", lat: -36.8485, lng: 174.7633, country: "New Zealand", population: 1657000 },
    { city: "Wellington", lat: -41.2865, lng: 174.7762, country: "New Zealand", population: 212700 }
  ];
} 