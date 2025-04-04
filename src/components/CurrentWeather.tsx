
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CurrentWeather as CurrentWeatherType } from "@/types/weather";
import WeatherIcon from "./WeatherIcon";
import { Droplets, Thermometer, Wind as WindIcon } from "lucide-react";

interface CurrentWeatherProps {
  current: CurrentWeatherType;
  locationName: string;
  className?: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  current,
  locationName,
  className,
}) => {
  const { temp_c, condition, humidity, wind_kph, feelslike_c } = current;
  const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;

  return (
    <Card className={`bg-white/80 backdrop-blur-md shadow-lg ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-1">{locationName}</h2>
            <p className="text-gray-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div className="mt-4">
              <p className="text-5xl font-bold">{Math.round(temp_c)}°C</p>
              <p className="text-gray-600 mt-1">Feels like {Math.round(feelslike_c)}°C</p>
              <p className="mt-2 text-lg font-medium">{condition.text}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-weather-blue/10 rounded-full p-4 mb-4 animate-pulse-slow">
              <WeatherIcon 
                code={condition.code} 
                size={80} 
                className={isNight ? "text-indigo-400" : "text-amber-400"}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div className="flex flex-col items-center">
                <WindIcon size={20} className="text-weather-blue mb-1" />
                <span className="text-sm font-medium">{Math.round(wind_kph)} km/h</span>
                <span className="text-xs text-gray-500">Wind</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Droplets size={20} className="text-weather-blue mb-1" />
                <span className="text-sm font-medium">{humidity}%</span>
                <span className="text-xs text-gray-500">Humidity</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Thermometer size={20} className="text-weather-blue mb-1" />
                <span className="text-sm font-medium">{current.uv}</span>
                <span className="text-xs text-gray-500">UV Index</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
