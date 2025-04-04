
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForecastDay } from "@/types/weather";
import WeatherIcon from "./WeatherIcon";

interface ForecastProps {
  forecast: ForecastDay[];
  className?: string;
}

const Forecast: React.FC<ForecastProps> = ({ forecast, className }) => {
  return (
    <Card className={`bg-white/80 backdrop-blur-md shadow-lg ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => {
            const date = new Date(day.date);
            const dayName = index === 0 
              ? 'Today' 
              : date.toLocaleDateString(undefined, { weekday: 'short' });
              
            return (
              <div 
                key={day.date} 
                className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium mb-2">{dayName}</p>
                <WeatherIcon 
                  code={day.day.condition.code} 
                  size={40} 
                  className="my-2 text-weather-blue" 
                />
                <p className="text-sm mt-1">{day.day.condition.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-semibold">{Math.round(day.day.maxtemp_c)}°</span>
                  <span className="text-gray-500">{Math.round(day.day.mintemp_c)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Forecast;
