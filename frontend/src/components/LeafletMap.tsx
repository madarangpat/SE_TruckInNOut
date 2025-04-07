"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

// Fix Leaflet icon paths
delete (L.Icon.Default.prototype as any).getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in kilometers
}

interface LocationPoint {
  lat: number;
  lng: number;
  label: string;
  completed?: boolean;
}

interface Props {
  locations: LocationPoint[];
  userLat: number;
  userLng: number;
  isAdmin: boolean;
  onCityFetched? : (city:string) => void;
}

export default function LeafletMap({
  locations,
  userLat,
  userLng,
  isAdmin,
  onCityFetched,
}: Props) {
  const userPos: [number, number] = [userLat, userLng];
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [nearbyLocation, setNearbyLocation] = useState<string | null>(null);

  let boundsArray: [number, number][] = [
    ...locations.map((loc) => [loc.lat, loc.lng] as [number, number]),
    userPos,
  ];
  if (debugEnabled && currentLocation) {
    boundsArray.push([currentLocation.lat, currentLocation.lng]);
  }
  const bounds: L.LatLngBoundsExpression = boundsArray;


  const toggleDebugMode = () => {
    if (!debugEnabled) {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error getting position:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      setDebugEnabled(true);
    } else {
      setDebugEnabled(false);
      setCurrentLocation(null);
    }
  };

  const fetchNearbyLocation = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
      );
      const data = await response.json();
  
      const result = data.results?.[0];
      const formatted = result?.formatted_address ?? "Unknown Location";
      const city = result?.address_components?.find((comp: any) =>
        comp.types.includes("locality")
      )?.long_name;
  
      console.log("📍 Full address:", formatted);
      console.log("🏙️ City:", city);
  
      setNearbyLocation(formatted);
  
      if (city && typeof onCityFetched === "function") {
        onCityFetched(city);
      }
  
    } catch (error) {
      console.error("❌ Failed to fetch location:", error);
      setNearbyLocation("Failed to fetch location");
    }
  };
  
  

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  useEffect(() => {
    if (userLat && userLng) {
      fetchNearbyLocation(userLat,userLng);
    }
  }, [userLat, userLng]);
  

  return (
    <div className="relative h-full">
      {/* 🔘 Debug Toggle */}
      <div className="absolute top-2 right-2 z-[1000] flex gap-2">
        <button
          onClick={toggleDebugMode}
          className="bg-white px-2 py-1 rounded shadow text-sm font-mono"
          style={{ opacity: 0.8 }}
        >
          {debugEnabled ? "Disable Debug" : "Enable Debug"}
        </button>
      </div>

      <MapContainer
        center={userPos}
        zoom={13}
        className="w-full"
        style={{ height: "100%", minHeight: "300px" }}
      >
        <MapBounds bounds={boundsArray} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* ✅ Destination Markers */}
          {locations.map((loc, idx) => {
          const distance = haversineDistance(userLat, userLng, loc.lat, loc.lng).toFixed(2);
          return (
            <Marker
              key={idx}
              position={[loc.lat, loc.lng]}
              icon={loc.completed ? greenIcon : blueIcon}
            >
              <Popup>
                <strong>{loc.label}</strong>
                <br />
                📍 Distance: {distance} km
              </Popup>
            </Marker>
          );
        })}


        {/* 🔴 User Marker */}
        <Marker position={userPos} icon={redIcon}>
          <Popup>
            <strong>Your Location</strong> <br/>
            {nearbyLocation? (
              <>
              <span>{nearbyLocation}</span>
              </>
            ): (<span>Loading address...</span>)}
          </Popup>
        </Marker>

        {/* 🔵 Debug Marker */}
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
