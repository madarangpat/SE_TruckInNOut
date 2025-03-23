import React from "react";
import ManagePayrollClient from "./ManagePayrollClient";
import { getSession } from "@/lib/auth";

export default async function ManagePayroll() {
  const session = getSession();
  const url = `${process.env.DOMAIN}/users/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access!}`,
    },
  };

  const response = await fetch(url, requestOptions);
  const users = (await response.json()) as User[];

  return <ManagePayrollClient users={users} />
}