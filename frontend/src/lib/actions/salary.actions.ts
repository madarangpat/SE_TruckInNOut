"use server";

import { getSession } from "@/auth/session";

async function getSalaryConfigurations(): Promise<SalConfig[]> {
  const url = `${process.env.DOMAIN}/salary-configurations/`;
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

async function updateSalaryConfiguration(body: BodyInit, id: number) {
  const url = `${process.env.DOMAIN}/salary-configurations/${id}/`; // Using configId in the URL
  const requestOptions: RequestInit = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getSession()?.access!}`,
    },
    body: body,
  };

  try {
    const response = await fetch(url, requestOptions);
    console.log(response);
    if (response.ok) {
      alert("Salary Configuration updated successfully!");
    } else {
      alert("Failed to update Salary Configuration.");
    }
  } catch (error) {
    console.error("Error updating Salary Configuration:", error);
    alert("An error occurred while saving changes.");
  }
}

export { getSalaryConfigurations, updateSalaryConfiguration };
