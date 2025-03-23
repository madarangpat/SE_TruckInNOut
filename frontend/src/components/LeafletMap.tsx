"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon paths
delete (L.Icon.Default.prototype as any).getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  lat: number;
  lng: number;
  destination: string;
}

export default function LeafletMap({ lat, lng, destination }: Props) {
  // ✅ Add the log right here
  console.log("Rendering LeafletMap with:", { lat, lng });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={20}
      className="w-full"
      style={{ height: "100%", minHeight: "300px" }} // <-- force visible height
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lng]}>
        <Popup>
          <strong>Destination:</strong>
          <br />
          {destination}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
