
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
    // For demo purposes, we'll return mock search results
    return getMockSearchResults(query);
  } catch (error) {
    console.error("Error searching locations:", error);
    return [];
  }
};

// Mock data for demo purposes
const getMockWeatherData = (location: string): WeatherData => {
  const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;
  
  return {
    location: {
      name: location || "New York",
      region: "New York",
      country: "United States of America",
      lat: 40.71,
      lon: -74.01,
      localtime: new Date().toLocaleString(),
    },
    current: {
      temp_c: 22,
      temp_f: 71.6,
      condition: {
        text: isNight ? "Clear" : "Sunny",
        code: isNight ? 1000 : 1000,
      },
      wind_mph: 5.6,
      wind_kph: 9.0,
      wind_dir: "WSW",
      humidity: 65,
      feelslike_c: 22,
      feelslike_f: 71.6,
      uv: 6,
    },
    forecast: {
      forecastday: [
        {
          date: new Date().toISOString().split('T')[0],
          day: {
            maxtemp_c: 24,
            maxtemp_f: 75.2,
            mintemp_c: 18,
            mintemp_f: 64.4,
            condition: {
              text: "Sunny",
              code: 1000,
            },
          },
          hour: Array(24).fill(null).map((_, i) => ({
            time: `${new Date().toISOString().split('T')[0]} ${i.toString().padStart(2, '0')}:00`,
            temp_c: 18 + Math.round(Math.sin(i / 24 * Math.PI) * 6),
            temp_f: 64.4 + Math.round(Math.sin(i / 24 * Math.PI) * 10.8),
            condition: {
              text: i >= 6 && i <= 18 ? "Sunny" : "Clear",
              code: 1000,
            },
          })),
        },
        ...Array(4).fill(null).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i + 1);
          return {
            date: date.toISOString().split('T')[0],
            day: {
              maxtemp_c: 22 + Math.round(Math.random() * 4 - 2),
              maxtemp_f: 71.6 + Math.round((Math.random() * 4 - 2) * 1.8),
              mintemp_c: 18 + Math.round(Math.random() * 4 - 2),
              mintemp_f: 64.4 + Math.round((Math.random() * 4 - 2) * 1.8),
              condition: {
                text: ["Sunny", "Partly cloudy", "Cloudy", "Patchy rain possible"][Math.floor(Math.random() * 4)],
                code: [1000, 1003, 1006, 1063][Math.floor(Math.random() * 4)],
              },
            },
            hour: Array(24).fill(null).map((_, j) => ({
              time: `${date.toISOString().split('T')[0]} ${j.toString().padStart(2, '0')}:00`,
              temp_c: 18 + Math.round(Math.sin(j / 24 * Math.PI) * 6),
              temp_f: 64.4 + Math.round(Math.sin(j / 24 * Math.PI) * 10.8),
              condition: {
                text: j >= 6 && j <= 18 ? ["Sunny", "Partly cloudy", "Cloudy", "Patchy rain possible"][Math.floor(Math.random() * 4)] : "Clear",
                code: [1000, 1003, 1006, 1063][Math.floor(Math.random() * 4)],
              },
            })),
          };
        }),
      ],
    },
  };
};

const getMockSearchResults = (query: string): SearchResult[] => {
  if (!query || query.trim() === "") return [];
  
  const cities = [
    { id: 1, name: "New York", region: "New York", country: "United States of America", lat: 40.71, lon: -74.01 },
    { id: 2, name: "Los Angeles", region: "California", country: "United States of America", lat: 34.05, lon: -118.24 },
    { id: 3, name: "Chicago", region: "Illinois", country: "United States of America", lat: 41.88, lon: -87.63 },
    { id: 4, name: "London", region: "City of London, Greater London", country: "United Kingdom", lat: 51.52, lon: -0.11 },
    { id: 5, name: "Paris", region: "Ile-de-France", country: "France", lat: 48.85, lon: 2.35 },
  ];
  
  return cities.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase()) || 
    city.country.toLowerCase().includes(query.toLowerCase())
  );
};
