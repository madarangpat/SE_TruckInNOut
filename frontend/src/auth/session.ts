import "server-only";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export type SessionPayload = {
  access: string;
  refresh: string;
};

export function createSession(sessionPayload: SessionPayload) {
  // Creates the session, expiry of token in here is the same with the
  // backend
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = cookies();
  const { access: accessToken, refresh: refreshToken } = sessionPayload;

  // Set access and refresh tokens as separate cookies
  cookieStore.set("access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refresh-token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export function getSession() {
  // Gets the access and refresh tokens and decodes the user
  // from the access token
  // NOTE: the access token only contains the user id and role
  const cookieStore = cookies();
  const access = cookieStore.get("access-token")?.value;
  const refresh = cookieStore.get("refresh-token")?.value;

  if (!access || !refresh) return null;

  const user = jwtDecode(access) as User;
  return { access, refresh, user };
}

export function deleteSession() {
  // Removes the tokens form the session
  const cookieStore = cookies();
  cookieStore.delete("access-token");
  cookieStore.delete("refresh-token");
}
