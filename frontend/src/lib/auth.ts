"use server";

import { cookies } from "next/headers";

async function login(username: string, password: string) {
  const url = `${process.env.DOMAIN}/token/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({ username, password }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();
    console.log("server side: ", data);

    // Check if both tokens exist in the response
    if (data && data.access && data.refresh) {
      // Combine the access and refresh tokens into one object
      const tokenPayload = JSON.stringify({
        access: data.access,
        refresh: data.refresh,
      });

      // Set the cookie with the combined token payload
      cookies().set("session", tokenPayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
    } else {
      console.error("Tokens not found in response", data);
      // Optionally, handle the error (e.g., return an error message or throw)
    }
  } catch (error: any) {
    console.log("Error during login:", error);
  }
}

async function logout(refresh: string) {
  const url = `${process.env.DOMAIN}/logout/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({ refresh: refresh }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    if (response.ok) {
      cookies().delete("session");
    }
  } catch (error: any) {
    console.log("Error during logout:", error);
  }
}

function getSessionRefresh() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) return null; 

  try {
    const tokenPayload = JSON.parse(sessionCookie.value); 
    return tokenPayload.refresh;
  } catch (error) {
    console.error("Error parsing session cookie:", error);
    return null;
  }
}

export { login, logout, getSessionRefresh };