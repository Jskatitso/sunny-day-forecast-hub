
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HourForecast } from "@/types/weather";
import WeatherIcon from "./WeatherIcon";

interface HourlyForecastProps {
  hours: HourForecast[];
  className?: string;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hours, className }) => {
  // Get only future hours from current time
  const currentHour = new Date().getHours();
  const futureHours = hours.filter((hour) => {
    const hourTime = parseInt(hour.time.split(" ")[1].split(":")[0]);
    return hourTime >= currentHour;
  });

  // Add some hours from tomorrow if we have less than 12 hours left today
  const displayHours = futureHours.length < 12 ? [...futureHours, ...hours.slice(0, 12 - futureHours.length)] : futureHours.slice(0, 12);

  return (
    <Card className={`bg-white/80 backdrop-blur-md shadow-lg ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex space-x-4">
            {displayHours.map((hour, index) => {
              const time = new Date(hour.time);
              const hourDisplay = time.getHours();
              const ampm = hourDisplay >= 12 ? 'PM' : 'AM';
              const hour12 = hourDisplay % 12 || 12;
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center p-3 min-w-[80px]"
                >
                  <p className="text-sm font-medium">
                    {hour12} {ampm}
                  </p>
                  <WeatherIcon 
                    code={hour.condition.code} 
                    size={32} 
                    className="my-3 text-weather-blue" 
                  />
                  <p className="font-semibold">{Math.round(hour.temp_c)}°C</p>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HourlyForecast;
