// auth/currentEmployee.ts
import { cache } from "react";
import { getSession } from "./session";

export const getCurrentEmployee = cache(async () => {
  const session = getSession();

  if (!session?.access) {
    return null;
  }

  const res = await fetch(`${process.env.DOMAIN}/employees/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("❌ Failed to fetch employee:", await res.text());
    return null;
  }

  return await res.json(); // 👈 this will be your full employee object
});
