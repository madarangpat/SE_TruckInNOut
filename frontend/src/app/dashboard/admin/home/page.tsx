import EmployeeList from "@/components/EmployeeList";
import EmployeeStatus from "@/components/EmployeeStatus";
import PriorityQueue from "@/components/PriorityQueue";
import TripsInTransit from "@/components/TripsInTransit";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-3/4 flex flex-col gap-5">
        {/* TRIPS IN TRANSIT */}
        <div className="flex gap-4 justify-between flex-wrap">
          <TripsInTransit />
        </div>

        {/* PRIORITY QUEUE */}
        <div className="flex gap-4 flex-col lg:flex-row w-full h-[250px]">
          <PriorityQueue />
        </div>

        {/* EMPLOYEE STATUS */}
        <div className="flex gap-4 flex-col lg:flex-row w-full h-[200px]">
          <EmployeeStatus />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/4">
        <EmployeeList />
      </div>
    </div>
  );
};

export default AdminPage;
