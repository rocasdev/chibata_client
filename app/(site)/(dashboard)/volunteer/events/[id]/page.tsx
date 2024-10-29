import EventDetails from "@/components/DashboardComponents/EventsTable/EventDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Evento",
};

export default async function EventsPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <EventDetails id={id} />
    </div>
  );
}
