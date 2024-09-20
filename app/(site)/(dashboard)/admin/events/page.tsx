import EventsTable from "@/components/DashboardComponents/EventsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrar Eventos"
};

export default function EventsPage() {
  return (
    <div>
      <EventsTable/>
    </div>
  );
}
