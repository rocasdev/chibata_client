import CategoryDetails from "@/components/DashboardComponents/CategoriesTable/CategoryDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Categoría",
};

export default function CategoryDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div>
      <CategoryDetails id={params.id} />
    </div>
  );
}
