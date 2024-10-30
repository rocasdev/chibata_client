"use client";
import { motion } from "framer-motion";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import Image from "next/image";

const CreateOrganization = () => {
  const router = useRouter();
  const [logoPreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null,
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("El nombre es requerido"),
    nit: Yup.string().required("El NIT es requerido"),
    address: Yup.string().required("La dirección es requerida"),
    founding_date: Yup.date().required("La fecha de fundación es requerida"),
    contact_number: Yup.number()
      .typeError("Debe ser un número válido")
      .required("El número de contacto es requerido"),
    is_active: Yup.boolean().required("El estado es requerido"),
    logo: Yup.mixed().required("Por favor, sube un logo"),
    website: Yup.string().url("Debe ser una URL válida").optional(),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "org_logo") {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key].toString());
        }
      });

      await toast.promise(
        axios.post("https://chibataserver-production.up.railway.app//api/organizations", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          loading: "Creando organización",
          success: () => {
            resetForm();
            setImagePreview(null);
            router.push("/admin/organizations");
            return "Organización creada exitosamente";
          },
          error: (error) => {
            console.error("Error al crear la organización:", error);
            return "Error al crear la organización";
          },
        },
      );
    } catch (error) {
      console.error("Error durante la creación de la organización:", error);
      toast.error("Algo salió mal durante la creación de la organización");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFieldValue("logo", file);
      };

      reader.readAsDataURL(file);
    }
  };

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
            Crear Nueva Organización
          </h2>

          <Formik
            initialValues={{
              name: "",
              nit: "",
              address: "",
              founding_date: "",
              contact_number: "",
              is_active: true,
              logo: null,
              website: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, isSubmitting, values }) => (
              <Form>
                {/* Campos del formulario */}
                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="name">Nombre de la Organización</Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Ej. Red.ES"
                      className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="nit">Nit de la Organización</Label>
                    <Field
                      as={Input}
                      id="nit"
                      name="nit"
                      type="number"
                      placeholder="Ej. 9856321478"
                      className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="nit"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="address">
                      Dirección de la Organización
                    </Label>
                    <Field
                      as={Input}
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Ej. KR 1 #23-456"
                      className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="founding_date">Fecha de Fundación</Label>
                    <Field
                      as={Input}
                      id="founding_date"
                      name="founding_date"
                      type="date"
                      placeholder="Fecha de fundacion"
                      className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="founding_date"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="contact_number">
                      Telefono Organización
                    </Label>
                    <Field
                      as={Input}
                      id="contact_number"
                      name="contact_number"
                      type="number"
                      placeholder="Ej. 3202589647"
                      className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="contact_number"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Field
                      as={Input}
                      id="website"
                      name="website"
                      type="text"
                      placeholder="Ej. https://www.redes.com.co"
                      className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="website"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <div className="mb-7.5 flex w-full flex-col items-center justify-center gap-2 lg:mb-12.5 lg:gap-4">
                  <Label
                    htmlFor="imgInpLogo"
                    className="text-md text-neutral-400"
                  >
                    Logo de la Organización
                  </Label>
                  <div
                    className="flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed p-2"
                    onClick={() =>
                      document.getElementById("imgInpLogo")?.click()
                    }
                  >
                    {logoPreview ? (
                      <Image
                        src={logoPreview as string}
                        alt="Vista previa del logo"
                        className="h-full w-full rounded-full object-cover object-center"
                        width={200}
                        height={200}
                      />
                    ) : (
                      <>
                        <ImageUp className="h-14 w-14" />
                        <p className="text-center">
                          Sube el logo de la organización
                        </p>
                      </>
                    )}
                    <input
                      name="org_logo"
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageChange(event, setFieldValue)
                      }
                      className="h-0 w-0 opacity-0"
                      id="imgInpLogo"
                    />
                  </div>
                </div>

                <div className="mb-4 mt-3 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="hover:bg-deepblue inline-block rounded-md bg-waterloo px-8 py-3 text-white"
                  >
                    {isSubmitting ? "Creando..." : "Crear Organización"}
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

export default CreateOrganization;
