import React from "react";
import EmployeeDataClient from "./EmployeeDataClient";
import { getUsers } from "@/lib/actions/user.actions";

export default async function EmployeeDataPage() {
  const users = await getUsers()

  return <EmployeeDataClient users={users} />;
}
