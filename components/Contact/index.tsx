"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const Contact = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {/* <!-- ===== Contacto Start ===== --> */}
      <section id="contact" className="px-4 md:px-8 2xl:px-0 pb-5">
        <div className="relative mx-auto max-w-c-1390 px-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg bg-gradient-to-t from-transparent to-[#dee7ff47] dark:bg-gradient-to-t dark:to-[#252A42]"></div>
          <div className="absolute bottom-[-255px] left-0 -z-1 h-full w-full">
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

          <div className="flex flex-col-reverse flex-wrap gap-8 md:flex-row md:flex-nowrap md:justify-between xl:gap-20">
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
              className="animate_top w-full rounded-lg bg-white p-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black md:w-3/5 lg:w-3/4 xl:p-15"
            >
              <h2 className="mb-15 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                Envíanos un mensaje
              </h2>

              <form
                action="https://formbold.com/s/unique_form_id"
                method="POST"
              >
                <div className="mb-7.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                  />

                  <input
                    type="email"
                    placeholder="Dirección de correo electrónico"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                  />
                </div>

                <div className="mb-12.5 flex flex-col gap-7.5 lg:flex-row lg:justify-between lg:gap-14">
                  <input
                    type="text"
                    placeholder="Asunto"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                  />

                  <input
                    type="text"
                    placeholder="Número de teléfono"
                    className="w-full border-b border-stroke bg-transparent pb-3.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white lg:w-1/2"
                  />
                </div>

                <div className="mb-11.5 flex">
                  <textarea
                    placeholder="Mensaje"
                    rows={4}
                    className="w-full border-b border-stroke bg-transparent focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                  ></textarea>
                </div>

                <div className="flex flex-wrap gap-4 xl:justify-between ">
                  <div className="mb-4 flex md:mb-0">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      className="peer sr-only"
                    />
                    <span className="border-gray-300 bg-gray-100 text-blue-600 dark:border-gray-600 dark:bg-gray-700 group mt-2 flex h-5 min-w-[20px] items-center justify-center rounded peer-checked:bg-green-700">
                      <svg
                        className="opacity-0 peer-checked:group-[]:opacity-100"
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.70704 0.792787C9.89451 0.980314 9.99983 1.23462 9.99983 1.49979C9.99983 1.76495 9.89451 2.01926 9.70704 2.20679L4.70704 7.20679C4.51951 7.39426 4.26521 7.49957 4.00004 7.49957C3.73488 7.49957 3.48057 7.39426 3.29304 7.20679L0.293041 4.20679C0.110883 4.01818 0.0100885 3.76558 0.0123669 3.50339C0.0146453 3.24119 0.119814 2.99038 0.305222 2.80497C0.490631 2.61956 0.741443 2.51439 1.00364 2.51211C1.26584 2.50983 1.51844 2.61063 1.70704 2.79279L4.00004 5.08579L8.29304 0.792787C8.48057 0.605316 8.73488 0.5 9.00004 0.5C9.26521 0.5 9.51951 0.605316 9.70704 0.792787Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    <label
                      htmlFor="default-checkbox"
                      className="flex max-w-[425px] cursor-pointer select-none pl-5"
                    >
                      Al marcar la casilla, aceptas nuestros términos de uso
                      del “Formulario” y el uso de cookies en el navegador.
                    </label>
                  </div>

                  <button
                    aria-label="enviar mensaje"
                    className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark"
                  >
                    Enviar Mensaje
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
              </form>
            </motion.div>

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
              transition={{ duration: 2, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-2/5 md:p-7.5 lg:w-[26%] xl:pt-15"
            >
              <h2 className="mb-12.5 text-3xl font-semibold text-black dark:text-white xl:text-sectiontitle2">
                Datos de Contacto
              </h2>

              <ul className="space-y-6">
                <li className="flex items-center space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e7f2f6] dark:bg-[#1f2a34]">
                    <svg
                      className="fill-green-700"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.6464 2.64645C14.0367 3.03672 14.0367 3.65942 13.6464 4.04969L8.78671 8.9094L8.78671 8.9094L6.62132 11.0748L5.34371 12.3524C5.15476 12.5414 4.88255 12.6428 4.62642 12.6428C4.37026 12.6428 4.09806 12.5414 3.9091 12.3524L1.16017 9.60349C0.958224 9.40158 0.95753 9.09865 1.1565 8.89969C1.35553 8.70186 1.66027 8.69565 1.86136 8.89517L4.43794 11.4699L6.58337 9.32442L6.58337 9.32442L10.4431 5.46472L10.4431 5.46472L13.6464 2.64645Z"
                        fill=""
                      />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-bodydark dark:text-white">
                    322 352 1165
                  </p>
                </li>

                <li className="flex items-center space-x-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e7f2f6] dark:bg-[#1f2a34]">
                    <svg
                      className="fill-green-700"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.16667 1.99999H13.8333C14.2324 1.99999 14.5833 2.35097 14.5833 2.74999V13.25C14.5833 13.649 14.2324 13.9999 13.8333 13.9999H2.16667C1.76763 13.9999 1.41667 13.649 1.41667 13.25V2.74999C1.41667 2.35097 1.76763 1.99999 2.16667 1.99999ZM2.66667 3.66666L8 7.91666L13.3333 3.66666H2.66667ZM2.66667 12.3333H13.3333V4.66666L8 8.91666L2.66667 4.66666V12.3333Z"
                        fill=""
                      />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-bodydark dark:text-white">
                  info@chibata.com
                  </p>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      {/* <!-- ===== Contacto End ===== --> */}
    </>
  );
};

export default Contact;
