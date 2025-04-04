import React from "react";
import { getUsers } from "@/lib/actions/user.actions";
import DeleteAccountClient from "./DeleteAccountClient";

export default async function DeleteAccountPage() {
  const users = await getUsers();
  return <DeleteAccountClient users={users} />;
}