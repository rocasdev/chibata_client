import OrganizerEventControll from "@/components/DashboardComponents/EventsTable/OrganizerEventControl";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Evento",
};

export default async function EventsPage({ params }) {

  
  const { id } = await params;
  return (
    <div>
      <OrganizerEventControll id={id} />
    </div>
  );
}
