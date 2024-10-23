import CreateCategory from "@/components/DashboardComponents/CategoriesTable/CreateCategoryForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Categorias",
};

export default function CreateCategoryPage() {
  return (
    <div>
      <CreateCategory />
    </div>
  );
}
