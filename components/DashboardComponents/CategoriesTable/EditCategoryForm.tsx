"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

interface CategoryFormValues {
  name: string;
  description: string;
  is_active: boolean;
}

const EditCategory = ({ categoryId }) => {
  const router = useRouter();
  const [category, setCategory] = useState<CategoryFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://chibataserver-production.up.railway.app//api/categories/${categoryId}`,
          {
            withCredentials: true,
          },
        );
        setCategory(response.data.category);
      } catch (error) {
        console.error("Error al obtener la categoría:", error);
        toast.error("Error al cargar la información de la categoría");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es requerido"),
    description: Yup.string().required("La descripción es requerida"),
    is_active: Yup.boolean().required("El estado es requerido"),
  });

  const handleSubmit = async (
    values: CategoryFormValues,
    { setSubmitting },
  ) => {
    try {
      await toast.promise(
        axios.put(
          `https://chibataserver-production.up.railway.app//api/categories/${categoryId}`,
          values,
          {
            withCredentials: true,
          },
        ),
        {
          loading: "Actualizando categoría",
          success: () => {
            router.push("/admin/categories");
            return "Categoría actualizada exitosamente";
          },
          error: (error) => {
            console.error("Error al actualizar la categoría:", error);
            return "Error al actualizar la categoría";
          },
        },
      );
    } catch (error) {
      console.error("Error durante la actualización de la categoría:", error);
      toast.error("Algo salió mal durante la actualización de la categoría");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!category) {
    return <div>No se pudo cargar la información de la categoría.</div>;
  }

  return (
    <section>
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_top rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15"
        >
          <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
            Editar Categoría
          </h2>

          {!isLoading && category ? (
            <Formik
              initialValues={{
                name: category.name || "",
                description: category.description || "",
                is_active: category.is_active || false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5">
                    <div className="w-full">
                      <Label htmlFor="name">Nombre de la Categoría</Label>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Ej. Limpieza Ambiental"
                        className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>

                    <div className="w-full">
                      <Label htmlFor="description">Descripción</Label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Describe la categoría..."
                        className="mt-2 w-full border-b border-stroke bg-transparent p-0 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>

                    <div className="w-full">
                      <Label htmlFor="is_active">Estado</Label>
                      <Field
                        as="select"
                        id="is_active"
                        name="is_active"
                        className="w-full border-b border-stroke bg-transparent px-0 pb-3.5 pt-2 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                      >
                        <option value="true" className="text-black">
                          Activa
                        </option>
                        <option value="false" className="text-black">
                          Inactiva
                        </option>
                      </Field>
                      <ErrorMessage
                        name="is_active"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <Link
                      href="/admin/categories"
                      className="hover:text-green-600"
                    >
                      Volver
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2.5 rounded-full bg-green-800 px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho disabled:opacity-50 dark:bg-green-700 dark:hover:bg-blackho"
                    >
                      {isSubmitting
                        ? "Actualizando..."
                        : "Actualizar Categoría"}
                      <svg
                        className="fill-white"
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>  
                </Form>
              )}
            </Formik>
          ) : (
            <div>Cargando...</div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default EditCategory;
