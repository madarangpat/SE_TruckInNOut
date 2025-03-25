"use server";

import { getSession } from "../auth";

async function getAssignedTrip() {
  const url = `${process.env.DOMAIN}/trips/assigned/`;
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

async function acceptTrip(tripId: number) {
  const url = `${process.env.DOMAIN}/trips/${tripId}/accept/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSession()?.access}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to accept trip: ${res.status}`);
  }

  return res.status === 204 ? true : await res.json();
}

async function declineTrip(tripId: number) {
  const url = `${process.env.DOMAIN}/trips/${tripId}/decline/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSession()?.access}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to decline trip: ${res.status}`);
  }

  return res.status === 204 ? true : await res.json();
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

export { getAssignedTrip, getRecentTrips, getOngoingTrips, acceptTrip, declineTrip };



