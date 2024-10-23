"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ImageUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useUser } from "@/app/context/UserContext";

const EditProfile = () => {
  const user = useUser();
  const [imagePreview, setImagePreview] = useState(user?.avatar || null);

  const validationSchema = Yup.object({
    firstname: Yup.string().required("Este campo es requerido"),
    surname: Yup.string().required("Este campo es requerido"),
    email: Yup.string()
      .email("Correo inválido")
      .required("Este campo es requerido"),
    doc_type: Yup.string().required("Este campo es requerido"),
    doc_num: Yup.string().required("Este campo es requerido"),
    phone_number: Yup.string().required("Este campo es requerido"),
    profile_photo: Yup.mixed(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "profile_photo" && values[key]) {
          formData.append(key, values[key]);
        } else if (key !== "profile_photo") {
          formData.append(key, values[key].toString());
        }
      });

      await toast.promise(
        axios.put(
          `http://localhost:4000/api/users/${user?.user_id}`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        ),
        {
          loading: "Actualizando perfil",
          success: (response) => {
            return "Perfil actualizado exitosamente";
          },
          error: "Error al actualizar el perfil",
        },
      );
    } catch (error) {
      console.error("Error during profile update:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
        setFieldValue("profile_photo", file);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <section>
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
        <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>
        <div className="absolute bottom-17.5 left-0 -z-1 h-1/3 w-full">
          <Image
            src="/images/shape/shape-dotted-light.svg"
            alt="Dotted"
            className="dark:hidden"
            fill
          />
          <Image
            src="/images/shape/shape-dotted-dark.svg"
            alt="Dotted"
            className="hidden dark:block"
            fill
          />
        </div>

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
            Editar Perfil
          </h2>

          <Formik
            initialValues={{
              firstname: user?.firstname || "",
              surname: user?.surname || "",
              email: user?.email || "",
              doc_type: user?.doc_type || "",
              doc_num: user?.doc_num || "",
              phone_number: user?.phone_number || "",
              profile_photo: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, isSubmitting }) => (
              <Form>
                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="firstname">Nombre</Label>
                    <Field
                      as={Input}
                      id="firstname"
                      name="firstname"
                      type="text"
                      placeholder="Ej. Andrés"
                      className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="surname">Apellido</Label>
                    <Field
                      as={Input}
                      id="surname"
                      name="surname"
                      type="text"
                      placeholder="Ej. Meza"
                      className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="surname"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="doc_type">Tipo de Documento</Label>
                    <Field
                      as="select"
                      id="doc_type"
                      name="doc_type"
                      disabled
                      className={`w-full cursor-not-allowed border-b border-stroke bg-transparent pb-3.5 opacity-50 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    >
                      <option className="text-waterloo" value="">
                        Seleccionar...
                      </option>
                      <option value="CC" className="text-black">
                        Cédula de Ciudadanía
                      </option>
                      <option value="CE" className="text-black">
                        Cédula de Extranjería
                      </option>
                      <option value="PA" className="text-black">
                        Pasaporte
                      </option>
                    </Field>
                    <ErrorMessage
                      name="doc_type"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="doc_num">Numero de documento</Label>
                    <Field
                      as={Input}
                      id="doc_num"
                      name="doc_num"
                      type="number"
                      readOnly
                      placeholder="Ej. 10065874963"
                      className={`w-full cursor-not-allowed border-b border-stroke bg-transparent pb-3.5 opacity-50 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="doc_num"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="phone_number">Telefono</Label>
                    <Field
                      as={Input}
                      id="phone_number"
                      name="phone_number"
                      type="number"
                      readOnly
                      placeholder="Ej. 3205869475"
                      className={`w-full cursor-not-allowed border-b border-stroke bg-transparent pb-3.5 opacity-50 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="phone_number"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="w-full lg:w-1/2">
                    <Label htmlFor="email">Correo</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      readOnly
                      placeholder="Ej. andres@ejemplo.com"
                      className={`w-full cursor-not-allowed border-b border-stroke bg-transparent pb-3.5 opacity-50 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <div className="mb-7.5 flex w-full flex-col items-center justify-center gap-2 lg:mb-12.5 lg:gap-4">
                  <Label
                    htmlFor="imgInpEdit"
                    className="text-sm text-black dark:text-white"
                  >
                    Foto de Perfil
                  </Label>
                  <div
                    className="flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed p-2"
                    onClick={() =>
                      document.getElementById("imgInpEdit")?.click()
                    }
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview as string}
                        alt="Vista previa"
                        className="h-full w-full rounded-full object-cover object-center"
                        width={200}
                        height={200}
                      />
                    ) : (
                      <>
                        <ImageUp className="h-14 w-14" />
                        <p>Actualizar foto de perfil</p>
                      </>
                    )}
                    <input
                      name="profile_photo"
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleImageChange(event, setFieldValue)
                      }
                      className="h-0 w-0 opacity-0"
                      id="imgInpEdit"
                    />
                  </div>
                  <ErrorMessage
                    name="profile_photo"
                    component="div"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="mb-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2.5 rounded-full bg-green-800 px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho disabled:opacity-50 dark:bg-green-700 dark:hover:bg-blackho"
                  >
                    {isSubmitting ? "Actualizando..." : "Actualizar Perfil"}
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

export default EditProfile;
