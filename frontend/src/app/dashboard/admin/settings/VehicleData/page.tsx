import React from "react";
import VehicleDataClient from "./VehicleDataClient";
import { getSession } from "@/lib/auth";

export default async function VehicleDataPage() {
  const session = await getSession();
  const url = `${process.env.DOMAIN}/vehicles/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access!}`,
    },
  };

  const response = await fetch(url, requestOptions);
  const vehicles = (await response.json()) as Vehicle[];
  console.log(vehicles)

  return <VehicleDataClient vehicles={vehicles} />;
}
