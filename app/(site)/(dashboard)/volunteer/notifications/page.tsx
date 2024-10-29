import NotificationTable from "@/components/DashboardComponents/Notifications";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notificaciones",
};

export default function EventsPage() {
  return (
    <div>
      <NotificationTable />
    </div>
  );
}
