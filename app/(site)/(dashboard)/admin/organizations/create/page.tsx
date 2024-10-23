import CreateOrganization from "@/components/DashboardComponents/OrganizationsTable/CreateOrganizationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Eventos",
};

export default function CreateOrganizationPage() {
  return (
    <div>
      <CreateOrganization />
    </div>
  );
}
