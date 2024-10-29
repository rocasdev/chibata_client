import EditProfile from "@/components/DashboardComponents/Profile/EditProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Perfil",
};

export default function EventsPage() {
  return (
    <div>
      <EditProfile />
    </div>
  );
}
