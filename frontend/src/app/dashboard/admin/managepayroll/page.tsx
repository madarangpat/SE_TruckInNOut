// import React from "react";
// import ManagePayrollClient from "./ManagePayrollClient";
// import { getSession } from "@/lib/auth";
// import { getUsers } from "@/lib/actions/user.actions";

// export default async function ManagePayroll() {
//   const users = await getUsers();

//   return <ManagePayrollClient users={users} />;
// }



import React from "react";
import ManagePayrollClient from "./ManagePayrollClient";
import { getSession } from "@/lib/auth";
import { getUsers } from "@/lib/actions/user.actions";

export default async function ManagePayroll() {
  try {
    const session = await getSession();
    const users = await getUsers();

    if (!session) {
      // Handle unauthenticated access
      return <div>You need to be logged in to view this page.</div>;
    }

    return <ManagePayrollClient users={users} />;
  } catch (error) {
    console.error("Error fetching users or session", error);
    return <div>Error loading data. Please try again later.</div>;
  }
}
