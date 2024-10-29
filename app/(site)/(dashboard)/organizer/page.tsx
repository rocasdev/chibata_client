import Welcome from "@/components/DashboardComponents/Welcome";
import NotificationsTable from "@/components/DashboardComponents/Notifications";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chibatá | Organizador",
};

export default function Dashboard() {
  return (
    <div>
      <Welcome />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="notis p-5">
          <NotificationsTable />
        </div>
        <div className="my-latest-events">
          {/* Componente de los ultimos eventos */}
        </div>
      </div>
    </div>
  );
}
