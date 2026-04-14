import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api/client";

/**
 * Custom hook to handle real-time geolocation tracking, risk analysis,
 * and distance calculations.
 */
export const useSafetyTracking = (isActive, options = {}) => {
  const [path, setPath] = useState([]); // Array of {lat, lng}
  const [riskTrend, setRiskTrend] = useState([]); // Array of {time, score, place}
  const [distance, setDistance] = useState(0); // in km
  const [lastLocation, setLastLocation] = useState(null);
  
  const watchId = useRef(null);
  const lastCheckTime = useRef(0);

  // Haversine formula to calculate distance between two points in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleLocationUpdate = useCallback(async (pos) => {
    const { latitude: lat, longitude: lng } = pos.coords;
    const newPoint = { latitude: lat, longitude: lng };

    setPath(prev => [...prev, newPoint]);

    // Calculate incremental distance
    if (lastLocation) {
      const d = calculateDistance(
        lastLocation.latitude,
        lastLocation.longitude,
        lat,
        lng
      );
      if (d > 0.01) { // Only add if moved more than 10 meters to avoid jitter
        setDistance(prev => prev + d);
        setLastLocation(newPoint);
      }
    } else {
      setLastLocation(newPoint);
    }

    // Risk Analysis Pooling: Every 30 seconds or significant movement
    const now = Date.now();
    if (now - lastCheckTime.current > (options.checkInterval || 20000)) {
      lastCheckTime.current = now;
      try {
        const { data } = await api.post("/predict-crime", { latitude: lat, longitude: lng });
        
        // Use OSM for human-readable place name if possible, or fallback to generic
        const placeName = data.analysis ? data.analysis.split(".")[0] : `Point ${path.length + 1}`;
        
        setRiskTrend(prev => [
          ...prev, 
          { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            score: data.crimeRiskScore,
            place: placeName
          }
        ]);
      } catch (err) {
        console.error("Risk check failed:", err.message);
      }
    }
  }, [lastLocation, path.length, options.checkInterval]);

  useEffect(() => {
    if (isActive) {
      if (navigator.geolocation) {
        watchId.current = navigator.geolocation.watchPosition(
          handleLocationUpdate,
          (err) => console.error("Tracking error:", err),
          { enableHighAccuracy: true, distanceFilter: 10 }
        );
      }
    } else {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    }

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [isActive, handleLocationUpdate]);

  const resetTracking = () => {
    setPath([]);
    setRiskTrend([]);
    setDistance(0);
    setLastLocation(null);
    lastCheckTime.current = 0;
  };

  return { path, riskTrend, distance, resetTracking };
};
