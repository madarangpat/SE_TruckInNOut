import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the type for Vehicle
interface Vehicle {
  vehicle_id: number;
  plate_number: string;
  vehicle_type: string;
  is_company_owned: boolean;
  subcon_name?: string | null;
  trip: number | null;
}

interface VehicleDropdownProps {
  onSelect: (result: {
    vehicle: Vehicle | null;
  }) => void;
}

const VehicleDropdown: React.FC<VehicleDropdownProps> = ({ onSelect }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/vehicles/");
        const data: Vehicle[] = response.data;
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    onSelect({ vehicle: selectedVehicle });
  }, [selectedVehicle, onSelect]);

  const getDisplayLabel = (vehicle: Vehicle) => {
    const ownership = vehicle.is_company_owned
      ? "Company Owned"
      : `Private${vehicle.subcon_name ? ` (Subcon: ${vehicle.subcon_name})` : ""}`;

    return `${vehicle.plate_number} - ${vehicle.vehicle_type} - ${ownership}`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
        className="w-full px-4 py-3 bg-zinc-700/40 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-sm"
      >
        {selectedVehicle ? getDisplayLabel(selectedVehicle) : "Select Vehicle"}
        <span>▼</span>
      </button>

      {vehicleDropdownOpen && (
        <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
          <button
            onClick={() => {
              setSelectedVehicle(null);
              setVehicleDropdownOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
          >
            Select Vehicle
          </button>

          {vehicles.length === 0 ? (
            <div className="w-full text-center px-4 py-2 text-sm">
              No available vehicles
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <button
                key={vehicle.vehicle_id}
                onClick={() => {
                  setSelectedVehicle(vehicle);
                  setVehicleDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
              >
                {getDisplayLabel(vehicle)}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleDropdown;
