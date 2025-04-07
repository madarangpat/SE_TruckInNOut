import { getSession } from "@/auth/session";

export async function getEmployeeProfile(): Promise<Employee> {
  const session = await getSession();

  const res = await fetch(`${process.env.DOMAIN}/employees/profile/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch employee profile: ${error}`);
  }

  const data = await res.json();
  return data; // 🔄 This should match your EmployeeSerializer structure
}