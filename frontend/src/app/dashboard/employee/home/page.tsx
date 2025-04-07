import { getCurrentEmployee } from "@/auth/currentEmployee";
import ClientHome from "@/components/ClientHome";

const HomePage = async () => {
  const employee = await getCurrentEmployee(); // 👈 returns employee object
  return <ClientHome employee={employee} />;
};

export default HomePage;