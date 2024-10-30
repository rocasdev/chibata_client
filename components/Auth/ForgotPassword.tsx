"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ForgotPassword = () => {
  const router = useRouter();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Correo inválido").required("Requerido"),
  });

  const onSubmit = async (values: { email: string }, { resetForm }: { resetForm: () => void }) => {
    try {
      await axios.post("https://chibataserver-production.up.railway.app//api/auth/forgot-password", values);
      toast.success("Correo para restablecer contraseña enviado.");
      resetForm();
    } catch (error) {
      toast.error("No se pudo enviar el correo. Intenta de nuevo.");
    }
  };

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
            Restablecer Contraseña
          </h2>

          <div className="mb-10 flex items-center justify-center">
            <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
            <p className="text-body-color dark:text-body-color-dark w-full px-5 text-center text-base">
              Ingresa tu correo para recibir un enlace de restablecimiento.
            </p>
            <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <div className="mb-7.5 flex flex-col lg:w-full">
                <Label htmlFor="email">Correo</Label>
                <Field
                  as={Input}
                  id="email"
                  type="text"
                  name="email"
                  placeholder="andres@ejemplo.com"
                  className="w-full border-b border-stroke !bg-white pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:!bg-black dark:focus:border-manatee dark:focus:placeholder:text-white"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <button
                    aria-label="Iniciar Sesion"
                    type="submit"
                    className="inline-flex items-center gap-2.5 rounded-full bg-green-800 px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-green-700 dark:hover:bg-blackho"
                  >
                    Restablecer
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

              <p className="text-body-color text-center text-base mt-5 py-5 w-full">
                Volver al inicio de sesión{" "}
                <Link href="/auth/signin" className="text-green-700 hover:underline">
                  Volver
                </Link>
              </p>
            </Form>
          </Formik>
        </motion.div>
      </div>
    </section>
  );
};

export default ForgotPassword;
