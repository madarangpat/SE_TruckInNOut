"use server";

import { getSession } from "../auth";

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

async function validateResetPasswordLink(token: string) {
  const url = `${process.env.DOMAIN}/password-reset/validate/`;

  const requestOptions: RequestInit = {
    cache: "no-store",
    method: "POST",
    body: JSON.stringify({ token }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    // Return an error object instead of throwing
    return {
      errors: {
        error: "An error occurred while validating the reset password link.",
      },
    };
  }

  // Parse and return the response data
  const data = await response.json();
  return data;
}

export {
  sendResetPasswordLink,
  resetPassword,
  validateResetPasswordLink,
};