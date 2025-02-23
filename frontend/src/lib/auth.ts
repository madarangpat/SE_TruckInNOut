"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  const response = await fetch(url, requestOptions);
  const data = await response.json();

  // Check if both tokens exist in the response
  if (data && data.access && data.refresh) {
    // Combine the access and refresh tokens into one object
    // TODO: store user role in session too
    const tokenPayload = JSON.stringify({
      access: data.access,
      refresh: data.refresh,
    });

    // TODO: add role-based authentication
    // if user is Admin/SuperAdmin return employee
    // e.g. return role of user i.e. admin/superadmin
    // the role returned will be used for the router.push() in
    // login client

    // calling the login function is like this:
    // const reponse = await login(username, password)
    // if (response.role.lowercase() === "admin") {
    // router.push("/dashboard//home")
    // }

    // Set the cookie with the combined token payload
    cookies().set("session", tokenPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
  } else {
    throw new Error("Invalid username or password.");
  }
}

async function logout() {
  const url = `${process.env.DOMAIN}/logout/`;
  const requestOptions: RequestInit = {
    cache: "no-store",
    body: JSON.stringify({ refresh: await getSessionRefresh() }),
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
