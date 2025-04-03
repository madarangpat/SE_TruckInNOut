import React from "react";
import VehicleDataClient from "./VehicleDataClient";
import { getVehicles } from "@/lib/actions/vehicles.actions";

export default async function VehicleDataPage() {
  const vehicles = await getVehicles()


  return <VehicleDataClient vehicles={vehicles} />;
}
