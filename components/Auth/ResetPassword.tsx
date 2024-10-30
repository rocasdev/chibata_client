"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isValidToken, setIsValidToken] = useState(false);

  const validationSchema = Yup.object({
    pass: Yup.string()
      .required("Este campo es requerido")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
      ),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("pass")], "Las contraseñas no coinciden")
      .required("Este campo es requerido"),
  });

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get("token");

      if (!token) {
        toast.error("No puedes acceder a esta sección");
        router.push("/auth/signin");
        return;
      }

      try {
        // Validar el token con el backend
        const response = await axios.post(
          "http://localhost:4000/api/auth/verify-token",
          {
            token,
          },
        );

        if (response.data.valid) {
          setIsValidToken(true);
        } else {
          toast.error("No puedes acceder a esta sección");
          router.push("/auth/signin");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        toast.error("No puedes acceder a esta sección");
        router.push("/auth/signin");
      }
    };

    validateToken();
  }, [searchParams, router]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const token = searchParams.get("token");

    try {
      await toast.promise(
        axios.post("http://localhost:4000/api/auth/reset-password", {
          token,
          password: values.pass,
        }),
        {
          loading: "Cambiando contraseña...",
          success: () => {
            resetForm();
            router.push("/auth/signin");
            return "Contraseña cambiada exitosamente";
          },
          error: (error) => {
            console.error("Error during reset password:", error);
            return "Error al cambiar la contraseña. Inténtalo de nuevo.";
          },
        },
      );
    } catch (error) {
      console.error("Error during reset password:", error);
      toast.error("Algo salió mal durante el cambio de contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isValidToken) {
    return null; // O podrías mostrar un componente de carga
  }

  return (
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
            Cambiar Contraseña
          </h2>

          <div className="mb-10 flex items-center justify-center">
            <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
            <p className="text-body-color dark:text-body-color-dark w-full px-5 text-center text-base">
              Cambia tu contraseña olvidada
            </p>
            <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
          </div>

          <Formik
            initialValues={{
              pass: "",
              passwordConfirm: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
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

                <div className="mb-4 flex flex-wrap items-center gap-10 md:justify-between xl:gap-15">
                  <button
                    aria-label="Cambiar Contraseña"
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2.5 rounded-full bg-green-800 px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho disabled:opacity-50 dark:bg-green-700 dark:hover:bg-blackho"
                  >
                    {isSubmitting
                      ? "Cambiando Contraseña..."
                      : "Cambiar Contraseña"}
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

export default ResetPassword;
