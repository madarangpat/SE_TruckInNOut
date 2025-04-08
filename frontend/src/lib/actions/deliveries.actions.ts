"use server";

import { getSession } from "@/auth/session";

async function getRecentTrips() {
  const url = `${process.env.DOMAIN}/trips/recent/`;
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


async function getOngoingTrips() {
  const url = `${process.env.DOMAIN}/trips/ongoing/`; 
  const res = await fetch(url, {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSession()?.access}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ongoing trips: ${res.status}`);
  }

  return res.json();
}

async function updateCompletedStatus(tripId: number, completed: boolean[]) {
  const session = await getSession();
  const token = session?.access;

  if (!token) {
    throw new Error("Unauthorized: No access token found");
  }

  const url = `${process.env.DOMAIN}/trips/update-completed/`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trip_id: tripId,
      completed: completed,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Update failed:", errorData);
    throw new Error(`Failed to update completion status: ${res.status}`);
  }

  return res.json();
}

export { getRecentTrips, getOngoingTrips, updateCompletedStatus };





