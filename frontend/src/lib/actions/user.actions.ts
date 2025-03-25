"use server"

import { getSession } from "../auth";

async function updateUserData(user: User) {
  const url = `${process.env.DOMAIN}/users/profile/update/`;
  const session = getSession();

  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify(user), // Remove the extra `{ user }` wrapper
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access}`,
    },
  };

  const response = await fetch(url, requestOptions);
  console.log("session access:", session?.access);

  if (!response.ok) {
    const errorMessage = await response.text(); // Capture error details
    throw new Error(`Error updating user: ${errorMessage}`);
  }

  const data = await response.json(); // Parse JSON response
  return data; // Return parsed response
}

async function uploadProfilePicture(formData: FormData) {
  const url = `${process.env.DOMAIN}/employee/upload-profile/`;
  const session = getSession();

  const requestOptions: RequestInit = {
    cache: "no-store",
    body: formData,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.access}`,
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorMessage = await response.text(); // Capture error details
    throw new Error(`Error uploading profile picture: ${errorMessage}`);
  }

  const data = await response.json(); // Parse JSON response
  return data; // Return parsed response
}

export { updateUserData, uploadProfilePicture };