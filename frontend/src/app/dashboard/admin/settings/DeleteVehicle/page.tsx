import React from "react";
import { getVehicles } from "@/lib/actions/vehicles.actions";
import DeleteVehicleClient from "./DeleteVehicleClient";

export default async function DeleteVehiclePage() {
  const vehicles = await getVehicles();
  return <DeleteVehicleClient vehicles={vehicles} />;
}
