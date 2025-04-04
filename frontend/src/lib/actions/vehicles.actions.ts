"use server";

import { getSession } from "@/auth/session";

async function getVehicles(): Promise<Vehicle[]> {
  const url = `${process.env.DOMAIN}/vehicles/`;
  const res = await fetch(url, {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSession()?.access}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json();
}

async function deleteVehicleByPlate(plateNumber: string): Promise<boolean> {
  const url = `${process.env.DOMAIN}/delete-vehicle-by-plate/${plateNumber}/`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getSession()?.access}`,
    },
  });

  return res.ok;
}

export { getVehicles, deleteVehicleByPlate };
