"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddressAutoComplete from "@/components/AddressAutoComplete";
import DriverDropdown from "@/components/DriverDropdown";
import VehicleDropdown from "@/components/VehicleDropdown";
import HelperDropdown from "@/components/HelperDropdown";

interface User {
  username: string;
  employee_type: string;
}

interface Vehicle {
  vehicle_id: number;
  plate_number: string;
  vehicle_type: string;
  is_company_owned: boolean;
  subcon_name?: string;
}

interface Employee {
  employee_id: number;
  user: User;
}

interface GoogelAddress {
  address: string;
  lat: number;
  lng: number;
}

const CreateNewTripPage = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedHelper, setSelectedHelper] = useState<Employee | null>(null);
  const [selectedHelper2, setSelectedHelper2] = useState<Employee | null>(null);

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
    addresses: string[];
    clients: string[];
    distances: string[];
    user_lat: string;
    user_lng: string;
    dest_lat: string[];
    dest_lng: string[]; 
    completed: boolean[];
    multiplier: string;
    base_salary: string;
    additionals: string;
    start_date: string;
    end_date: string;
  }

  const [tripFormData, setTripFormData] = useState<TripFormData>({
    addresses: [""],
    clients: [""],
    distances: [""],
    user_lat: "14.65889",
    user_lng: "121.10419",
    dest_lat: [""],
    dest_lng: [""],
    completed: [false],
    multiplier: "",
    base_salary: "",
    additionals: "",
    start_date: startDate ? startDate.toISOString() : "",
    end_date: endDate ? endDate.toISOString() : "",
  });

  // Then immediately calculate and update the distances
  // if (tripDestinations.length > 0) {
  //   (async () => {
  //     try {
  //       const distances = [""];
  //       let origin = { lat: 14.65889, lng: 121.10419 }; // Starting point

  //       for (const destination of tripDestinations) {
  //         const distance = await calculateDistance(origin, {
  //           lat: destination.lat,
  //           lng: destination.lng,
  //         });
  //         distances.push(distance.toString());
  //         origin = { lat: destination.lat, lng: destination.lng }; // Previous destination becomes new origin
  //       }

  //       setTripFormData((prev) => ({ ...prev, distances }));
  //     } catch (error) {
  //       console.error("Error calculating distances:", error);
  //     }
  //   })();
  // }

  const numOfDrops = tripFormData.addresses.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("Form submitted", { selectedVehicle, selectedEmployee, setSelectedHelper, selectedHelper2 });

    if (!selectedVehicle || !selectedEmployee) {
      setError("Please select both a vehicle and an employee.");
      return;
    }

    // Ensure Helper 1 and Helper 2 are not the same
    if (selectedHelper && selectedHelper2 && selectedHelper.employee_id === selectedHelper2.employee_id) {
      setError("Helper 1 and Helper 2 cannot be the same person.");
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
      addresses: [...tripDestinations.map((dest) => dest.address)],
      clients: tripFormData.clients,
      distances: tripFormData.distances,
      user_lat: tripFormData.user_lat,
      user_lng: tripFormData.user_lng,
      dest_lat: [tripDestinations.map((dest) => dest.lat.toString())],
      dest_lng: [tripDestinations.map((dest) => dest.lng.toString())],
      completed: tripFormData.completed,
      multiplier: tripFormData.multiplier
        ? parseFloat(tripFormData.multiplier)
        : null,
      base_salary: tripFormData.base_salary
        ? parseFloat(tripFormData.base_salary)
        : null,
      additionals: tripFormData.additionals
        ? parseFloat(tripFormData.additionals)
        : null,
        start_date: new Date(tripFormData.start_date).toISOString().split("T")[0],
        end_date: toNullable(tripFormData.end_date)
          ? new Date(tripFormData.end_date).toISOString().split("T")[0]
          : null,
        
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
        user_lat: "14.65889",
        user_lng: "121.10419",
        dest_lat: [""],
        dest_lng: [""],
        completed: [false],
        multiplier: "",
        base_salary: "",
        additionals: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
      });
    } catch (error: any) {
      console.error("API Error:", error.response?.data);
      setError(error.response?.data?.error || "Failed to create trip.");
    }
  };

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
            <VehicleDropdown
              onSelect={({ vehicle }) => setSelectedVehicle(vehicle)}
            />
            <DriverDropdown
              onSelect={({ employee }) => setSelectedEmployee(employee)}
            />
            <HelperDropdown
              onSelect={({ employee }) => setSelectedHelper(employee)}
            />
            <HelperDropdown
              onSelect={({ employee }) => setSelectedHelper2(employee)}
            />           
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
                  const newLat = "14.65889"; // Default value for the first field, empty for others
                  const newLng = "121.10419"; // Default value for the first field, empty for others
                  const newDestLat = index === 1 ? ["14.65889"] : [""];
                  const newDestLng = index === 1 ? ["14.65889"] : [""];

                  setTripFormData({
                    ...tripFormData,
                    addresses: [
                      ...tripDestinations.map((dest) => dest.address),
                      "",
                    ],
                //    distances: [...tripFormData.distances, ""],
                    clients: [...tripFormData.clients, ""],
                    user_lat: newLat,
                    user_lng: newLng,
                    dest_lat: [
                      ...tripDestinations.map((dest) => dest.lat.toString()),
                    ],
                    dest_lng: [
                      ...tripDestinations.map((dest) => dest.lng.toString()),
                    ],
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
                  const newAddresses = tripFormData.addresses.filter((_, i) => i !== index);
                  const newDistances = tripFormData.distances.filter((_, i) => i !== index);
                  const newClients = tripFormData.clients.filter((_, i) => i !== index);
                  const newDestLat = tripFormData.dest_lat.filter((_, i) => i !== index);
                  const newDestLng = tripFormData.dest_lng.filter((_, i) => i !== index);
                  const newCompleted = tripFormData.completed.filter((_, i) => i !== index);

                  setTripFormData({
                    ...tripFormData,
                    addresses: newAddresses,
                    distances: newDistances,
                    clients: newClients,
                    dest_lat: newDestLat,
                    dest_lng: newDestLng,
                    completed: newCompleted,
                  });

                  setTripDestinations((prev) => prev.filter((_, i) => i !== index));
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
        {/*
        /* DISTANCES ARRAY 
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
          */}
        {/* USER LAT ARRAY */}
        <div>
          <h3 className="text-lg font-bold text-black/70">User Latitudes</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="User Latitude"
              className="input-field text-black rounded"
              value={tripFormData.user_lat}
              onChange={(e) =>
                setTripFormData({ ...tripFormData, user_lat: e.target.value })
              }
            />
          </div>

          {/* {tripFormData.user_lat.map((lat, index) => (
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
          ))} */}
        </div>

        {/* USER LNG ARRAY */}
        <div>
          <h3 className="text-lg font-bold text-black/70">User Longitudes</h3>
          {/* {tripFormData.user_lng.map((lng, index) => (
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
          ))} */}

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="User Longitude"
              className="input-field text-black rounded"
              value={tripFormData.user_lng}
              onChange={(e) =>
                setTripFormData({ ...tripFormData, user_lng: e.target.value })
              }
            />
          </div>

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

        {/* Base Salary */}
        <h3 className="text-lg font-bold text-black/70">Base Salary</h3>
        <input
          type="number"
          step="0.01"
          placeholder="Base Salary"
          className="input-field text-black rounded placeholder:text-sm"
          style={{ marginTop: "4px" }}
          value={tripFormData.base_salary}
          onChange={(e) =>
            setTripFormData({ ...tripFormData, base_salary: e.target.value })
          }
        />

        {/* Additionals */}
        <h3 className="text-lg font-bold text-black/70">Additionals</h3>
        <input
          type="number"
          step="0.01"
          placeholder="Additionals"
          className="input-field text-black rounded placeholder:text-sm"
          style={{ marginTop: "4px" }}
          value={tripFormData.additionals}
          onChange={(e) =>
            setTripFormData({ ...tripFormData, additionals: e.target.value })
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
