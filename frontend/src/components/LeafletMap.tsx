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
}

export default function LeafletMap({
  locations,
  userLat,
  userLng,
  isAdmin,
}: Props) {
  const userPos: [number, number] = [userLat, userLng];
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

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
        {locations.map((loc, idx) => (
          <Marker
            key={idx}
            position={[loc.lat, loc.lng]}
            icon={loc.completed ? greenIcon : blueIcon}
          >
            <Popup>
              <strong>{loc.label}</strong>
              <br />
              
            </Popup>
          </Marker>
        ))}

        {/* 🔴 User Marker */}
        <Marker position={userPos} icon={redIcon}>
          <Popup>
            <strong>Your Location</strong>
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
