import VolunteerEventsView from "@/components/DashboardComponents/EventsTable/VolunteerEventsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos Chibata",
};

export default function page() {
  return <VolunteerEventsView />;
}
