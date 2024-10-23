"use client";
import { motion } from "framer-motion";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

const CreateCategory = () => {
  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es requerido"),
    description: Yup.string().required("La descripción es requerida"),
    is_active: Yup.boolean().required("El estado es requerido"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await toast.promise(
        axios.post("http://localhost:4000/api/categories", values, {
          withCredentials: true,
        }),
        {
          loading: "Creando categoría",
          success: (response) => {
            resetForm();
            router.push("/admin/categories");
            return "Categoría creada exitosamente";
          },
          error: (error) => {
            console.error("Error al crear la categoría:", error);
            return "Error al crear la categoría";
          },
        },
      );
    } catch (error) {
      console.error("Error durante la creación de la categoría:", error);
      toast.error("Algo salió mal durante la creación de la categoría");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: -20,
            },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_top rounded-lg bg-white px-7.5 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:px-15 xl:pt-15"
        >
          <h2 className="mb-15 text-center text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
            Crear Nueva Categoría
          </h2>

          <Formik
            initialValues={{
              name: "",
              description: "",
              is_active: true,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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

                  <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5">
                    <div className="w-full">
                      <Label htmlFor="description">Descripción</Label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Describe la categoría..."
                        className="w-full border-b mt-2 border-stroke bg-transparent p-0 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <Label htmlFor="is_active">Estado</Label>
                    <Field
                      as="select"
                      id="is_active"
                      name="is_active"
                      className="w-full border-b border-stroke bg-transparent pb-3.5 px-0 pt-2 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                    >
                      <option value="true" className="text-black">Activa</option>
                      <option value="false" className="text-black">Inactiva</option>
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
                    {isSubmitting ? "Creando..." : "Crear Categoria"}
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
        </motion.div>
      </div>
    </section>
  );
};

export default CreateCategory;
