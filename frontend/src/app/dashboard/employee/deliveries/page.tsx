import { tryCatch } from "@/lib/try-catch";
import DeliveriesClient from "./DeliveriesClient";
import { getRecentTrips, getOngoingTrips, } from "@/lib/actions/deliveries.actions";

export default async function DeliveriesPage() {
  const [{ data: ongoingTrips, error: ongoingError }, { data: recentTrips, error: recentError }] = await Promise.all([
    tryCatch(getOngoingTrips()),
    tryCatch(getRecentTrips())
  ]);
  
  if (ongoingError || recentError) {
    console.error('Error fetching data:', ongoingError, recentError);
    return <div>Error loading trips.</div>;
  }
  
  console.log(recentTrips);
  return <DeliveriesClient ongoingTrips={ongoingTrips} recentTrips={recentTrips} />;
}
