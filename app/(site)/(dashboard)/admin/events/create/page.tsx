import CreateEvent from "@/components/DashboardComponents/EventsTable/CreateEventForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Eventos",
};

export default function EventsPage() {
  return (
    <div>
      <CreateEvent />
    </div>
  );
}