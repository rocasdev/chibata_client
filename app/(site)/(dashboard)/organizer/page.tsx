import Welcome from "@/components/DashboardComponents/Welcome";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chibatá | Organizador",
};

export default function Dashboard() {
  return (
    <div>
      <Welcome />
    </div>
  );
}
