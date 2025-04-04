
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchResult } from "@/types/weather";
import { searchLocations } from "@/services/weatherService";
import { Search, MapPin } from "lucide-react";

interface LocationSearchProps {
  onSelectLocation: (location: string) => void;
  className?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSelectLocation, className }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = async () => {
    if (!query) return;

    setIsSearching(true);
    try {
      const data = await searchLocations(query);
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching locations:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (location: SearchResult) => {
    onSelectLocation(location.name);
    setQuery(location.name);
    setShowResults(false);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="flex w-full max-w-md items-center space-x-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg"
            onFocus={() => query.length > 2 && setShowResults(true)}
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || query.length < 3}
        >
          Search
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full max-w-md bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-1">
            {results.map((result) => (
              <li
                key={`${result.name}-${result.id}`}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSelectLocation(result)}
              >
                <MapPin className="h-4 w-4 mr-2 text-weather-blue" />
                <div>
                  <div className="font-medium">{result.name}</div>
                  <div className="text-sm text-gray-500">{result.region}, {result.country}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
