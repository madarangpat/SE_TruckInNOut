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

export { getVehicles };
