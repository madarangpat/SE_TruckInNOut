"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getCoordinatesFromAddress, calculateDistance } from "@/lib/google";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddressAutoComplete from "@/components/AddressAutoComplete";
import { LargeNumberLike } from "crypto";

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

interface GoogelAddress {
  address: string;
  lat: number;
  lng: number;
}

const CreateNewTripPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [employeeDropdownOpen, setEmployeeDropdownOpen] = useState(false);

  const [selectedHelper, setSelectedHelper] = useState<Employee | null>(null);
  const [helperDropdownOpen, setHelperDropdownOpen] = useState(false);
  const [selectedHelper2, setSelectedHelper2] = useState<Employee | null>(null);
  const [helper2DropdownOpen, setHelper2DropdownOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tripDestinations, setTripDestinations] = useState<GoogelAddress[]>([]);

  // Update tripFormData whenever the dates change
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setTripFormData((prevData) => ({
      ...prevData,
      start_date: date ? date.toISOString() : "", // Store as ISO string
    }));
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setTripFormData((prevData) => ({
      ...prevData,
      end_date: date ? date.toISOString() : "", // Store as ISO string
    }));
  };

  interface TripFormData {
    addresses: string[]; // New field for multiple addresses
    clients: string[]; // New field for clients
    distances: string[];
    user_lat: string[]; // New field for multiple latitudes
    user_lng: string[]; // New field for multiple longitudes
    dest_lat: string[]; // New field for destination latitudes
    dest_lng: string[]; // New field for destination longitudes
    completed: boolean[]; // New field for multiple completion statuses
    multiplier: string;
    start_date: string;
    end_date: string;
  }

  const [tripFormData, setTripFormData] = useState<TripFormData>({
    addresses: [""],
    clients: [""],
    distances: [""],
    user_lat: ["14.65889"],
    user_lng: ["121.10419"],
    dest_lat: [""],
    dest_lng: [""],
    completed: [false],
    multiplier: "",
    start_date: startDate ? startDate.toISOString() : "",
    end_date: endDate ? endDate.toISOString() : "",
  });

  const numOfDrops = tripFormData.addresses.length;

  function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of Earth in kilometers
    const toRad = (deg: number) => deg * (Math.PI / 180);

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

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

    const toNullable = (value: string) => (value === "" ? null : value);

    const payload: any = {
      // People Included
      vehicle_id: selectedVehicle.vehicle_id,
      employee_id: selectedEmployee.employee_id,
      helper_id: selectedHelper?.employee_id || null,
      helper2_id: selectedHelper2?.employee_id || null,

      // Arrays
      num_of_drops: numOfDrops,
      addresses: tripFormData.addresses,
      clients: tripFormData.clients,
      distances: tripFormData.distances,
      user_lat: tripFormData.user_lat,
      user_lng: tripFormData.user_lng,
      dest_lat: tripFormData.dest_lat,
      dest_lng: tripFormData.dest_lng,
      completed: tripFormData.completed,
      multiplier: tripFormData.multiplier? parseFloat(tripFormData.multiplier): null,
      start_date: new Date(tripFormData.start_date).toISOString(),
      end_date: toNullable(tripFormData.end_date)? new Date(tripFormData.end_date).toISOString(): null,
    };

    try {
      console.log("payload before POST:", payload);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register-trip/",
        payload
      );
      console.log("API Response:", response);
      setSuccess("Trip successfully created!");

      setTimeout(() => {
        setSuccess(null);
      }, 4000);

      setSelectedVehicle(null);
      setSelectedEmployee(null);
      setTripFormData({   
        addresses: [""],
        clients: [""],
        distances: [""],
        user_lat: ["14.65889"],
        user_lng: ["121.10419"],
        dest_lat: [""],
        dest_lng: [""],
        completed: [false],
        multiplier: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
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
    const delay = setTimeout(async () => {
      try {
        const apiKey = process.env.GOOGLE_API_KEY;

        const updatedDestinations = await Promise.all(
          tripDestinations.map(async (dest) => {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                dest.address
              )}&key=${apiKey}`
            );

            const data = await response.json();
            console.log("Auto-geocode Google response:", data);

            if (!data.results || data.results.length === 0) return dest; // Keep original if no results

            const { lat, lng } = data.results[0].geometry.location;

            return { ...dest, lat, lng }; // Update with lat/lng
          })
        );

        setTripFormData((prev) => ({
          ...prev,
          destinations: updatedDestinations, // Store updated destinations array
        }));
      } catch (err) {
        console.error("Auto-geocoding failed:", err);
      }
    }, 1500);

    return () => clearTimeout(delay);
  }, [tripFormData]);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="wrapper w-full max-w-4xl mx-auto p-6 rounded-2xl bg-black/20 shadow-lg space-y-6"
      >
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
                {selectedVehicle
                  ? `${selectedVehicle.plate_number} (${selectedVehicle.vehicle_type})`
                  : "Select Vehicle"}
                <span>▼</span>
              </button>
              {vehicleDropdownOpen && (
                <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
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
                        {vehicle.plate_number} ({vehicle.vehicle_type})
                      </button>
                    ))
                  )}
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
                {selectedEmployee
                  ? selectedEmployee.user.username
                  : "Select Employee"}
                <span>▼</span>
              </button>
              {employeeDropdownOpen && (
                <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {employees.length === 0 ? (
                    <div className="w-full text-center px-4 py-2 text-sm">No available employees</div>
                  ) : (
                    employees.map((emp) => (
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
                    ))
                  )}
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
                {selectedHelper
                  ? selectedHelper.user.username
                  : "Select Helper (Optional)"}
                <span>▼</span>
              </button>
              {helperDropdownOpen && (
                <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {employees
                    .filter((emp) => emp.employee_type === "Helper") // Filter for employee_type "Helper"
                    .length === 0 ? ( // Check if no helpers available
                    <div className="w-full text-center px-4 py-2 text-sm">No available helpers</div>
                  ) : (
                    employees
                      .filter((emp) => emp.employee_type === "Helper")
                      .map((emp) => (
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
                      ))
                  )}
                </div>
              )}
            </div>

            {/* Helper 2 Dropdown - Show only users with employee_type "Helper" */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setHelperDropdownOpen(!helperDropdownOpen)}
                className="w-full px-4 py-3 bg-zinc-700/40 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-sm"
              >
                {selectedHelper
                  ? selectedHelper.user.username
                  : "Select Second Helper (Optional)"}
                <span>▼</span>
              </button>
              {helperDropdownOpen && (
                <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {employees
                    .filter((emp) => emp.employee_type === "Helper") // Filter for employee_type "Helper"
                    .length === 0 ? ( // Check if no helpers available
                    <div className="w-full text-center px-4 py-2 text-sm">No available helpers</div>
                  ) : (
                    employees
                      .filter((emp) => emp.employee_type === "Helper")
                      .map((emp) => (
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
                      ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Number of Drops (Calculated Automatically) */}
        <h3 className="text-lg font-bold text-black/70">Number of Drops</h3>
        <input
          type="text"
          value={numOfDrops} // Set value to the number of addresses
          readOnly
          className="input-field text-black rounded placeholder:text-sm bg-white"
          style={{ marginTop: "2px" }}
          disabled
        />

        {/* ADDRESS ARRAY */}
        <div>
          <h3 className="w-full text-lg font-bold text-black/70">Address</h3>
          {tripFormData.addresses.map((address, index) => (
            <div key={index} className="flex gap-2">
              <AddressAutoComplete
                onSelect={({ address, lat, lng }) => {
                  setTripDestinations((prev) => {
                    const newDestinations = [...prev];
                    newDestinations[index] = { address, lat, lng };
                    return newDestinations;
                  });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  // Add corresponding entries for other fields when a new address is added
                  const newLat = index === 1 ? ["14.65889"] : [""]; // Default value for the first field, empty for others
                  const newLng = index === 1 ? ["121.10419"] : [""]; // Default value for the first field, empty for others
                  const newDestLat = index === 1 ? ["14.65889"] : [""];
                  const newDestLng = index === 1 ? ["14.65889"] : [""];

                  setTripFormData({
                    ...tripFormData,
                    addresses: [...tripFormData.addresses, ""],
                    distances: [...tripFormData.distances, ""],
                    clients: [...tripFormData.clients, ""],
                    user_lat: [...tripFormData.user_lat, ...newLat],
                    user_lng: [...tripFormData.user_lng, ...newLng],
                    dest_lat: [...tripFormData.dest_lat, ...newDestLat],
                    dest_lng: [...tripFormData.dest_lng, ...newDestLng],
                    completed: [...tripFormData.completed, false],
                  });
                }}
                className="text-green-500"
              >
                <Image
                  src="/plustrip2.png"
                  alt="Add Address"
                  width={20}
                  height={20}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  // Remove corresponding entries for other fields when an address is removed
                  const newAddresses = tripFormData.addresses.filter(
                    (_, i) => i !== index
                  );
                  const newDistances = tripFormData.distances.filter(
                    (_, i) => i !== index
                  );
                  const newClients = tripFormData.clients.filter(
                    (_, i) => i !== index
                  );
                  const newUserLat = tripFormData.user_lat.filter(
                    (_, i) => i !== index
                  );
                  const newUserLng = tripFormData.user_lng.filter(
                    (_, i) => i !== index
                  );
                  const newDestLat = tripFormData.dest_lat.filter(
                    (_, i) => i !== index
                  );
                  const newDestLng = tripFormData.dest_lng.filter(
                    (_, i) => i !== index
                  );
                  const newCompleted = tripFormData.completed.filter(
                    (_, i) => i !== index
                  );

                  setTripFormData({
                    ...tripFormData,
                    addresses: newAddresses,
                    distances: newDistances,
                    clients: newClients,
                    user_lat: newUserLat,
                    user_lng: newUserLng,
                    dest_lat: newDestLat,
                    dest_lng: newDestLng,
                    completed: newCompleted,
                  });
                  setTripDestinations((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
                className="text-red-500"
                disabled={tripFormData.addresses.length === 1}
              >
                <Image src="/remove.png" alt="Remove" width={20} height={20} />
              </button>
            </div>
          ))}
        </div>

        {/* CLIENTS ARRAY */}
        <div>
          <h3 className="text-lg font-bold text-black/70">Clients</h3>
          {tripFormData.clients.map((client, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Client"
                className="input-field text-black rounded"
                value={client}
                onChange={(e) => {
                  const newClients = [...tripFormData.clients];
                  newClients[index] = e.target.value;
                  setTripFormData({ ...tripFormData, clients: newClients });
                }}
              />
            </div>
          ))}
        </div>

        {/* DISTANCES ARRAY */}
        <div>
          <h3 className="text-lg font-bold text-black/70">Distances</h3>
          {tripFormData.distances.map((distance, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="number"
                placeholder="Distance"
                className="input-field text-black rounded placeholder:text-sm"
                value={distance}
                onChange={(e) => {
                  const newDistances = [...tripFormData.distances];
                  newDistances[index] = e.target.value;
                  setTripFormData({ ...tripFormData, distances: newDistances });
                }}
              />             
            </div>
          ))}
        </div>

        {/* USER LAT ARRAY */}
        <div>
          <h3 className="text-lg font-bold text-black/70">User Latitudes</h3>
          {tripFormData.user_lat.map((lat, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="number"
                placeholder="User Latitude"
                className="input-field text-black rounded"
                value={lat}
                onChange={(e) => {
                  const newLatitudes = [...tripFormData.user_lat];
                  newLatitudes[index] = e.target.value;
                  setTripFormData({ ...tripFormData, user_lat: newLatitudes });
                }}
              />
            </div>
          ))}
        </div>

        {/* USER LNG ARRAY */}
        <div>
          <h3 className="text-lg font-bold text-black/70">User Longitudes</h3>
          {tripFormData.user_lng.map((lng, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="number"
                placeholder="User Longitude"
                className="input-field text-black rounded"
                value={lng}
                onChange={(e) => {
                  const newLongitudes = [...tripFormData.user_lng];
                  newLongitudes[index] = e.target.value;
                  setTripFormData({ ...tripFormData, user_lng: newLongitudes });
                }}
              />
            </div>
          ))}
        </div>

        {/* DEST LAT ARRAY */}
        <div>
          <h3 className="text-lg font-bold text-black/70">
            Destination Latitudes
          </h3>
          {tripDestinations.map((tripDestination, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="number"
                placeholder="Destination Latitude"
                className="input-field text-black rounded"
                value={tripDestination.lat}
              />
            </div>
          ))}
        </div>

        {/* DEST LNG ARRAY */}
        <div>
          <h3 className="text-lg font-bold text-black/70">
            Destination Longitudes
          </h3>
          {tripDestinations.map((tripDestination, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="number"
                placeholder="Destination Longitude"
                className="input-field text-black rounded"
                value={tripDestination.lng}
              />              
            </div>
          ))}
        </div>

        {/* COMPLETED ARRAY */}
        <div>
          <h3 className="text-lg font-bold text-black/70">Completion Status</h3>
          {tripFormData.completed.map((status, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="checkbox"
                checked={status}
                onChange={() => {
                  const newCompleted = [...tripFormData.completed];
                  newCompleted[index] = !status;
                  setTripFormData({ ...tripFormData, completed: newCompleted });
                }}
              />             
            </div>
          ))}
        </div>

        {/* MULTIPLIER */}
        <h3 className="text-lg font-bold text-black/70">Multiplier</h3>
        <input
          type="number"
          step="0.01"
          placeholder="Multiplier"
          className="input-field text-black rounded placeholder:text-sm"
          style={{ marginTop: "4px" }}
          value={tripFormData.multiplier}
          onChange={(e) =>
            setTripFormData({ ...tripFormData, multiplier: e.target.value })
          }
        />

        {/* START DATE & END DATE */}
        <div className="flex gap-4 mb-4">
          {/* Start Date */}
          <div className="w-1/2">
            <label className="block text-sm text-black mb-1 font-bold">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select start date"
              className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
              calendarClassName="rounded-lg"
            />
          </div>

          {/* End Date */}
          <div className="w-1/2">
            <label className="block text-sm text-black mb-1 font-bold">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="MMMM d, yyyy"
              placeholderText="Select end date"
              minDate={startDate || undefined}
              className="w-full px-4 py-2 rounded-md shadow-md text-black cursor-pointer bg-white"
              calendarClassName="rounded-lg"
            />
          </div>
        </div>

        {/* Confirm and Clear Address Buttons */}
        {/* <div className="flex justify-start space-x-4">
          <button
            type="button"
            className="bg-[#668743] text-white px-6 py-2 rounded-lg hover:bg-[#345216] transition-all min-w-[160px] text-center"
          >
            Calculate Distance
          </button>
        </div> */}

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
