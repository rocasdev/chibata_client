import VolunteerEventDetails from "@/components/DashboardComponents/EventsTable/VolunteerEventDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Evento",
};

export default async function EventsPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <VolunteerEventDetails id={id} />
    </div>
  );
}
