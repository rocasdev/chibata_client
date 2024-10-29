import CategoryDetails from "@/components/DashboardComponents/CategoriesTable/CategoryDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Categoría",
};

export default async function CategoryDetailPage({
  params,
}) {
  const { id } = await params;
  return (
    <div>
      <CategoryDetails id={id} />
    </div>
  );
}
