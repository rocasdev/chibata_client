import CategoriesTable from "@/components/DashboardComponents/CategoriesTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrar Categorias",
};

export default function CategoriesPage() {
  return (
    <div>
      <CategoriesTable />
    </div>
  );
}
