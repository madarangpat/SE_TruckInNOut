"use server";

import { getSession } from "@/auth/session";


async function getUsers(): Promise<User[]> {
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/users/`;
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
  cellphone_no,
}: {
  userId: string;
  email: string;
  cellphone_no: string | undefined;
}) {
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/users/profile/update/${userId}/`;
  const session = getSession();

  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({
      email,
      cellphone_no,
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
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/users/profile/`;
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
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/employee/upload-profile/`;
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

async function changePassword(currentPassword: string, newPassword: string) {
  const session = await getSession();
  const url = `${process.env.NEXT_PUBLIC_DOMAIN}/change-password/`;

  const requestOptions: RequestInit = {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access}`,
    },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  };

  const res = await fetch(url, requestOptions);

  const text = await res.text();
  if (!res.ok) {
    try {
      const data = JSON.parse(text);
      throw new Error(data.message);
    } catch {
      const data = JSON.parse(text);
      throw new Error(data.message);
    }
  }

  return JSON.parse(text);
}


export { getUsers, getUserProfile, updateUserData, uploadProfilePicture, changePassword };
