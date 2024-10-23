import UsersTable from "@/components/DashboardComponents/UsersTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrar Usuarios",
};

export default function EventsPage() {
  return (
    <div>
      <UsersTable />
    </div>
  );
}
