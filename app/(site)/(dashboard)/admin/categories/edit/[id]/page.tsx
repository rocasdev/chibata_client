import EditCategoryForm from "@/components/DashboardComponents/CategoriesTable/EditCategoryForm";
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
      <EditCategoryForm categoryId={params.id} />
    </div>
  );
}
