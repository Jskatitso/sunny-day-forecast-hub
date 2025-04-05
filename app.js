
document.addEventListener('DOMContentLoaded', () => {
  // Set the current year in the footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Check if it's nighttime (between 6 PM and 6 AM)
  const currentHour = new Date().getHours();
  if (currentHour > 18 || currentHour < 6) {
    document.body.classList.add('night-mode');
  }
  
  // DOM elements
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const errorMessageElement = document.getElementById('error-message');
  const currentWeatherElement = document.getElementById('current-weather');
  const hourlyForecastElement = document.getElementById('hourly-forecast');
  const dailyForecastElement = document.getElementById('daily-forecast');
  const locationSearchInput = document.getElementById('location-search');
  const searchButton = document.getElementById('search-button');
  const retryButton = document.getElementById('retry-button');
  
  // Default location
  let currentLocation = 'Accra';
  
  // Initialize the app
  loadWeatherData(currentLocation);
  
  // Event listeners
  searchButton.addEventListener('click', () => {
    const searchLocation = locationSearchInput.value.trim();
    if (searchLocation) {
      currentLocation = searchLocation;
      loadWeatherData(currentLocation);
    }
  });
  
  locationSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const searchLocation = locationSearchInput.value.trim();
      if (searchLocation) {
        currentLocation = searchLocation;
        loadWeatherData(currentLocation);
      }
    }
  });
  
  retryButton.addEventListener('click', () => {
    loadWeatherData(currentLocation);
  });
  
  // Function to load weather data
  async function loadWeatherData(location) {
    // Show loading state
    showLoading();
    
    try {
      // In a real app, this would be an API call to a weather service
      // For demonstration purposes, we're using simulated data
      const data = await fetchMockWeatherData(location);
      
      if (data) {
        updateCurrentWeather(data);
        updateHourlyForecast(data.forecast.forecastday[0].hour);
        updateDailyForecast(data.forecast.forecastday);
        showWeatherData();
      } else {
        showError('Could not load weather data. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
      showError('An error occurred while fetching weather data.');
    }
  }
  
  // Show loading state
  function showLoading() {
    loadingElement.classList.remove('hidden');
    errorElement.classList.add('hidden');
    currentWeatherElement.classList.add('hidden');
    hourlyForecastElement.classList.add('hidden');
    dailyForecastElement.classList.add('hidden');
  }
  
  // Show error state
  function showError(message) {
    loadingElement.classList.add('hidden');
    errorElement.classList.remove('hidden');
    currentWeatherElement.classList.add('hidden');
    hourlyForecastElement.classList.add('hidden');
    dailyForecastElement.classList.add('hidden');
    errorMessageElement.textContent = message;
  }
  
  // Show weather data
  function showWeatherData() {
    loadingElement.classList.add('hidden');
    errorElement.classList.add('hidden');
    currentWeatherElement.classList.remove('hidden');
    hourlyForecastElement.classList.remove('hidden');
    dailyForecastElement.classList.remove('hidden');
  }
  
  // Update current weather section
  function updateCurrentWeather(data) {
    document.getElementById('location-name').textContent = data.location.name;
    document.getElementById('current-temperature').textContent = Math.round(data.current.temp_c);
    document.getElementById('weather-condition').textContent = data.current.condition.text;
    document.getElementById('feels-like').textContent = Math.round(data.current.feelslike_c);
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.current.wind_kph} km/h`;
    document.getElementById('uv-index').textContent = data.current.uv;
  }
  
  // Update hourly forecast section
  function updateHourlyForecast(hours) {
    const hourlyContainer = document.getElementById('hourly-container');
    hourlyContainer.innerHTML = '';
    
    // Filter hours to show only future hours
    const currentHour = new Date().getHours();
    const filteredHours = hours.filter((hour, index) => {
      const hourTime = new Date(hour.time).getHours();
      return hourTime >= currentHour || index >= 24 - currentHour;
    }).slice(0, 12); // Show only next 12 hours
    
    filteredHours.forEach(hour => {
      const hourTime = new Date(hour.time).getHours();
      const hourLabel = hourTime === 0 ? '12 AM' : 
                       hourTime < 12 ? `${hourTime} AM` : 
                       hourTime === 12 ? '12 PM' : 
                       `${hourTime - 12} PM`;
      
      const hourElement = document.createElement('div');
      hourElement.className = 'hourly-item';
      hourElement.innerHTML = `
        <span>${hourLabel}</span>
        <div class="weather-icon">
          ${getWeatherIconHTML(hour.condition.text)}
        </div>
        <span class="hourly-temp">${Math.round(hour.temp_c)}°</span>
      `;
      
      hourlyContainer.appendChild(hourElement);
    });
  }
  
  // Update daily forecast section
  function updateDailyForecast(forecastDays) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    
    forecastDays.forEach((day, index) => {
      if (index === 0) return; // Skip today since we already show it in hourly forecast
      
      const date = new Date(day.date);
      const dayName = index === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' });
      
      const dayElement = document.createElement('div');
      dayElement.className = 'forecast-item';
      dayElement.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <div class="weather-icon">
          ${getWeatherIconHTML(day.day.condition.text)}
        </div>
        <div class="forecast-temp">
          <span class="max-temp">${Math.round(day.day.maxtemp_c)}°</span>
          <span class="min-temp">${Math.round(day.day.mintemp_c)}°</span>
        </div>
      `;
      
      forecastContainer.appendChild(dayElement);
    });
  }
  
  // Helper function to generate weather icon HTML
  function getWeatherIconHTML(condition) {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return '☀️';
    } else if (lowerCondition.includes('cloud') && lowerCondition.includes('part')) {
      return '⛅';
    } else if (lowerCondition.includes('cloud')) {
      return '☁️';
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return '🌧️';
    } else if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
      return '⛈️';
    } else if (lowerCondition.includes('snow')) {
      return '❄️';
    } else if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) {
      return '🌫️';
    } else {
      return '🌤️';
    }
  }
  
  // Mock weather data function
  // In a real app, this would be replaced with an actual API call
  async function fetchMockWeatherData(location) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if location is in Ghana (very simplified)
    const ghanaLocations = ['accra', 'kumasi', 'tamale', 'takoradi', 'cape coast', 'tema', 'sekondi', 'obuasi', 'sunyani', 'koforidua'];
    if (!ghanaLocations.includes(location.toLowerCase()) && location.toLowerCase() !== 'ghana') {
      // For non-Ghana locations, add "Ghana" to make it seem like it's searching within Ghana
      location = `${location}, Ghana`;
    }
    
    // Generate random temperature based on Ghana's climate
    const baseTemp = Math.floor(Math.random() * 7) + 26; // 26-32°C typical for Ghana
    const humidity = Math.floor(Math.random() * 20) + 65; // 65-85% humidity typical for Ghana
    const windSpeed = Math.floor(Math.random() * 15) + 5; // 5-20 km/h
    const uvIndex = Math.floor(Math.random() * 5) + 6; // 6-10 UV index typical for Ghana
    
    // Determine condition based on season (simplified)
    const month = new Date().getMonth(); // 0-11
    let condition;
    
    // Ghana has rainy seasons typically from April-June and September-October
    if ((month >= 3 && month <= 5) || (month >= 8 && month <= 9)) {
      // Rainy season
      const conditions = ['Light rain', 'Moderate rain', 'Partly cloudy with showers', 'Thunderstorms', 'Cloudy with rain'];
      condition = conditions[Math.floor(Math.random() * conditions.length)];
    } else {
      // Dry season
      const conditions = ['Sunny', 'Partly cloudy', 'Clear', 'Mostly sunny', 'Hot and sunny'];
      condition = conditions[Math.floor(Math.random() * conditions.length)];
    }
    
    // Generate forecast data for 5 days
    const forecastDays = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Generate hourly data for this day
      const hours = [];
      for (let h = 0; h < 24; h++) {
        const hourDate = new Date(date);
        hourDate.setHours(h);
        
        // Temperature variation through the day
        let hourTemp;
        if (h >= 10 && h <= 16) {
          // Midday temperatures (hottest)
          hourTemp = baseTemp + Math.floor(Math.random() * 3) + 2;
        } else if (h >= 20 || h <= 6) {
          // Night temperatures (coolest)
          hourTemp = baseTemp - Math.floor(Math.random() * 3) - 1;
        } else {
          // Morning and evening
          hourTemp = baseTemp + Math.floor(Math.random() * 2);
        }
        
        // Condition based on time of day
        let hourCondition;
        if (h >= 6 && h <= 18) {
          hourCondition = condition; // Use day condition
        } else {
          // Night conditions
          if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('thunder')) {
            hourCondition = condition; // Keep rain at night
          } else {
            hourCondition = 'Clear'; // Clear at night if day was clear/sunny
          }
        }
        
        hours.push({
          time: hourDate.toISOString(),
          temp_c: hourTemp,
          condition: {
            text: hourCondition
          }
        });
      }
      
      forecastDays.push({
        date: date.toISOString().split('T')[0],
        day: {
          maxtemp_c: baseTemp + Math.floor(Math.random() * 3) + 2,
          mintemp_c: baseTemp - Math.floor(Math.random() * 3) - 1,
          condition: {
            text: condition
          }
        },
        hour: hours
      });
    }
    
    return {
      location: {
        name: location.split(',')[0],
        country: 'Ghana'
      },
      current: {
        temp_c: baseTemp,
        condition: {
          text: condition
        },
        feelslike_c: baseTemp + Math.floor(Math.random() * 3),
        humidity: humidity,
        wind_kph: windSpeed,
        uv: uvIndex
      },
      forecast: {
        forecastday: forecastDays
      }
    };
  }
});
