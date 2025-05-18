import { getSession } from "@/auth/session";
import ViewGrossClient from "./ViewGrossClient";

export default function ViewGross() {
  const session = getSession();

  return <ViewGrossClient session={session!} />;
}
