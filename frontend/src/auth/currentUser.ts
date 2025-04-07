import { redirect } from "next/navigation";
import { cache } from "react";
import { getSession } from "./session";
import { getUserProfile } from "@/lib/actions/user.actions";

function _getCurrentUser(options: { withEmployeeProfile: true }): Promise<User>;
function _getCurrentUser(options?: {
  withEmployeeProfile?: false;
}): Promise<User | null>;

async function _getCurrentUser({
  withEmployeeProfile = false,
}: { withEmployeeProfile?: boolean } = {}): Promise<User | null> {
  const session = getSession();
  if (!session) redirect("/login");

  // NOTE: withEmployeeProfile returns the entire employee object,
  // which also contains the entire user object

  if (withEmployeeProfile) {
    try {
      const userData = await getUserProfile();
      return userData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return session.user;
    }
  } else {
    return session.user;
  }
}

// Cache the getCurrentUser function to only refetch the data
// if changed
export const getCurrentUser = cache(_getCurrentUser);