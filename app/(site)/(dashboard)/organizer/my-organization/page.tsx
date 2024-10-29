import MyOrganization from "@/components/DashboardComponents/OrganizationsTable/MyOrganization"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chibatá | Mi Organización",
};

export default function MyOrg() {
  return (
    <MyOrganization />
  )
}
