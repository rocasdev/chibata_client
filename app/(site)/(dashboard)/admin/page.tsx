import DashboardStats from "@/components/DashboardComponents/DashboardStats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chibatá | Administración"
};

export default function Dashboard() {
  return (
    <div>
      <DashboardStats/>
    </div>
  );
}
