import { tryCatch } from "@/lib/try-catch";
import DeliveriesClient from "./DeliveriesClient";
import { getRecentTrips, getOngoingTrips, } from "@/lib/actions/deliveries.actions";

export default async function DeliveriesPage() {
  const [{ data: ongoingTrips }, {data: recentTrips}] = await Promise.all([
    tryCatch(getOngoingTrips()),
    tryCatch(getRecentTrips())
  ]);

  console.log(recentTrips)

  return <DeliveriesClient ongoingTrips={ongoingTrips} recentTrips={recentTrips} />;
}
