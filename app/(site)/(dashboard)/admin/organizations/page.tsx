import OrganizationsTable from "@/components/DashboardComponents/OrganizationsTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrar Organizaciones",
};

export default function OrganizationsTablePage() {
  return (
    <div>
      <OrganizationsTable />
    </div>
  );
}
