
import React from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Cloudy,
  Moon,
  Sun,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  code: number;
  className?: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ code, className, size = 24 }) => {
  const getWeatherIcon = () => {
    // Weather codes based on WeatherAPI condition codes
    // https://www.weatherapi.com/docs/conditions.json
    switch (true) {
      case code === 1000: // Sunny or Clear
        const isNight = new Date().getHours() > 18 || new Date().getHours() < 6;
        return isNight ? <Moon size={size} /> : <Sun size={size} />;
      case code >= 1003 && code <= 1030: // Partly cloudy, cloudy, overcast, mist
        return <Cloud size={size} />;
      case code >= 1063 && code <= 1072: // Rain
        return <CloudRain size={size} />;
      case code >= 1087 && code <= 1117: // Thunder, thundery outbreaks
        return <CloudLightning size={size} />;
      case code >= 1150 && code <= 1207: // Drizzle, light rain
        return <CloudDrizzle size={size} />;
      case code >= 1210 && code <= 1237: // Snow
        return <CloudSnow size={size} />;
      case code >= 1240 && code <= 1252: // Heavy rain
        return <CloudRain size={size} />;
      case code >= 1255 && code <= 1282: // Heavy snow, blizzard
        return <CloudSnow size={size} />;
      case code === 1135 || code === 1147: // Fog
        return <CloudFog size={size} />;
      default:
        return <Cloudy size={size} />;
    }
  };

  return <div className={cn("inline-flex", className)}>{getWeatherIcon()}</div>;
};

export default WeatherIcon;
