
import React, { useState, useEffect } from "react";
import { WeatherData } from "@/types/weather";
import { fetchWeatherData } from "@/services/weatherService";
import CurrentWeather from "./CurrentWeather";
import Forecast from "./Forecast";
import LocationSearch from "./LocationSearch";
import HourlyForecast from "./HourlyForecast";
import { useToast } from "@/components/ui/use-toast";

const WeatherApp: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("New York");
  const { toast } = useToast();

  useEffect(() => {
    loadWeatherData(location);
  }, [location]);

  const loadWeatherData = async (locationQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(locationQuery);
      if (data) {
        setWeatherData(data);
      } else {
        setError("Could not load weather data. Please try again.");
        toast({
          title: "Error",
          description: "Could not load weather data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An error occurred while fetching weather data.");
      toast({
        title: "Error",
        description: "An error occurred while fetching weather data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
  };

  const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;

  return (
    <div className={`min-h-screen w-full ${isNight ? 'weather-gradient-night' : 'weather-gradient-day'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
            Weather Forecast
          </h1>
          <LocationSearch onSelectLocation={handleLocationSelect} className="w-full md:w-auto" />
        </header>

        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-center text-white p-6 bg-red-500/20 backdrop-blur-sm rounded-lg">
              <p>{error}</p>
              <button 
                onClick={() => loadWeatherData(location)}
                className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : weatherData && (
            <>
              <CurrentWeather 
                current={weatherData.current} 
                locationName={weatherData.location.name} 
              />
              
              <HourlyForecast 
                hours={weatherData.forecast.forecastday[0].hour} 
              />
              
              <Forecast 
                forecast={weatherData.forecast.forecastday} 
              />
            </>
          )}
        </div>

        <footer className="mt-12 text-center text-white/70 text-sm">
          <p>© {new Date().getFullYear()} Weather Forecast App</p>
          <p className="mt-1">Data provided for demonstration purposes</p>
        </footer>
      </div>
    </div>
  );
};

export default WeatherApp;
