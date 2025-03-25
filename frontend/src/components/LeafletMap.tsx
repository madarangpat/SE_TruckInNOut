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

// 🔴 Custom red icon
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
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

export default function LeafletMap({ lat, lng, destination, userLat, userLng, isAdmin }: Props) {
  const [userCoords, setUserCoords] = useState({lat:userLat,lng:userLng});
  const destinationPos: [number, number] = [lat, lng];
  const currentPos: [number, number] = [userCoords.lat, userCoords.lng];
  const bounds: L.LatLngBoundsExpression = [destinationPos, currentPos];

  const [landmark, setLandmark] = useState<string>("");

  // Calculate straight-line distance
  function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const distanceKm = haversineDistance(userCoords.lat, userCoords.lng, lat, lng);

  // 🔍 Reverse geocode for current position
  useEffect(() => {
    const fetchLandmark = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${userCoords.lat}+${userCoords.lng}&key=${apiKey}`
        );
        const data = await res.json();
        const result = data.results?.[0];
        const name =
          result?.components?.building ||
          result?.components?.neighbourhood ||
          result?.components?.suburb ||
          result?.components?.road ||
          result?.formatted ||
          "Unknown location";

        setLandmark(name);
      } catch (err) {
        console.error("Failed to reverse geocode:", err);
        setLandmark("Unknown");
      }
    };

    fetchLandmark();
  }, [userCoords.lat, userCoords.lng]);

  useEffect(() => {
    // if (isAdmin) return; // 🔒 Don't track location for admins
  
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported by this browser.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
  
        // 🔁 Update backend
        try {
          await fetch("/api/update-location", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_latitude: latitude,
              user_longitude: longitude,
            }),
          });
        } catch (err) {
          console.error("Failed to update location in backend:", err);
        }
      },
      (err) => {
        console.error("Failed to get user location:", err);
      }
    );
  }, [isAdmin]); // 👈 re-run if isAdmin changes
  
  return (
    <MapContainer
      center={destinationPos}
      zoom={13}
      className="w-full"
      style={{ height: "100%", minHeight: "300px" }}
    >
      <MapBounds bounds={bounds} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* 📍 Destination Marker */}
      <Marker position={destinationPos}>
        <Popup>
          <strong>Destination:</strong>
          <br />
          {destination}
        </Popup>
      </Marker>

      {/* 🔴 Current Location Marker with Landmark */}
      <Marker position={currentPos} icon={redIcon}>
        <Popup>
          <strong>Current Location:</strong>
          <br />
          {landmark}
          <br />
          Distance: {distanceKm.toFixed(2)} km
        </Popup>
      </Marker>
    </MapContainer>
  );
}
