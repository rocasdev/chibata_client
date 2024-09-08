"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Link from "next/link";

const Footer = () => {

  const year = new Date().getFullYear()

  return (
    <>
      <footer className="border-t border-stroke bg-white dark:border-strokedark dark:bg-blacksection">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          {/* <!-- Footer Top --> */}
          <div className="py-20 lg:py-25">
            <div className="flex flex-wrap gap-8 lg:justify-between lg:gap-0">
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
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top w-1/2 lg:w-1/4"
              >
                <a href="/web/" className="relative">
                  <Image
                    width={100}
                    height={100}
                    src="/images/logo/logo-dark.svg"
                    alt="Logo"
                    className="dark:hidden"
                    priority={true}
                  />
                  <Image
                    width={120}
                    height={120}
                    src="/images/logo/logo-light.svg"
                    alt="Logo"
                    className="hidden dark:block"
                    priority={true}
                  />
                </a>

                <p className="mb-10 mt-5">
                  Chibatá es tu plataforma para organizar e inscribirte en ecoacciones locales en Bogotá. Únete a nuestra comunidad y haz la diferencia.
                </p>

                <p className="mb-1.5 text-sectiontitle uppercase tracking-[5px]">
                  contacto
                </p>
                <a
                  href="#"
                  className="text-itemtitle font-medium text-black dark:text-white"
                >
                  contacto@chibata.com
                </a>
              </motion.div>

              <div className="flex w-full flex-col gap-8 md:flex-row md:justify-between md:gap-0 lg:w-2/3 xl:w-7/12">
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
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-black dark:text-white">
                    Enlaces
                  </h4>

                  <ul>
                    <li>
                      <a
                        href="/"
                        className="mb-3 inline-block hover:text-green-700"
                      >
                        Inicio
                      </a>
                    </li>
                    <li>
                      <a
                        href="/#about"
                        className="mb-3 inline-block hover:text-green-700"
                      >
                        Sobre Nosotros
                      </a>
                    </li>
                    <li>
                      <a
                        href="/#faq"
                        className="mb-3 inline-block hover:text-green-700"
                      >
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a
                        href="/#features"
                        className="mb-3 inline-block hover:text-green-700"
                      >
                        Servicios
                      </a>
                    </li>
                  </ul>
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
                  transition={{ duration: 1, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-black dark:text-white">
                    Soporte
                  </h4>

                  <ul>
                    <li>
                      <a
                        href="#"
                        className="mb-3 inline-block hover:text-green-700"
                      >
                        Políticas
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="mb-3 inline-block hover:text-green-700"
                      >
                        Privacidad
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="mb-3 inline-block hover:text-green-700"
                      >
                        TyC
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="mb-3 inline-block hover:text-green-700"
                      >
                        Cookies
                      </a>
                    </li>
                  </ul>
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
                  transition={{ duration: 1, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-black dark:text-white">
                    Regístrate
                  </h4>
                  <p className="mb-4 w-[90%]">
                    Unete al cambio de Bogotá, una ecoaccion a la vez.
                  </p>

                  
                  <Link href="/auth/signup" className="text-green-600">Registrate como voluntario</Link>
                  <br /> <br />
                  <Link href="/auth/signuporg" className="text-green-600">Registrate como organización</Link>
                </motion.div>
              </div>
            </div>
          </div>
          {/* <!-- Footer Top --> */}

          {/* <!-- Footer Bottom --> */}
          <div className="flex flex-col flex-wrap items-center justify-center gap-5 border-t border-stroke py-7 text-center dark:border-strokedark lg:flex-row lg:justify-between">
            <p className="text-sm text-bodydark dark:text-white">
              © {year} Chibatá. Todos los derechos reservados.
            </p>

            <div className="flex gap-4">
              <a href="#" className="text-black dark:text-white hover:text-green-700">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-black dark:text-white hover:text-green-700">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-black dark:text-white hover:text-green-700">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          {/* <!-- Footer Bottom --> */}
        </div>
      </footer>
    </>
  );
};

export default Footer;
