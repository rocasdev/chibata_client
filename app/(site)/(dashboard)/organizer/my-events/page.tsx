import EventsCardGrid from "@/components/DashboardComponents/EventsTable/MyEvents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chibatá | Mi Organización",
};

export default function MyOrg() {
  return <EventsCardGrid />;
}
