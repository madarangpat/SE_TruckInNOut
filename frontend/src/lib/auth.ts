"use server";

import { cookies } from "next/headers";

type Session = {
  access: string;
  refresh: string;
  user: User
}

async function login(username: string, password: string): Promise<User> {
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
  const data = await response.json();

  // Check if both tokens exist in the response
  if (data && data.access && data.refresh) {
    // Create a session object matching the Session type.
    const session: Session = {
      access: data.access,
      refresh: data.refresh,
      user: data.user
    };

    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return data.user
  } else {
    throw new Error("Invalid username or password.");
  }
}

async function logout() {
  const url = `${process.env.DOMAIN}/logout/`;
  const session = getSession();
  if (!session) {
    throw new Error("No active session found.");
  }
  const refreshToken = session.refresh;
  
  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({ refresh: refreshToken }),
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

function getSession(): Session | null {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) return null;

  try {
    const sessionData = JSON.parse(sessionCookie.value) as Session;
    return sessionData; // Return the full session object
  } catch (error) {
    console.error("Error parsing session cookie:", error);
    return null;
  }
}

export { login, logout, getSession };