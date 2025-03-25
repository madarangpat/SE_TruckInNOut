import { tryCatch } from "@/lib/try-catch";
import DeliveriesClient from "./DeliveriesClient";
import { getAssignedTrip, getRecentTrips, getOngoingTrips, } from "@/lib/actions/deliveries.actions";

export default async function DeliveriesPage() {
  const [{ data: assignedTrip }, { data: recentTrips }, {data: ongoingTrips}] = await Promise.all([
    tryCatch(getAssignedTrip()),
    tryCatch(getOngoingTrips()),
    tryCatch(getRecentTrips())
  ]);

  console.log(recentTrips)

  return <DeliveriesClient assignedTrip={assignedTrip} recentTrips={recentTrips} ongoingTrips={ongoingTrips} />;
}
