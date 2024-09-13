import DashboardStats from "@/components/DashboardComponents/DashboardStats";
import NotificationTable from "@/components/DashboardComponents/Notifications";
import Welcome from "@/components/DashboardComponents/Welcome"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chibatá | Administración"
};

export default function Dashboard() {
  return (
    <div>
      <Welcome />
      <DashboardStats />
      <NotificationTable/>
    </div>
  );
}
