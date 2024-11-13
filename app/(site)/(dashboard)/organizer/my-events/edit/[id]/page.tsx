import EditEventForm from "@/components/DashboardComponents/EventsTable/EditEventForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Evento",
};

export default async function CategoryDetailPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <EditEventForm id={id} />
    </div>
  );
}
