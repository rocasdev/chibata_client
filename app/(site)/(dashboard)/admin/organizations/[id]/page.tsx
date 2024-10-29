import OrganizationDetails from "@/components/DashboardComponents/OrganizationsTable/OrganizationDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Evento",
};

export default async function EventsPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <OrganizationDetails id={id} />
    </div>
  );
}
