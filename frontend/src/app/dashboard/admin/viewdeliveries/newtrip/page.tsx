"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  username: string;
}

interface Vehicle {
  vehicle_id: number;
  plate_number: string;
  vehicle_type: string;
  trip: number | null;
}

interface Employee {
  employee_id: number;
  user: User;
  employee_type: string;
}

const CreateNewTripPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);

  const [selectedHelper, setSelectedHelper] = useState<Employee | null>(null);
  const [helperDropdownOpen, setHelperDropdownOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const [tripFormData, setTripFormData] = useState({
    street_number: "",
    street_name: "",
    barangay: "",
    city: "",
    postal_code: "",
    province: "",
    region: "",
    country: "Philippines",
    destination: "",
    distance: "",
    num_of_drops: "",
    curr_drops: "0",
    client_info: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "", 
    user_latitude: "14.65889",
    user_longitude: "121.10419",
    destination_latitude: "",
    destination_longitude: "",
  });

  function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in kilometers
    const toRad = (deg: number) => deg * (Math.PI / 180);
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // returns distance in km
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    if (!selectedVehicle || !selectedEmployee) {
      setError("Please select both a vehicle and an employee.");
      return;
    }
  
    const fullDestination = [
      tripFormData.street_number,
      tripFormData.street_name,
      tripFormData.barangay,
      tripFormData.city,
      tripFormData.postal_code,
      tripFormData.province,
      tripFormData.region,
      tripFormData.country,
    ]
      .filter(Boolean)
      .join(", ");
  
    const toNullable = (value: string) => value === "" ? null : value;
  
    const payload: any = {
      vehicle_id: selectedVehicle.vehicle_id,
      employee_id: selectedEmployee.employee_id,
      helper_id: selectedHelper?.employee_id || null,
    
      street_number: toNullable(tripFormData.street_number),
      street_name: toNullable(tripFormData.street_name),
      barangay: toNullable(tripFormData.barangay),
      city: toNullable(tripFormData.city),
      postal_code: toNullable(tripFormData.postal_code),
    
      province: toNullable(tripFormData.province),
      region: toNullable(tripFormData.region),
      country: tripFormData.country,
    
      destination: fullDestination,
      distance_traveled: tripFormData.distance ? parseFloat(tripFormData.distance) : null,
      num_of_drops: tripFormData.num_of_drops ? parseInt(tripFormData.num_of_drops) : null,  // ✅ fixed key
      curr_drops: tripFormData.curr_drops,
    
      client_info: toNullable(tripFormData.client_info), // ✅ fixed key
      start_date: new Date(tripFormData.start_date).toISOString(),
      end_date: toNullable(tripFormData.end_date)
        ? new Date(tripFormData.end_date).toISOString()
        : null,
    
      user_latitude: toNullable(tripFormData.user_latitude),
      user_longitude: toNullable(tripFormData.user_longitude),
      destination_latitude: toNullable(tripFormData.destination_latitude),
      destination_longitude: toNullable(tripFormData.destination_longitude),
    };
    
  
    try {
      console.log("payload before POST:", payload);
      const response = await axios.post("http://127.0.0.1:8000/api/register-trip/", payload);
      console.log("API Response:", response);
      setSuccess("Trip successfully created!");

      setTimeout(() => {
        setSuccess(null);
      }, 4000);
  
      setSelectedVehicle(null);
      setSelectedEmployee(null);
      setTripFormData({
        street_number: "",
        street_name: "",
        barangay: "",
        city: "",
        province: "",
        postal_code:"",
        region: "",
        country: "Philippines",
        destination: "",
        distance: "",
        num_of_drops: "",
        curr_drops: "0",
        client_info: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        user_latitude: "14.65889",
        user_longitude: "121.10419",
        destination_latitude: "",
        destination_longitude: "",
      });
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      setError(error.response?.data?.error || "Failed to create trip.");
    }
  };
  

  useEffect(() => {
    // Fetch vehicles from Django API
    fetch("http://localhost:8000/api/vehicles/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched vehicles:", data);
        if (Array.isArray(data)) {
          setVehicles(data);
        } else {
          console.error("API response is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching vehicles:", error));
    
    // Fetch employees from Django API
    fetch("http://localhost:8000/api/employees/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched employees:", data);
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          console.error("API response is not an array:", data);
        }
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  useEffect(() => {
    const {
      street_number,
      street_name,
      barangay,
      city,
      postal_code,
      province,
      region,
      country,
    } = tripFormData;
  
    const fullDestination = [
      street_number,
      street_name,
      barangay,
      city,
      postal_code,
      province,
      region,
      country,
    ]
      .filter(Boolean)
      .join(", ");
  
    if ([street_name, city, province].some((v) => v.trim() === "")) return;
  
    const delay = setTimeout(async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullDestination)}&key=${apiKey}`
        );
  
        const data = await response.json();
        console.log("Auto-geocode OpenCage response:", data);
  
        if (!data.results || data.results.length === 0) return;
  
        const { lat, lng } = data.results[0].geometry;
  
        setTripFormData((prev) => ({
          ...prev,
          destination: fullDestination,
          destination_latitude: lat,
          destination_longitude: lng,
        }));
      } catch (err) {
        console.error("Auto-geocoding failed:", err);
      }
    }, 1500); // wait for 1.5s after typing stops
  
    return () => clearTimeout(delay);
  }, [tripFormData]);
  
  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8">      
      <form onSubmit={handleSubmit} className="wrapper w-full max-w-4xl mx-auto p-6 rounded-2xl bg-black/20 shadow-lg space-y-6">
        <div className="flex items-center gap-2 mx-3">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-black/60 tracking-[0.2em]">
            Create New Trip
          </h2>
          <Image
            src="/road.png"
            alt="Road Icon"
            width={50}
            height={50}
            className="opacity-60 translate-y-1"
          />
        </div>

        {/* Selection */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-black/70">Selection</h3>
          <div className="space-y-3">           
            {/* Vehicle Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setVehicleDropdownOpen(!vehicleDropdownOpen)}
                className="w-full px-4 py-3 bg-zinc-700/40 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-sm"
              >
                {selectedVehicle ? `${selectedVehicle.plate_number} (${selectedVehicle.vehicle_type})` : "Select Vehicle"}
                <span>▼</span>
              </button>
              {vehicleDropdownOpen && (
                <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle.vehicle_id}
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setVehicleDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
                    >
                      {vehicle.plate_number} ({vehicle.vehicle_type})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Employee Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setEmployeeDropdownOpen(!employeeDropdownOpen)}
                className="w-full px-4 py-3 bg-zinc-700/40 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-sm"
              >
                {selectedEmployee ? selectedEmployee.user.username : "Select Employee"}
                <span>▼</span>
              </button>
              {employeeDropdownOpen && (
                <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {employees.map((emp) => (
                    <button
                      key={emp.employee_id}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setEmployeeDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
                    >
                      {emp.user.username}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Helper Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setHelperDropdownOpen(!helperDropdownOpen)}
                className="w-full px-4 py-3 bg-zinc-700/40 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-sm"
              >
                {selectedHelper ? selectedHelper.user.username : "Select Helper (Optional)"}
                <span>▼</span>
              </button>
              {helperDropdownOpen && (
                <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {employees.map((emp) => (
                    <button
                      key={emp.employee_id}
                      onClick={() => {
                        setSelectedHelper(emp);
                        setHelperDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
                    >
                      {emp.user.username}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-black/70">Address Destination</h3>
          <div className="grid grid-cols-2 gap-3">            
            {["street_number", "street_name", "barangay", "city", "postal_code", "province", "region", "country", "destination"].map((field) => {
              const isDestination = field === "destination";
              return isDestination ? (
                <div
                  key={field}
                  className="input-field text-black rounded bg-white px-3 py-2 overflow-x-auto whitespace-nowrap scrollbar-thin border border-gray-300"
                  style={{ minHeight: "2.5rem" }}
                >
                  {tripFormData.destination}
                </div>
              ) : (
                field === "region" ? (
                  <select
                    key="region"
                    value={tripFormData.region}
                    onChange={(e) => setTripFormData({ ...tripFormData, region: e.target.value })}
                    className="input-field text-black rounded"
                  >
                    <option value="">Select Region</option>
                    <option value="Region I">Region I – Ilocos Region</option>
                    <option value="Region II">Region II – Cagayan Valley</option>
                    <option value="Region III">Region III – Central Luzon</option>
                    <option value="Region IV‑A">Region IV‑A – CALABARZON</option>
                    <option value="MIMAROPA">MIMAROPA Region</option>
                    <option value="Region V">Region V – Bicol Region</option>
                    <option value="Region VI">Region VI – Western Visayas</option>
                    <option value="Region VII">Region VII – Central Visayas</option>
                    <option value="Region VIII">Region VIII – Eastern Visayas</option>
                    <option value="Region IX">Region IX – Zamboanga Peninsula</option>
                    <option value="Region X">Region X – Northern Mindanao</option>
                    <option value="Region XI">Region XI – Davao Region</option>
                    <option value="Region XII">Region XII – SOCCSKSARGEN</option>
                    <option value="Region XIII">Region XIII – Caraga</option>
                    <option value="NCR">NCR – National Capital Region</option>
                    <option value="CAR">CAR – Cordillera Administrative Region</option>
                    <option value="BARMM">BARMM – Bangsamoro Autonomous Region in Muslim Mindanao</option>
                    <option value="NIR">NIR – Negros Island Region</option>
                  </select>
                ) : (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    className="input-field text-black rounded"
                    value={(tripFormData as any)[field]}
                    onChange={(e) => setTripFormData({ ...tripFormData, [field]: e.target.value })}
                    readOnly={field === "country"}
                  />
                )
              );
            })}
          </div>
        </div>

        {/* Confirm and Clear Address Buttons */}
        <div className="flex justify-start space-x-4">
          <button
            type="button"
            className="bg-[#668743] text-white px-6 py-2 rounded-lg hover:bg-[#345216] transition-all min-w-[160px] text-center"
            onClick={async () => {
              const fullDestination = [
                tripFormData.street_number,
                tripFormData.street_name,
                tripFormData.barangay,
                tripFormData.city,
                tripFormData.postal_code,
                tripFormData.province,
                tripFormData.region,
                tripFormData.country,
              ]
                .filter(Boolean)
                .join(", ");
            
              console.log("Confirm Address clicked. Destination:", fullDestination);
            
              try {
                const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
                const response = await fetch(
                  `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullDestination)}&key=${apiKey}`
                );
            
                const data = await response.json();
                console.log("OpenCage response:", data);
            
                if (!data.results || data.results.length === 0) {
                  setError("Location not found.");
                  return;
                }
            
                const { lat, lng } = data.results[0].geometry;
            
                const distanceKm = haversineDistance(
                  parseFloat(tripFormData.user_latitude||"0"),
                  parseFloat(tripFormData.user_longitude || "0"),
                  lat,
                  lng
                );

                setTripFormData((prev) => ({
                  ...prev,
                  destination: fullDestination,
                  destination_latitude: lat,
                  destination_longitude: lng,
                  distance: distanceKm.toFixed(2)
                }));

                console.log("Distance set in form:", distanceKm.toFixed(2));
            
                setError(null);
              } catch (err) {
                console.error("Geocoding error:", err);
                setError("Failed to get coordinates from OpenCage.");
              }
            }}            
          >
            Calculate Distance
          </button>

          <button
            type="button"
            className="bg-[#668743] text-white px-6 py-2 rounded-lg hover:bg-[#345216] transition-all min-w-[160px] text-center"
            onClick={() => {
              setTripFormData((prev) => ({
                ...prev,
                street_number: "",
                street_name: "",
                barangay: "",
                city: "",
                postal_code: "",
                province: "",
                region: "",
                country: "Philippines",
                destination: "",
              }));
            }}
          >
            Clear Address
          </button>
        </div>

        {/* Trip Details */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-black/70">Trip Details</h3>
          <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Distance Traveled"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.distance}
            onChange={(e) => setTripFormData({ ...tripFormData, distance: e.target.value })}
          />

          <input
            type="number"
            placeholder="Num of Drops"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.num_of_drops}
            onChange={(e) => setTripFormData({ ...tripFormData, num_of_drops: e.target.value })}
          />

          <input
            type="number"
            placeholder="Curr Drops"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.curr_drops}
            readOnly
          />

          <input
            type="text"
            placeholder="Client Info"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.client_info}
            onChange={(e) => setTripFormData({ ...tripFormData, client_info: e.target.value })}
          />

          <input
            type="date"
            placeholder="Start Date"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.start_date}
            readOnly
          />

          <input
            type="date"
            placeholder="End Date"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.end_date}
            onChange={(e) => setTripFormData({ ...tripFormData, end_date: e.target.value })}
          />

          <input
            type="number"
            placeholder="User Latitude"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.user_latitude}
            onChange={(e) => setTripFormData({ ...tripFormData, user_latitude: e.target.value })}
          />

          <input
            type="number"
            placeholder="User Longitude"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.user_longitude}
            onChange={(e) => setTripFormData({ ...tripFormData, user_longitude: e.target.value })}
          />

          <input
            type="number"
            placeholder="Destination Latitude"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.destination_latitude}
            onChange={(e) => setTripFormData({ ...tripFormData, destination_latitude: e.target.value })}
          />

          <input
            type="number"
            placeholder="Destination Longitude"
            className="input-field text-black rounded placeholder:text-sm"
            value={tripFormData.destination_longitude}
            onChange={(e) => setTripFormData({ ...tripFormData, destination_longitude: e.target.value })}
          />
          </div>
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            className="bg-[#668743] text-white px-6 py-2 rounded-lg hover:bg-[#345216] transition-all min-w-[160px] text-center mt-2"
            onClick={() => {
              setTripFormData((prev) => ({
                ...prev,
                distance: "",
                numdrops: "",
                curr_drops: "0",
                client_information: "",
                start_date: new Date().toISOString().split("T")[0],
                end_date: "",
                // user_latitude: "",
                // user_longitude: "",
                destination_latitude: "",
                destination_longitude: ""
              }));
            }}
          >
            Clear Details
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#668743] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#345216]"
        >
          Confirm Trip
        </button>
        <button
            type="button"
            onClick={() => router.push("/dashboard/admin/viewdeliveries")}
            className="mb-4 self-start bg-[#668743] hover:bg-[#345216] text-white px-4 py-2 rounded-lg transition"
          >
            ← Back to Deliveries
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">{success}</p>}
      </form>
    </div>
  );
};

export default CreateNewTripPage;
