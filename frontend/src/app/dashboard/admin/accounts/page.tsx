import React from "react";
import AccountsClient from "./AccountsClient";
import { getUsers } from "@/lib/actions/user.actions";

export default async function AccountsPage() {
  const users = await getUsers()

  return <AccountsClient users={users} /> 
}