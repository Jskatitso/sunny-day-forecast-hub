
import { WeatherData, SearchResult } from "../types/weather";

const API_KEY = "your-api-key"; // In production, use environment variables for API keys
const BASE_URL = "https://weatherapi-com.p.rapidapi.com";

const headers = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
};

export const fetchWeatherData = async (query: string): Promise<WeatherData | null> => {
  try {
    // For demo purposes, we'll use mock data instead of making actual API calls
    return getMockWeatherData(query);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export const searchLocations = async (query: string): Promise<SearchResult[]> => {
  try {
    // For demo purposes, we'll return mock Ghana search results
    return getMockGhanaLocations(query);
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};

// Mock data for Ghana locations
const getMockGhanaLocations = (query: string): SearchResult[] => {
  if (!query || query.trim() === "") return [];
  
  const ghanaianCities = [
    { id: 1, name: "Accra", region: "Greater Accra", country: "Ghana", lat: 5.6037, lon: -0.1870 },
    { id: 2, name: "Kumasi", region: "Ashanti", country: "Ghana", lat: 6.6885, lon: -1.6244 },
    { id: 3, name: "Tamale", region: "Northern", country: "Ghana", lat: 9.4075, lon: -0.8533 },
    { id: 4, name: "Takoradi", region: "Western", country: "Ghana", lat: 4.8845, lon: -1.7554 },
    { id: 5, name: "Cape Coast", region: "Central", country: "Ghana", lat: 5.1053, lon: -1.2466 },
    { id: 6, name: "Sekondi", region: "Western", country: "Ghana", lat: 4.9349, lon: -1.7041 },
    { id: 7, name: "Koforidua", region: "Eastern", country: "Ghana", lat: 6.0945, lon: -0.2579 },
    { id: 8, name: "Sunyani", region: "Bono", country: "Ghana", lat: 7.3349, lon: -2.3268 },
    { id: 9, name: "Ho", region: "Volta", country: "Ghana", lat: 6.6015, lon: 0.4713 },
    { id: 10, name: "Techiman", region: "Bono East", country: "Ghana", lat: 7.5908, lon: -1.9427 },
  ];
  
  return ghanaianCities.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase()) || 
    city.region.toLowerCase().includes(query.toLowerCase())
  );
};

// Mock data for demo purposes - adapted for Ghana's weather
const getMockWeatherData = (location: string): WeatherData => {
  const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;
  
  // Adjust temperature range to be appropriate for Ghana (tropical climate)
  const baseTemp = 24 + Math.random() * 8; // Temperature between 24-32°C
  const minTemp = baseTemp - 4;
  const maxTemp = baseTemp + 4;
  
  return {
    location: {
      name: location || "Accra",
      region: getRegionForCity(location) || "Greater Accra",
      country: "Ghana",
      lat: 5.6037,
      lon: -0.1870,
      localtime: new Date().toLocaleString(),
    },
    current: {
      temp_c: baseTemp,
      temp_f: (baseTemp * 9/5) + 32,
      condition: {
        text: getRandomGhanaWeatherCondition(isNight),
        code: isNight ? 1000 : 1000,
      },
      wind_mph: 3 + Math.random() * 8,
      wind_kph: (3 + Math.random() * 8) * 1.60934,
      wind_dir: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
      humidity: 65 + Math.floor(Math.random() * 20), // Higher humidity for tropical climate
      feelslike_c: baseTemp + 2, // In humid climates, feels hotter
      feelslike_f: ((baseTemp + 2) * 9/5) + 32,
      uv: 8 + Math.floor(Math.random() * 4), // Higher UV index in tropical regions
    },
    forecast: {
      forecastday: [
        {
          date: new Date().toISOString().split('T')[0],
          day: {
            maxtemp_c: maxTemp,
            maxtemp_f: (maxTemp * 9/5) + 32,
            mintemp_c: minTemp,
            mintemp_f: (minTemp * 9/5) + 32,
            condition: {
              text: getRandomGhanaWeatherCondition(false),
              code: 1000,
            },
          },
          hour: Array(24).fill(null).map((_, i) => {
            // Create more realistic temperature curve for Ghana (warmer during day, cooler at night but not by much)
            const hourTemp = minTemp + 
              (i >= 6 && i <= 16 
                ? (maxTemp - minTemp) * (1 - Math.abs(i - 13) / 7) // Day temperature curve
                : (maxTemp - minTemp) * 0.3); // Night temperature
                
            return {
              time: `${new Date().toISOString().split('T')[0]} ${i.toString().padStart(2, '0')}:00`,
              temp_c: hourTemp,
              temp_f: (hourTemp * 9/5) + 32,
              condition: {
                text: getRandomGhanaWeatherCondition(i < 6 || i >= 18),
                code: getWeatherCode(getRandomGhanaWeatherCondition(i < 6 || i >= 18)),
              },
            };
          }),
        },
        ...Array(4).fill(null).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 1);
          
          const dayMaxTemp = maxTemp + Math.round(Math.random() * 4 - 2);
          const dayMinTemp = minTemp + Math.round(Math.random() * 4 - 2);
          
          return {
            date: date.toISOString().split('T')[0],
            day: {
              maxtemp_c: dayMaxTemp,
              maxtemp_f: (dayMaxTemp * 9/5) + 32,
              mintemp_c: dayMinTemp,
              mintemp_f: (dayMinTemp * 9/5) + 32,
              condition: {
                text: getRandomGhanaWeatherCondition(false),
                code: getWeatherCode(getRandomGhanaWeatherCondition(false)),
              },
            },
            hour: Array(24).fill(null).map((_, j) => {
              const hourTemp = dayMinTemp + 
                (j >= 6 && j <= 16 
                  ? (dayMaxTemp - dayMinTemp) * (1 - Math.abs(j - 13) / 7) 
                  : (dayMaxTemp - dayMinTemp) * 0.3);
                  
              return {
                time: `${date.toISOString().split('T')[0]} ${j.toString().padStart(2, '0')}:00`,
                temp_c: hourTemp,
                temp_f: (hourTemp * 9/5) + 32,
                condition: {
                  text: getRandomGhanaWeatherCondition(j < 6 || j >= 18),
                  code: getWeatherCode(getRandomGhanaWeatherCondition(j < 6 || j >= 18)),
                },
              };
            }),
          };
        }),
      ],
    },
  };
};

