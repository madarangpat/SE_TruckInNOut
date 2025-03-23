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
    province: "",
    region: "",
    country: "Philippines",
    destination: "",
    distance: "",
    numdrops: "",
    curr_drops: "0",
    client_information: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "", 
    user_latitude: "",
    user_longitude: "",
    destination_latitude: "",
    destination_longitude: "",
  });

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
      province: toNullable(tripFormData.province),
      region: toNullable(tripFormData.region),
      country: tripFormData.country, // ✅ predefined
  
      destination: fullDestination,
      distance_traveled: toNullable(tripFormData.distance),
      num_of_drops: toNullable(tripFormData.numdrops),
      curr_drops: tripFormData.curr_drops, // ✅ predefined
  
      client_info: toNullable(tripFormData.client_information),
      start_date: new Date(tripFormData.start_date).toISOString(), // ✅ predefined
      end_date: toNullable(tripFormData.end_date)
        ? new Date(tripFormData.end_date).toISOString()
        : null,
  
      user_latitude: toNullable(tripFormData.user_latitude),
      user_longitude: toNullable(tripFormData.user_longitude),
      destination_latitude: toNullable(tripFormData.destination_latitude),
      destination_longitude: toNullable(tripFormData.destination_longitude),
    };
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register-trip/", payload);
      console.log("API Response:", response);
      setSuccess("Trip successfully created!");
  
      setSelectedVehicle(null);
      setSelectedEmployee(null);
      setTripFormData({
        street_number: "",
        street_name: "",
        barangay: "",
        city: "",
        province: "",
        region: "",
        country: "Philippines",
        destination: "",
        distance: "",
        numdrops: "",
        curr_drops: "0",
        client_information: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        user_latitude: "",
        user_longitude: "",
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
            {[{
              label: "Select Vehicle",
              list: vehicles,
              selected: selectedVehicle,
              setSelected: setSelectedVehicle,
              open: vehicleDropdownOpen,
              setOpen: setVehicleDropdownOpen,
              labelFn: (v: Vehicle) => `${v.plate_number} (${v.vehicle_type})`,
            }, {
              label: "Select Employee",
              list: employees,
              selected: selectedEmployee,
              setSelected: setSelectedEmployee,
              open: employeeDropdownOpen,
              setOpen: setEmployeeDropdownOpen,
              labelFn: (e: Employee) => e.user.username,
            }, {
              label: "Select Helper (Optional)",
              list: employees,
              selected: selectedHelper,
              setSelected: setSelectedHelper,
              open: helperDropdownOpen,
              setOpen: setHelperDropdownOpen,
              labelFn: (e: Employee) => e.user.username,
            }].map(({ label, list, selected, setSelected, open, setOpen, labelFn }, idx) => (
              <div key={idx} className="relative">
                <button
                  type="button"
                  onClick={() => setOpen(!open)}
                  className="w-full px-4 py-3 bg-zinc-700/40 text-white rounded-lg flex justify-between items-center hover:bg-black/40 shadow-md uppercase tracking-widest text-sm"
                >
                  {selected ? labelFn(selected) : label}
                  <span>▼</span>
                </button>
                {open && (
                  <div className="absolute w-full bg-zinc-600 text-white mt-1 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {list.map((item: any) => (
                      <button
                        key={item.employee_id || item.vehicle_id}
                        onClick={() => {
                          setSelected(item);
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-black/40 uppercase tracking-widest text-sm"
                      >
                        {labelFn(item)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-bold mb-2 text-black/70">Address Destination</h3>
          <div className="grid grid-cols-2 gap-3">            
            {["street_number", "street_name", "barangay", "city", "province", "region", "country", "destination"].map((field) => {
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
                <input
                  key={field}
                  type="text"
                  placeholder={field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  className="input-field text-black rounded"
                  value={(tripFormData as any)[field]}
                  onChange={(e) => setTripFormData({ ...tripFormData, [field]: e.target.value })}
                  readOnly={field === "country"}
                />
              );
            })}
          </div>
        </div>

        {/* Confirm and Clear Address Buttons */}
        <div className="flex justify-start space-x-4">
          <button
            type="button"
            className="bg-[#668743] text-white px-6 py-2 rounded-lg hover:bg-[#345216] transition-all min-w-[160px] text-center"
            onClick={() => {
              const fullDestination = [
                tripFormData.street_number,
                tripFormData.street_name,
                tripFormData.barangay,
                tripFormData.city,
                tripFormData.province,
                tripFormData.region,
                tripFormData.country,
              ]
                .filter(Boolean)
                .join(", ");

              setTripFormData((prev) => ({ ...prev, destination: fullDestination }));
            }}
          >
            Confirm Address
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
            {["distance", "numdrops", "curr_drops", "client_information", "start_date", "end_date", "user_latitude", "user_longitude", "destination_latitude", "destination_longitude"].map((field) => (
              <input
                key={field}
                type={field.includes("date") ? "date" : field.includes("latitude") || field.includes("longitude") || field.includes("distance") ? "number" : "text"}
                placeholder={field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                className="input-field text-black rounded placeholder:text-sm"
                value={(tripFormData as any)[field]}
                onChange={(e) => setTripFormData({ ...tripFormData, [field]: e.target.value })}
                readOnly={field === "start_date" || field === "curr_drops"}
              />
            ))}
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
              user_latitude: "",
              user_longitude: "",
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
