"use server";

import { getSession } from "@/auth/session";


async function getUsers(): Promise<User[]> {
  const url = `${process.env.DOMAIN}/users/`;
  const session = getSession();

  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access}`,
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorMessage = await response.text(); // Capture error details
    throw new Error(`Error getting users: ${errorMessage}`);
  }

  const data = await response.json(); // Parse JSON response
  return data; // Return parsed response
}

async function updateUserData({
  userId,
  email,
  cellPhoneNo,
}: {
  userId: string;
  email: string;
  cellPhoneNo: string | undefined;
}) {
  const url = `${process.env.DOMAIN}/users/profile/update/${userId}/`;
  const session = getSession();

  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({
      email,
      cellPhoneNo,
    }), // Remove the extra `{ user }` wrapper
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

async function getUserProfile(): Promise<User> {
  const url = `${process.env.DOMAIN}/users/profile/`;
  const session = getSession();

  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access}`,
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorMessage = await response.text(); // Capture error details
    throw new Error(`Error fetching profile: ${errorMessage}`);
  }

  const data = await response.json() as User; // Parse JSON response
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

export { getUsers, getUserProfile, updateUserData, uploadProfilePicture };
