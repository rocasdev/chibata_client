"use client";
import React, { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";

type Category = {
  category_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
};

const CategoryDetails = ({ id }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/categories/${id}`,
          {
            withCredentials: true,
          },
        );
        setCategory(response.data.category);
      } catch (err) {
        setError("Error al cargar la categoría");
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!category) return <div>No se encontró la categoría</div>;

  return (
    <section className="flex w-full">
      <div className="container mx-auto max-w-[1000px] rounded-md bg-gray-50 px-4 py-10 dark:bg-gray-900">
        <div className="p-6">
          <h1 className="mb-4 text-3xl text-gray-900 dark:text-white">
            <b className="font-bold">Nombre de la categoría:</b> {category.name}
          </h1>
          <hr className="mb-4" />
          <div className="mb-6 flex flex-wrap gap-4">
            <span className="flex items-center text-2xl text-gray-600 dark:text-gray-300">
              <b>Estado: </b>
              {category.is_active ? (
                <CheckCircleIcon size={20} className="mr-2 text-green-500" />
              ) : (
                <XCircleIcon size={20} className="mr-2 text-red-500" />
              )}
              {category.is_active ? "Activa" : "Inactiva"}
            </span>
          </div>
          
          <h3 className="font-bold text-xl mb-2">Descripcion: </h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300 text-lg p-4">
            {category.description}
          </p>

          <div className="flex justify-center gap-4">
            <Link
              href={`/admin/categories/edit/${category.category_id}`}
              className="rounded bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-800"
            >
              Editar Categoría
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryDetails;
