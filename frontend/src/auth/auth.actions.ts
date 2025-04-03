"use server";

import { jwtDecode } from "jwt-decode";
import {
  createSession,
  deleteSession,
  getSession,
  SessionPayload,
} from "./session";

async function login(
  username: string,
  password: string
): Promise<SessionPayload> {
  const url = `${process.env.DOMAIN}/login/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({ username, password }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`);
  }

  const sessionPayload = (await response.json()) as SessionPayload;
  createSession(sessionPayload);
  return sessionPayload;
}

async function logout() {
  const url = `${process.env.DOMAIN}/logout/`;

  // Blacklists the tokens in the backend

  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({ refresh: getSession()?.refresh }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`Logout failed with status: ${response.status}`);
  }
  // Deletes the cookies stored in the session
  deleteSession();
}

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
  login,
  logout,
  sendResetPasswordLink,
  resetPassword,
  validateResetPasswordLink,
};
