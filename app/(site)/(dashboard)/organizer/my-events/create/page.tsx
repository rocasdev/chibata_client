import OrganizerCreateEvent from "@/components/DashboardComponents/EventsTable/OrganizerCreateEventForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Eventos",
};

export default function EventsPage() {
  return (
    <div>
      <OrganizerCreateEvent />
    </div>
  );
}
