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
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { BACKEND_URL } from "@/config/constants";

const Signup = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null,
  );

  const validationSchema = Yup.object({
    name: Yup.string().required("Este campo es requerido"),
    surname: Yup.string().required("Este campo es requerido"),
    email: Yup.string()
      .email("Correo inválido")
      .required("Este campo es requerido"),
    doc_type: Yup.string().required("Este campo es requerido"),
    doc_num: Yup.string().required("Este campo es requerido"),
    phone_number: Yup.string().required("Este campo es requerido"),
    pass: Yup.string()
      .required("Este campo es requerido")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
      ),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("pass")], "Las contraseñas no coinciden")
      .required("Este campo es requerido"),
    avatar: Yup.mixed().required("Por favor, sube una imagen"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "avatar") {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key].toString());
        }
      });

      await toast.promise(
        axios.post(
          `${BACKEND_URL}/auth/register-volunteer`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        ),
        {
          loading: "Registrando",
          success: (response) => {
            resetForm();
            setImagePreview(null);
            router.push("/auth/signin");
            return "Registro exitoso";
          },
          error: (error) => {
            console.error("Error during registration:", error);
            return "Verifica el formulario de registro";
          },
        },
      );
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Algo salió mal durante el registro");
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
        setFieldValue("avatar", file);
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
                Regístrate como voluntario Chibatá
              </p>
              <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
            </div>

            <Formik
              initialValues={{
                name: "",
                surname: "",
                email: "",
                doc_type: "",
                doc_num: "",
                phone_number: "",
                pass: "",
                passwordConfirm: "",
                avatar: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, setFieldValue, isSubmitting }) => (
                <Form>
                  {/* Campos del formulario */}
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
                        className={`w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white`}
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
                      <Label htmlFor="doc_number">Numero de documento</Label>
                      <Field
                        as={Input}
                        id="doc_number"
                        name="doc_num"
                        type="number"
                        placeholder="Ej. 10065874963"
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
                        placeholder="Ej. 3205869475"
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
                      className="text-sm text-black dark:text-white"
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
                        name="avatar"
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleImageChange(event, setFieldValue)
                        }
                        className="h-0 w-0 opacity-0"
                        id="imgInpSignUp"
                      />
                    </div>
                    <ErrorMessage
                      name="avatar"
                      component="div"
                      className="text-sm text-red-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-10 md:justify-between xl:gap-15">
                    <div className="flex flex-wrap gap-4 md:gap-10">
                      <Link
                        href="/auth/signuporg"
                        className="hover:text-green-700"
                      >
                        Registrarme como organización
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

export default Signup;
