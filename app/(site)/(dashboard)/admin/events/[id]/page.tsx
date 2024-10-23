import EventDetails from "@/components/DashboardComponents/EventsTable/EventDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Evento",
};

export default function EventsPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div>
      <EventDetails id={params.id}/>
    </div>
  );
}