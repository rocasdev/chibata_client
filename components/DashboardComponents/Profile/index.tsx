"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { EditIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/context/UserContext";

interface User {
  user_id: string;
  firstname: string;
  surname: string;
  email: string;
  doc_type: string;
  doc_num: string;
  phone_number: string;
  profile_photo?: string;
  role_name: string;
  role_path: string;
}

const Profile = () => {
  const userData = useUser()
  const router = useRouter();

  const getDocumentTypeLabel = (docType: string) => {
    const types = {
      CC: "Cédula de Ciudadanía",
      CE: "Cédula de Extranjería",
      PA: "Pasaporte",
    };
    return types[docType] || docType;
  };

  return (
    <section>
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
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
          <div className="flex flex-col items-center justify-between gap-4 border-b border-stroke pb-8 dark:border-strokedark lg:flex-row">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full lg:h-32 lg:w-32">
                <Image
                  src={
                    userData?.avatar || "/images/placeholder-avatar.jpg"
                  }
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-black dark:text-white lg:text-3xl">
                  {userData?.firstname} {userData?.surname}
                </h2>
                <p className="text-body-color dark:text-body-color-dark mt-1">
                  {userData?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("settings")}
              className="flex items-center gap-2 rounded-full bg-green-800 px-6 py-3 font-medium text-white transition duration-300 ease-in-out hover:bg-blackho dark:bg-green-700 dark:hover:bg-blackho"
            >
              <EditIcon size={18} />
              Actualizar Datos
            </Button>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Card className="border-stroke bg-transparent dark:border-strokedark">
              <CardHeader className="border-b border-stroke pb-4 dark:border-strokedark">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Información Personal
                </h3>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Tipo de Documento
                    </p>
                    <p className="text-black dark:text-white">
                      {getDocumentTypeLabel(userData?.doc_type || "CC")}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Número de Documento
                    </p>
                    <p className="text-black dark:text-white">
                      {userData?.doc_num}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Teléfono
                    </p>
                    <p className="text-black dark:text-white">
                      +57 {userData?.phone_number}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stroke bg-transparent dark:border-strokedark">
              <CardHeader className="border-b border-stroke pb-4 dark:border-strokedark">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Estadísticas
                </h3>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-body-color dark:text-body-color-dark text-sm">
                      Eventos Asistidos
                    </p>
                    <p className="text-2xl font-semibold text-black dark:text-white">
                      12
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-body-color dark:text-body-color-dark text-sm">
                      Horas Voluntariado
                    </p>
                    <p className="text-2xl font-semibold text-black dark:text-white">
                      48
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-body-color dark:text-body-color-dark text-sm">
                      Organizaciones
                    </p>
                    <p className="text-2xl font-semibold text-black dark:text-white">
                      3
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-body-color dark:text-body-color-dark text-sm">
                      Eventos Futuros
                    </p>
                    <p className="text-2xl font-semibold text-black dark:text-white">
                      2
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-stroke bg-transparent dark:border-strokedark lg:col-span-2 mb-4">
              <CardHeader className="border-b border-stroke pb-4 dark:border-strokedark">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Próximos Eventos
                </h3>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Aquí podrías mapear los próximos eventos del usuario */}
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <div>
                      <h4 className="font-semibold text-black dark:text-white">
                        Limpieza de Playa
                      </h4>
                      <p className="text-body-color dark:text-body-color-dark text-sm">
                        15 de Octubre, 2024 • 9:00 AM
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full border-green-800 text-green-800 hover:bg-green-800 hover:text-white dark:border-green-700 dark:text-green-700 dark:hover:bg-green-700 dark:hover:text-white"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
