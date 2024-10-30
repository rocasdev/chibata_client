"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";

interface User {
  user_id: string;
  firstname: string;
  surname: string;
  avatar: string;
  email: string;
  doc_type: string;
  doc_num: string;
  phone_number: string;
  is_active: boolean;
  Role: {
    name: string;
  };
}

const UserDetails = ({ id }: { id: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `https://chibataserver-production.up.railway.app/api/users/${id}`,
          {
            withCredentials: true,
          },
        );
        setUser(response.data.user);
      } catch (err) {
        setError("Error al cargar el usuario");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const getDocumentTypeLabel = (docType: string) => {
    const types = {
      CC: "Cédula de Ciudadanía",
      CE: "Cédula de Extranjería",
      PA: "Pasaporte",
    };
    return types[docType] || docType;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">No se encontró el usuario</div>
      </div>
    );
  }

  return (
    <section>
      <div className="relative z-1 mx-auto max-w-c-1016 px-7.5 pb-7.5 pt-10 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft size={20} />
              Volver
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Detalles del Usuario
          </h1>
        </div>

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
          <div className="flex flex-col items-center justify-between gap-4 border-b border-stroke pb-8 dark:border-strokedark lg:flex-row">
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full lg:h-32 lg:w-32">
                <Image
                  src={user.avatar || "/images/placeholder-avatar.jpg"}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-black dark:text-white lg:text-3xl">
                    {user.firstname} {user.surname}
                  </h2>
                  {user.is_active ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <XCircle className="text-red-500" size={24} />
                  )}
                </div>
                <p className="text-body-color dark:text-body-color-dark mt-1">
                  {user.email}
                </p>
                <p className="text-body-color dark:text-body-color-dark mt-1">
                  Rol: {user.Role.name}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8">
            <Card className="border-stroke bg-transparent dark:border-strokedark mb-4">
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
                      {getDocumentTypeLabel(user.doc_type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Número de Documento
                    </p>
                    <p className="text-black dark:text-white">{user.doc_num}</p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Teléfono
                    </p>
                    <p className="text-black dark:text-white">
                      +57 {user.phone_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-color dark:text-body-color-dark mb-1 text-sm">
                      Estado
                    </p>
                    <p className="flex items-center gap-2 text-black dark:text-white">
                      {user.is_active ? (
                        <>
                          <CheckCircle className="text-green-500" size={16} />
                          Activo
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-500" size={16} />
                          Inactivo
                        </>
                      )}
                    </p>
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

export default UserDetails;
