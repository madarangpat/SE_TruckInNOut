"use server";

import { getSession } from "./auth";

async function sendResetPasswordLink(email: string) {
  const url = `${process.env.DOMAIN}/password-reset/`;

  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({ email }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error("An error occurred while sending the reset password link.");
  }
}

async function resetPassword(
  newPassword: string,
  confirmPassword: string,
  token: string
) {
  const url = `${process.env.DOMAIN}/password-reset-confirm/${token}/`;

  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({
      new_password: newPassword,
      confirm_password: confirmPassword,
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error("An error occurred while resetting the password.");
  }
}

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

async function validateResetPasswordLink(token: string) {
  const url = `${process.env.DOMAIN}/password-reset/validate/`;

  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ token }),
    headers: {
      "Content-Type": "application/json",
    }
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    // Return an error object instead of throwing
    return {
      errors: {
        error: "An error occurred while validating the reset password link."
      }
    };
  }

  // Parse and return the response data
  const data = await response.json();
  return data;
}

export {
  sendResetPasswordLink,
  resetPassword,
  updateUserData,
  uploadProfilePicture,
  validateResetPasswordLink,
};
