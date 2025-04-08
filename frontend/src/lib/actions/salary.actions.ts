"use server";

import { getSession } from "@/auth/session";

async function getSalaryConfigurations(): Promise<SalConfig[]> {
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/salary-configurations/`;
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
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/salary-configurations/${id}/`;
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
    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, message: data.detail || "Update failed" };
    }
  } catch (error: any) {
    console.error("Error updating Salary Configuration:", error);
    return { success: false, message: error.message };
  }
}

export { getSalaryConfigurations, updateSalaryConfiguration };
