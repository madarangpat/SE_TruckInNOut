import ClientHome from "@/components/ClientHome";
import { getCurrentUser } from "@/auth/currentUser";
const HomePage = async () => {
  const user = await getCurrentUser();
  return <ClientHome user={user as any} />;
};

export default HomePage;
