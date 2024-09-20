"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUp } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const Signuporg = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null,
  );

  const validationSchema = Yup.object({
    org_name: Yup.string().required("Este campo es requerido"),
    nit: Yup.number().required("Este campo es requerido"),
    address: Yup.string().required("Este campo es requerido"),
    registration_date: Yup.date().required("Este campo es requerido"),
    contact_number: Yup.string()
      .required("Este campo es requerido")
      .min(10, "Debe ser mínimo 10 digitos")
      .max(10, "Debe ser máximo 10 digitos"),
    website: Yup.string().required("Este campo es requerido"),
    name: Yup.string().required("Este campo es requerido"),
    surname: Yup.string().required("Este campo es requerido"),
    email: Yup.string()
      .email("Correo inválido")
      .required("Este campo es requerido"),
    doc_type: Yup.string().required("Este campo es requerido"),
    doc_num: Yup.string()
      .required("Este campo es requerido")
      .min(6, "Debe ser mínimo 6 digitos")
      .max(12, "Debe ser máximo 12 digitos"),
    phone_number: Yup.string()
      .required("Este campo es requerido")
      .min(10, "Debe ser mínimo 10 digitos")
      .max(10, "Debe ser máximo 10 digitos"),
    pass: Yup.string()
      .required("Este campo es requerido")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
      ),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("pass")], "Las contraseñas no coinciden")
      .required("Este campo es requerido"),
    profile_photo: Yup.mixed(),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setSubmitting(true);
      const formData = new FormData();

      // Añadir todos los campos del formulario al FormData
      Object.keys(values).forEach((key) => {
        if (key === "profile_photo" && values[key]) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key].toString());
        }
      });

      const response = await axios.post(
        "http://localhost:4000/api/auth/registerorg",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        toast.success("Registro exitoso");
        router.push("/auth/signin");
      } else {
        throw new Error(response.data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error durante el registro:", error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        toast.error(error.response.data.message || "Error en el registro");
      } else {
        toast.error("Error en el registro. Por favor, inténtalo de nuevo.");
      }
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
        setFieldValue("profile_photo", file);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <section className="pb-12.5 pt-32.5 lg:pb-25 lg:pt-45 xl:pb-30 xl:pt-50">
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
              Crea Una Cuenta
            </h2>

            <div className="mb-10 flex items-center justify-center">
              <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
              <p className="text-body-color dark:text-body-color-dark w-full px-5 text-center text-base">
                Registro de Organizaciones
              </p>
              <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
            </div>

            <Formik
              initialValues={{
                org_name: "",
                nit: "",
                address: "",
                registration_date: "",
                contact_number: "",
                website: "",
                name: "",
                surname: "",
                email: "",
                doc_type: "",
                doc_num: "",
                phone_number: "",
                pass: "",
                passwordConfirm: "",
                profile_photo: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue, isSubmitting }) => (
                <Form>
                  {/* Campos del formulario */}
                  <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                    <div className="w-full lg:w-1/2">
                      <Label htmlFor="org_name">
                        Nombre de la Organización
                      </Label>
                      <Field
                        as={Input}
                        id="org_name"
                        name="org_name"
                        type="text"
                        placeholder="Ej. Red.ES"
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                      />
                      <ErrorMessage
                        name="org_name"
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
                      <Label htmlFor="registration_date">
                        Fecha de Creación
                      </Label>
                      <Field
                        as={Input}
                        id="registration_date"
                        name="registration_date"
                        type="date"
                        placeholder="Fecha de Registro"
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                      />
                      <ErrorMessage
                        name="registration_date"
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

                  <div className="mb-10 flex items-center justify-center">
                    <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
                    <p className="text-body-color dark:text-body-color-dark w-full px-5 text-center text-base">
                      Datos del Representante
                    </p>
                    <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
                  </div>

                  <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                    <div className="w-full lg:w-1/2">
                      <Label htmlFor="name">Nombre</Label>
                      <Field
                        as={Input}
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Ej. Andrés"
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>

                    <div className="w-full lg:w-1/2">
                      <Label htmlFor="surnmae">Apellido</Label>
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
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-neutral-400`}
                      >
                        <option value="" className="text-neutral-400">
                          Seleccionar
                        </option>
                        <option value="CC" className="text-neutral-800">
                          Cédula de Ciudadanía
                        </option>
                        <option value="CE" className="text-neutral-800">
                          Céduña de Extranjería
                        </option>
                        <option value="PA" className="text-neutral-800">
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
                      <Label htmlFor="doc_num">Numero de Documento</Label>
                      <Field
                        as={Input}
                        id="doc_num"
                        name="doc_num"
                        type="number"
                        placeholder="Ej. 1006589321"
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
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
                        placeholder="Ej. 3209635478"
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
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
                        placeholder="Ej. andres@ejemplo.com"
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>

                  <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                    <div className="w-full lg:w-1/2">
                      <Label htmlFor="pass">Contraseña</Label>
                      <Field
                        as={Input}
                        id="pass"
                        name="pass"
                        type="password"
                        placeholder="··········"
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                      />
                      <ErrorMessage
                        name="pass"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>

                    <div className="w-full lg:w-1/2">
                      <Label htmlFor="passwordConfirm">
                        Confirmar Contraseña
                      </Label>
                      <Field
                        as={Input}
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        placeholder="··········"
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
                      />
                      <ErrorMessage
                        name="passwordConfirm"
                        component="div"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>

                  <div className="mb-7.5 flex w-full flex-col items-center justify-center gap-2 lg:mb-12.5 lg:gap-4">
                    <Label
                      htmlFor="imgInpSignUp"
                      className="text-md text-neutral-400"
                    >
                      Foto de Perfil
                    </Label>
                    <div
                      className="flex h-[200px] w-[200px] cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed p-2"
                      onClick={() =>
                        document.getElementById("imgInpSignUp")?.click()
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
                          <p>Sube una foto de perfil</p>
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
                        id="imgInpSignUp"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-10 md:justify-between xl:gap-15">
                    <div className="flex flex-wrap gap-4 md:gap-10">
                      <Link
                        href="/auth/signup"
                        className="hover:text-green-700"
                      >
                        Registrarme como voluntario
                      </Link>
                    </div>

                    <button
                      aria-label="Registro"
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2.5 rounded-full bg-green-800 px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho disabled:opacity-50 dark:bg-green-700 dark:hover:bg-blackho"
                    >
                      {isSubmitting ? "Registrando..." : "Registrarme"}
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

            <p className="text-body-color mt-5 py-5 text-center text-base">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/auth/signin"
                className="text-green-700 hover:underline"
              >
                Inicia Sesión
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Signuporg;
