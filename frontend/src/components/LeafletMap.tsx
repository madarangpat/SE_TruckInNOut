"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { calculateDistance } from "@/lib/google";

// Fix Leaflet icon paths
delete (L.Icon.Default.prototype as any).getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🔴 Custom red icon
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 🔵 Custom blue icon for debug marker
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// 🌍 Fit bounds helper
function MapBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

interface Props {
  lat: number;
  lng: number;
  destination: string;
  userLat: number;
  userLng: number;
  isAdmin: boolean;
}

export default function LeafletMap({
  lat,
  lng,
  destination,
  userLat,
  userLng,
  isAdmin,
}: Props) {
  const destinationPos: [number, number] = [lat, lng];
  const userPos: [number, number] = [userLat, userLng];
  const [distanceKm, setDistanceKm] = useState<number>(0);
  
  // Debug states
  const [debugEnabled, setDebugEnabled] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Calculate bounds to include destination, user location, and current location (if debugging)
  const bounds: L.LatLngBoundsExpression = currentLocation && debugEnabled
    ? [
        [lat, lng],
        [userLat, userLng],
        [currentLocation.lat, currentLocation.lng]
      ]
    : [
        [lat, lng],
        [userLat, userLng]
      ];

  // Toggle debug mode function
  const toggleDebugMode = () => {
    if (!debugEnabled) {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported by this browser.");
        return;
      }
      
      // Get current position once
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          console.log("Debug: Current location captured", { lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Debug: Error getting position:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      
      setDebugEnabled(true);
    } else {
      // Turn off debug mode
      setDebugEnabled(false);
      setCurrentLocation(null);
    }
  };

  // Calculate distance on component mount
  useEffect(() => {
    const getDistance = async () => {
      try {
        const distance = await calculateDistance(
          { lat: userLat, lng: userLng },
          { lat, lng }
        );
        setDistanceKm(distance);
      } catch (error) {
        console.error("Error calculating distance:", error);
      }
    };

    getDistance();
  }, [lat, lng, userLat, userLng]);

  // Clean up geolocation watch on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="relative h-full">
      {/* Debug toggle button */}
      <div className="absolute top-2 right-2 z-[1000] flex gap-2">
        <button
          onClick={toggleDebugMode}
          className="bg-white px-2 py-1 rounded shadow text-sm font-mono"
          style={{ opacity: 0.8 }}
        >
          {debugEnabled ? "Disable Debug" : "Enable Debug"}
        </button>
        
        {debugEnabled && (
          <button
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  setCurrentLocation({ lat: latitude, lng: longitude });
                  console.log("Debug: Current location refreshed", { lat: latitude, lng: longitude });
                },
                (error) => {
                  console.error("Debug: Error getting position:", error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
              );
            }}
            className="bg-blue-500 text-white px-2 py-1 rounded shadow text-sm font-mono"
            style={{ opacity: 0.8 }}
          >
            Refresh Location
          </button>
        )}
      </div>

      <MapContainer
        center={destinationPos}
        zoom={13}
        className="w-full"
        style={{ height: "100%", minHeight: "300px" }}
      >
        <MapBounds bounds={bounds} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* 📍 Destination Marker */}
        <Marker position={destinationPos}>
          <Popup>
            <strong>Destination:</strong>
            <br />
            {destination}
          </Popup>
        </Marker>

        {/* 🔴 User Location Marker */}
        <Marker position={userPos} icon={redIcon}>
          <Popup>
            <strong>User Location</strong>
            <br />
            Distance: {distanceKm.toFixed(2)} km
          </Popup>
        </Marker>
        
        {/* 🔵 Debug Current Location Marker */}
        {debugEnabled && currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={blueIcon}>
            <Popup>
              <strong>DEBUG: Current Location</strong>
              <br />
              Lat: {currentLocation.lat.toFixed(6)}
              <br />
              Lng: {currentLocation.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
