import CertificatesTable from "@/components/DashboardComponents/CertificatesTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos Chibata",
};

export default function page() {
  return <CertificatesTable />;
}