// Helper function to get region for a Ghanaian city
function getRegionForCity(cityName: string): string {
  const cityRegions: {[key: string]: string} = {
    "Accra": "Greater Accra",
    "Kumasi": "Ashanti",
    "Tamale": "Northern",
    "Takoradi": "Western",
    "Cape Coast": "Central",
    "Sekondi": "Western",
    "Koforidua": "Eastern",
    "Sunyani": "Bono",
    "Ho": "Volta",
    "Techiman": "Bono East"
  };
  
  return cityRegions[cityName] || "Greater Accra";
}

// Weather conditions more common in Ghana
function getRandomGhanaWeatherCondition(isNight: boolean): string {
  if (isNight) {
    return ["Clear", "Partly cloudy", "Clear", "Clear", "Partly cloudy"][Math.floor(Math.random() * 5)];
  }
  
  const drySeasonConditions = ["Sunny", "Hot", "Partly cloudy", "Sunny", "Hazy"];
  const rainySeasonConditions = ["Partly cloudy", "Light rain", "Patchy rain possible", "Thundery outbreaks", "Sunny"];
  
  // Determine if it's currently rainy season in Ghana (roughly May-October)
  const month = new Date().getMonth() + 1; // JavaScript months are 0-indexed
  const isRainySeason = month >= 5 && month <= 10;
  
  if (isRainySeason) {
    return rainySeasonConditions[Math.floor(Math.random() * rainySeasonConditions.length)];
  } else {
    return drySeasonConditions[Math.floor(Math.random() * drySeasonConditions.length)];
  }
}

// Get weather code based on condition text
function getWeatherCode(condition: string): number {
  const conditionMap: {[key: string]: number} = {
    "Sunny": 1000,
    "Clear": 1000, 
    "Partly cloudy": 1003,
    "Cloudy": 1006,
    "Light rain": 1183,
    "Patchy rain possible": 1063,
    "Thundery outbreaks": 1087,
    "Hot": 1000,
    "Hazy": 1030
  };
  
  return conditionMap[condition] || 1000;
}
