import { getSession } from "@/auth/session";

export async function getEmployeeProfile(): Promise<Employee> {
  const session = getSession();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/employees/profile/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch employee profile: ${error}`);
  }

  const data = await res.json();
  return data; // 🔄 This should match your EmployeeSerializer structure
}

export async function getEmployeeTripSalaries(
  params: string,
): Promise<EmployeeTripSalary[]> {
  const session = getSession();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/employee-trip-salaries/?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch employee trip salaryies: ${error}`);
  }

  const data = await res.json();
  return data ?? [];
}
